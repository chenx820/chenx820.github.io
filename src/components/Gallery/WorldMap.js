import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import land from "./worldLand.json";
import IslandDetails from "./IslandDetails";
import { MapCanvas, MapControls, MapViewport } from "./Gallery.style";
import {
  WORLD_WIDTH as W,
  WORLD_HEIGHT as H,
  WORLD_VIEW,
  MAX_ZOOM,
  clampView,
  zoomView,
  project,
  clusterCities,
} from "./mapGeometry.mjs";

export default function WorldMap({
  cities,
  language,
  selectedCity,
  onSelect,
  view,
  setView,
}) {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const viewportRef = useRef(null);
  const viewRef = useRef(view);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const [size, setSize] = useState({ width: 1000, height: 500 });
  const [dragging, setDragging] = useState(false);
  viewRef.current = view;
  const baseScale = Math.min(size.width / W, size.height / H);
  const unit = 1 / (baseScale * view.zoom);
  const clusters = clusterCities(cities, baseScale * view.zoom).filter(
    (group) =>
      Math.abs(group.x - view.x) <= (size.width * unit) / 2 &&
      Math.abs(group.y - view.y) <= (size.height * unit) / 2,
  );

  useEffect(() => {
    const city = cities.find((item) => item.slug === selectedCity);
    if (!city) return;
    const bounds = viewportRef.current.getBoundingClientRect();
    const selectionScale = Math.min(bounds.width / W, bounds.height / H);
    const [x, y] = project(city.coordinates);
    const nearest = Math.min(
      ...cities
        .filter((item) => item.slug !== selectedCity)
        .map((item) => {
          const point = project(item.coordinates);
          return Math.hypot(point[0] - x, point[1] - y);
        }),
    );
    // Keep the selected pin separate even when the album reduces map width.
    setView(
      clampView({
        x,
        y,
        zoom: Math.max(2.5, 58 / (nearest * selectionScale)),
      }),
    );
  }, [selectedCity, cities, setView]);

  useEffect(() => {
    const element = viewportRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const wheel = (event) => {
      event.preventDefault();
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const anchor = point.matrixTransform(svg.getScreenCTM().inverse());
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1);
      setView(
        zoomView(
          viewRef.current,
          Math.exp(-Math.max(-100, Math.min(100, delta)) * 0.008),
          [anchor.x, anchor.y],
        ),
      );
    };
    svg.addEventListener("wheel", wheel, { passive: false });
    return () => svg.removeEventListener("wheel", wheel);
  }, [setView]);

  function startGesture() {
    gesture.current = {
      view: viewRef.current,
      points: [...pointers.current.values()],
    };
  }

  function pointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, [event.clientX, event.clientY]);
    startGesture();
    setDragging(true);
  }

  function pointerMove(event) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, [event.clientX, event.clientY]);
    const current = [...pointers.current.values()];
    const start = gesture.current;
    const scale = baseScale * start.view.zoom;
    if (current.length === 1) {
      setView(
        clampView({
          ...start.view,
          x: start.view.x - (current[0][0] - start.points[0][0]) / scale,
          y: start.view.y - (current[0][1] - start.points[0][1]) / scale,
        }),
      );
    } else if (current.length >= 2 && start.points.length >= 2) {
      const midpoint = (points) => [
        (points[0][0] + points[1][0]) / 2,
        (points[0][1] + points[1][1]) / 2,
      ];
      const distance = (points) =>
        Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]);
      const before = midpoint(start.points);
      const after = midpoint(current);
      const rect = svgRef.current.getBoundingClientRect();
      const anchor = [
        start.view.x + (before[0] - rect.left - rect.width / 2) / scale,
        start.view.y + (before[1] - rect.top - rect.height / 2) / scale,
      ];
      const next = zoomView(
        start.view,
        distance(current) / Math.max(1, distance(start.points)),
        anchor,
      );
      setView(
        clampView({
          ...next,
          x: next.x - (after[0] - before[0]) / (baseScale * next.zoom),
          y: next.y - (after[1] - before[1]) / (baseScale * next.zoom),
        }),
      );
    }
  }

  function pointerUp(event) {
    pointers.current.delete(event.pointerId);
    startGesture();
    setDragging(pointers.current.size > 0);
  }

  function keyboard(event) {
    if (event.target !== event.currentTarget) return;
    const pan = 60 * unit;
    const moves = {
      ArrowLeft: [-pan, 0],
      ArrowRight: [pan, 0],
      ArrowUp: [0, -pan],
      ArrowDown: [0, pan],
    };
    if (moves[event.key]) {
      event.preventDefault();
      setView(
        clampView({
          ...view,
          x: view.x + moves[event.key][0],
          y: view.y + moves[event.key][1],
        }),
      );
    } else if (["+", "=", "-", "Home"].includes(event.key)) {
      event.preventDefault();
      setView(
        event.key === "Home"
          ? WORLD_VIEW
          : zoomView(view, event.key === "-" ? 0.5 : 2),
      );
    }
  }

  function activate(group) {
    if (group.cities.length === 1) onSelect(group.cities[0]);
    else {
      const zoom = Math.min(MAX_ZOOM, view.zoom * 2.5);
      setView(clampView({ x: group.x, y: group.y, zoom }));
      // A cluster disappears on expansion; keep keyboard focus on the map.
      svgRef.current.focus({ preventScroll: true });
    }
  }

  return (
    <MapViewport ref={viewportRef}>
      <MapCanvas
        ref={svgRef}
        role="group"
        aria-label={t("gallery.map-label")}
        aria-describedby="map-keyboard-help"
        tabIndex={0}
        data-testid="world-map"
        data-zoom={view.zoom.toFixed(2)}
        $dragging={dragging}
        viewBox={`${view.x - W / view.zoom / 2} ${view.y - H / view.zoom / 2} ${W / view.zoom} ${H / view.zoom}`}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onLostPointerCapture={pointerUp}
        onKeyDown={keyboard}
      >
        <defs>
          <pattern
            id="gallery-ocean-waves"
            width="72"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 23 Q16 27 22 23 M46 7 Q52 11 58 7"
              className="ocean-wave"
            />
            <circle className="ocean-dot" cx="38" cy="35" r="1.2" />
          </pattern>
          <pattern
            id="gallery-island-grass"
            width="42"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <rect className="grass-base" width="42" height="36" />
            <path
              className="grass-texture"
              d="M7 14 L11 7 L15 14Z M28 31 L31 26 L34 31Z"
            />
          </pattern>
        </defs>
        <rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="url(#gallery-ocean-waves)"
          aria-hidden="true"
          pointerEvents="none"
        />
        <g className="map-shallows" aria-hidden="true" pointerEvents="none">
          {land.paths.map((path, index) => (
            <path key={index} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g className="map-beach" aria-hidden="true" pointerEvents="none">
          {land.paths.map((path, index) => (
            <path key={index} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g className="map-land" aria-hidden="true">
          {land.paths.map((path, index) => (
            <path key={index} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {view.zoom < 2 && <IslandDetails />}
        {clusters.map((group) => {
          const city = group.cities[0];
          const multiple = group.cities.length > 1;
          const active = group.cities.some(
            (item) => item.slug === selectedCity,
          );
          const label = multiple
            ? t("gallery.expand-cluster", {
                count: group.cities.length,
                cities: group.cities
                  .map((item) => item.name[language])
                  .join(language === "zh" ? "、" : ", "),
              })
            : t("gallery.open-city", { city: city.name[language] });
          return (
            <g
              key={group.cities
                .map((item) => item.slug)
                .sort()
                .join("-")}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={active}
              data-testid={multiple ? "map-cluster" : `map-marker-${city.slug}`}
              className={`map-marker ${active ? "is-active" : ""}`}
              transform={`translate(${group.x} ${group.y}) scale(${unit})`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => activate(group)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  activate(group);
                }
              }}
            >
              <title>{label}</title>
              <circle className="marker-hit" cy={-12} r={26} />
              <ellipse
                className="marker-ground"
                cy={6}
                rx={multiple ? 17 : 10}
                ry={4}
              />
              <circle className="marker-halo" cy={-12} r={25} />
              {multiple ? (
                <>
                  <circle className="marker-cluster" cy={-10} r={18} />
                  <text textAnchor="middle" y={-5} className="marker-number">
                    {group.cities.length}
                  </text>
                </>
              ) : (
                <>
                  <path
                    className="marker-dot"
                    d="M-14 -29 Q-14 -35 -8 -35 H8 Q14 -35 14 -29 V-14 Q14 -8 8 -8 H4 L0 -2 L-4 -8 H-8 Q-14 -8 -14 -14Z"
                  />
                  <path
                    className="marker-camera"
                    d="M-7 -26 H-4 L-2 -29 H3 L5 -26 H7 Q9 -26 9 -24 V-17 Q9 -15 7 -15 H-7 Q-9 -15 -9 -17 V-24 Q-9 -26 -7 -26Z"
                  />
                  <circle className="marker-center" cy={-21} r={3.3} />
                </>
              )}
              {!multiple && (
                <text textAnchor="middle" y={-43} className="marker-label">
                  {city.name[language]}
                </text>
              )}
            </g>
          );
        })}
      </MapCanvas>
      <MapControls aria-label={t("gallery.map-label")}>
        <button
          type="button"
          onClick={() => setView(zoomView(view, 2))}
          disabled={view.zoom >= MAX_ZOOM}
          aria-label={t("gallery.zoom-in")}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setView(zoomView(view, 0.5))}
          disabled={view.zoom <= 1}
          aria-label={t("gallery.zoom-out")}
        >
          −
        </button>
        <button
          type="button"
          className="map-reset"
          onClick={() => setView(WORLD_VIEW)}
        >
          {t("gallery.reset-map")}
        </button>
      </MapControls>
      <a
        className="map-credit"
        href={land.url}
        target="_blank"
        rel="noreferrer"
      >
        {t("gallery.map-credit")}
      </a>
      <span id="map-keyboard-help" className="sr-only">
        {t("gallery.map-keyboard")}
      </span>
    </MapViewport>
  );
}
