import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image";
import cities from "../../../content/json/photos.json";
import WorldMap from "./WorldMap";
import { WORLD_VIEW } from "./mapGeometry.mjs";
import {
  PhotosWrapper,
  GalleryHeader,
  MapFrame,
  CityList,
  CityAlbum,
  AlbumGrid,
  PhotoCard,
  Lightbox,
  LightboxCaption,
  LightboxNavButton,
  LightBoxCloseButton,
} from "./Gallery.style";

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("zh") ? "zh" : "en";
  const [selectedCity, setSelectedCity] = useState(null);
  const [view, setView] = useState(WORLD_VIEW);
  const [lightbox, setLightbox] = useState(null);
  const [MapInteractionCSS, setMapInteractionCSS] = useState(null);
  const albumHeading = useRef(null);
  const galleryRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const photoOpener = useRef(null);

  useEffect(() => {
    import("react-map-interaction")
      .then((module) => setMapInteractionCSS(() => module.MapInteractionCSS))
      .catch(() => {
        /* The full-size image remains usable without pan/zoom. */
      });
  }, []);

  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          name: { regex: "/^photo_/" }
        }
      ) {
        edges {
          node {
            base
            childImageSharp {
              thumb: gatsbyImageData(
                layout: CONSTRAINED
                width: 480
                quality: 70
                placeholder: BLURRED
              )
              full: gatsbyImageData(
                layout: CONSTRAINED
                width: 1600
                quality: 85
              )
            }
          }
        }
      }
    }
  `);
  const imageByFilename = useMemo(
    () =>
      Object.fromEntries(
        data.allFile.edges.map(({ node }) => [node.base, node.childImageSharp]),
      ),
    [data],
  );
  const album = cities.find((city) => city.slug === selectedCity);

  useEffect(() => {
    if (selectedCity) {
      albumHeading.current?.focus({ preventScroll: true });
      albumHeading.current?.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
    }
  }, [selectedCity]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepPhoto = useCallback((step) => {
    setLightbox(
      (current) =>
        current && {
          ...current,
          index:
            (current.index + step + current.photos.length) %
            current.photos.length,
        },
    );
  }, []);
  const isLightboxOpen = Boolean(lightbox);
  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function keydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepPhoto(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepPhoto(1);
      } else if (event.key === "Tab") {
        const controls = [
          ...dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], [tabindex="0"]',
          ),
        ];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !dialogRef.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !dialogRef.current.contains(document.activeElement))
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keydown);
      photoOpener.current?.focus({ preventScroll: true });
    };
  }, [isLightboxOpen, closeLightbox, stepPhoto]);

  function closeAlbum() {
    setSelectedCity(null);
    galleryRef.current
      ?.querySelector(`[data-city="${selectedCity}"]`)
      ?.focus({ preventScroll: true });
  }
  const current = lightbox?.photos[lightbox.index];
  const image = current && (
    <div className="lightbox__stage">
      <img
        className="lightbox__image"
        src={getSrc(imageByFilename[current.links.image]?.full)}
        alt={current.title[language]}
        draggable="false"
      />
    </div>
  );

  return (
    <PhotosWrapper id="photo" ref={galleryRef}>
      <GalleryHeader>
        <h1>{t("gallery.title")}</h1>
      </GalleryHeader>
      <MapFrame $hasAlbum={Boolean(album)}>
        <WorldMap
          cities={cities}
          language={language}
          selectedCity={selectedCity}
          onSelect={(city) => setSelectedCity(city.slug)}
          view={view}
          setView={setView}
        />
        {album && (
          <CityAlbum
            aria-labelledby="city-album-title"
            data-testid="city-album"
            onKeyDown={(event) => {
              if (event.key === "Escape" && !lightbox) closeAlbum();
            }}
          >
            <div className="album-heading">
              <div>
                <p className="album-country">{album.country[language]}</p>
                <h2 id="city-album-title" ref={albumHeading} tabIndex={-1}>
                  {album.name[language]}
                </h2>
              </div>
              <button
                type="button"
                className="album-close"
                onClick={closeAlbum}
                aria-label={t("gallery.close-album")}
              >
                ×
              </button>
            </div>
            <AlbumGrid>
              {album.photos.map((photo, index) => (
                <PhotoCard
                  key={photo.links.image}
                  type="button"
                  aria-label={t("gallery.open-photo", {
                    title: photo.title[language],
                  })}
                  onClick={(event) => {
                    photoOpener.current = event.currentTarget;
                    setLightbox({ photos: album.photos, index });
                  }}
                >
                  <GatsbyImage
                    image={getImage(imageByFilename[photo.links.image]?.thumb)}
                    alt={photo.title[language]}
                  />
                  <span>{photo.title[language]}</span>
                </PhotoCard>
              ))}
            </AlbumGrid>
          </CityAlbum>
        )}
      </MapFrame>
      <CityList aria-label={t("gallery.city-list")}>
        {cities.map((city) => (
          <button
            type="button"
            key={city.slug}
            data-city={city.slug}
            aria-pressed={selectedCity === city.slug}
            aria-controls={album ? "city-album-title" : undefined}
            onClick={() => setSelectedCity(city.slug)}
          >
            <span className="city-dot" aria-hidden="true" />
            {city.name[language]}
          </button>
        ))}
      </CityList>
      {lightbox && (
        <Lightbox
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.photo-viewer")}
          data-testid="lightbox"
        >
          {MapInteractionCSS ? (
            <MapInteractionCSS
              key={current.links.image}
              minScale={1}
              maxScale={5}
            >
              {image}
            </MapInteractionCSS>
          ) : (
            image
          )}
          {lightbox.photos.length > 1 && (
            <>
              <LightboxNavButton
                className="lightbox__nav--prev"
                onClick={() => stepPhoto(-1)}
                aria-label={t("gallery.previous-photo")}
              >
                {t("gallery.previous-photo")}
              </LightboxNavButton>
              <LightboxNavButton
                className="lightbox__nav--next"
                onClick={() => stepPhoto(1)}
                aria-label={t("gallery.next-photo")}
              >
                {t("gallery.next-photo")}
              </LightboxNavButton>
            </>
          )}
          <LightboxCaption aria-live="polite">
            <p className="lightbox__title">{current.title[language]}</p>
            <span className="lightbox__counter">
              {lightbox.index + 1} / {lightbox.photos.length}
            </span>
          </LightboxCaption>
          <LightBoxCloseButton
            ref={closeRef}
            onClick={closeLightbox}
            aria-label={t("gallery.close-lightbox")}
          >
            ×
          </LightBoxCloseButton>
        </Lightbox>
      )}
    </PhotosWrapper>
  );
}
