export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 500;
export const MAX_ZOOM = 128;
export const WORLD_VIEW = { x: 500, y: 250, zoom: 1 };

// Equirectangular projection, matching the bundled Natural Earth land paths.
export function project([longitude, latitude]) {
  return [
    ((longitude + 180) / 360) * WORLD_WIDTH,
    ((90 - latitude) / 180) * WORLD_HEIGHT,
  ];
}

export function clampView(view) {
  const zoom = Math.max(1, Math.min(MAX_ZOOM, view.zoom));
  const halfWidth = WORLD_WIDTH / zoom / 2;
  const halfHeight = WORLD_HEIGHT / zoom / 2;
  return {
    zoom,
    x: Math.max(halfWidth, Math.min(WORLD_WIDTH - halfWidth, view.x)),
    y: Math.max(halfHeight, Math.min(WORLD_HEIGHT - halfHeight, view.y)),
  };
}

export function zoomView(view, factor, anchor = [view.x, view.y]) {
  const zoom = Math.max(1, Math.min(MAX_ZOOM, view.zoom * factor));
  return clampView({
    zoom,
    x: anchor[0] + ((view.x - anchor[0]) * view.zoom) / zoom,
    y: anchor[1] + ((view.y - anchor[1]) * view.zoom) / zoom,
  });
}

// Connected components keep every city in exactly one cluster. Distance is in
// screen pixels, so touch targets remain separate at any viewport size or zoom.
export function clusterCities(cities, pixelsPerUnit, threshold = 48) {
  const pending = cities.map((city) => ({
    city,
    point: project(city.coordinates),
  }));
  const groups = [];
  while (pending.length) {
    const members = [pending.shift()];
    for (let i = 0; i < members.length; i++) {
      for (let j = pending.length - 1; j >= 0; j--) {
        if (
          Math.hypot(
            members[i].point[0] - pending[j].point[0],
            members[i].point[1] - pending[j].point[1],
          ) *
            pixelsPerUnit <
          threshold
        ) {
          members.push(pending.splice(j, 1)[0]);
        }
      }
    }
    groups.push({
      cities: members.map((member) => member.city),
      x:
        members.reduce((sum, member) => sum + member.point[0], 0) /
        members.length,
      y:
        members.reduce((sum, member) => sum + member.point[1], 0) /
        members.length,
    });
  }
  return groups;
}
