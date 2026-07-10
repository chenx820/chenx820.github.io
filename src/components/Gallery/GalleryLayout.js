import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image";
import IFrame from "@common/IFrame";

import PageHeader from "@common/PageHeader";
import Button from "@common/Button";

import HighlightTemplate from "./HighlightTemplate";
import { HighlightPreview } from "./HighlightTemplate.style";

import {
  PhotosWrapper,
  PhotoTimeline,
  PhotoTheme,
  PhotoThemeGrid,
  PhotoThemeHeader,
  PhotoCard,
  PhotoCardFooter,
  Lightbox,
  LightboxCaption,
  LightboxNavButton,
  LightBoxCloseButton,
} from "./Gallery.style";

const Card = React.memo(({ photoItem, currentImg, onOpen }) => (
  <PhotoCard>
    <div style={{ width: "100%", height: "100%" }} onClick={onOpen}>
      <GatsbyImage
        image={getImage(currentImg.node.childImageSharp.gatsbyImageData)}
        alt={photoItem.title}
      />
    </div>

    <PhotoCardFooter
      nowrap
      align="center"
      justify="space-between"
      className="ccard__footer"
      onClick={(e) => e.stopPropagation()}
    >
      <p>{photoItem.title}</p>
    </PhotoCardFooter>
  </PhotoCard>
));

const Gallery = () => {
  const { t } = useTranslation();
  const [lightbox, setLightbox] = useState(null); // { entries, index }
  const [showAll, setShowAll] = useState(false);
  const [MapInteractionCSS, setMapInteractionCSS] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      import("react-map-interaction")
        .then((module) => {
          setMapInteractionCSS(() => module.MapInteractionCSS);
        })
        .catch((err) => {
          console.error("Failed to load MapInteractionCSS:", err);
        });
    }
  }, []);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const openLightbox = useCallback((entries, index) => {
    setLightbox({ entries, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const showPrev = useCallback(() => {
    setLightbox(
      (lb) =>
        lb && {
          ...lb,
          index: (lb.index - 1 + lb.entries.length) % lb.entries.length,
        }
    );
  }, []);

  const showNext = useCallback(() => {
    setLightbox(
      (lb) => lb && { ...lb, index: (lb.index + 1) % lb.entries.length }
    );
  }, []);

  // Keyboard navigation + scroll lock while the lightbox is open
  useEffect(() => {
    if (!lightbox) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox, showPrev, showNext]);

  function handleBackdropClick(e) {
    if (e.target.tagName !== "IMG") {
      closeLightbox();
    }
  }

  const photo = useStaticQuery(graphql`
    {
      allPhotosJson(sort: { sortDate: ASC }) {
        edges {
          node {
            id
            date
            description
            sortDate
            title
            photos {
              title
              links {
                image
              }
            }
          }
        }
      }
      allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          name: { regex: "/^photo_/" }
        }
        sort: { name: ASC }
      ) {
        edges {
          node {
            base
            name
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, quality: 90, width: 1200)
            }
          }
        }
      }
    }
  `);

  const imageByFilename = photo.allFile.edges.reduce((images, image) => {
    images[image.node.base] = image;
    return images;
  }, {});

  const current = lightbox && lightbox.entries[lightbox.index];
  const hasMultiple = lightbox && lightbox.entries.length > 1;

  return (
    <PhotosWrapper id="photo">
      <HighlightTemplate
        title={t("gallery.highlight-title")}
        desc={t("gallery.highlight-desc")}
        preview={
          <HighlightPreview>
            <IFrame src="https://www.youtube.com/embed/PSpghrPLQXI?rel=0&autoplay=0" />
            {/* <IFrame src="//player.bilibili.com/player.html?isOutside=true&aid=113735146471931&bvid=BV1ao68YmEDC&cid=27591446473&p=1" /> */}
          </HighlightPreview>
        }
      />
      <PageHeader>{t("gallery.photography")}</PageHeader>
      <PhotoTimeline collapseHeight="1450px" showAll={showAll}>
        {photo.allPhotosJson.edges.map(({ node }) => {
          const entries = node.photos
            .map((photoItem) => ({
              photoItem,
              img: imageByFilename[photoItem.links.image],
            }))
            .filter((entry) => entry.img);

          return (
            <PhotoTheme key={node.id}>
              <PhotoThemeHeader>
                <p className="photo-theme__date">{node.date}</p>
                <h3>{node.title}</h3>
                <p className="photo-theme__description">{node.description}</p>
              </PhotoThemeHeader>

              <PhotoThemeGrid>
                {entries.map((entry, index) => (
                  <Card
                    key={entry.photoItem.links.image}
                    photoItem={entry.photoItem}
                    currentImg={entry.img}
                    onOpen={() => openLightbox(entries, index)}
                  />
                ))}
              </PhotoThemeGrid>
            </PhotoTheme>
          );
        })}

        {!showAll && (
          <Button onClick={handleShowAll} className="showall__button">
            {t("gallery.show-all")}
          </Button>
        )}
      </PhotoTimeline>

      {lightbox && isClient && MapInteractionCSS && (
        <Lightbox data-testid="lightbox" onClick={handleBackdropClick}>
          <MapInteractionCSS key={lightbox.index}>
            <div className="lightbox__stage">
              <img
                className="lightbox__image"
                src={getSrc(current.img.node.childImageSharp.gatsbyImageData)}
                alt={current.photoItem.title}
                draggable="false"
              />
            </div>
          </MapInteractionCSS>

          {hasMultiple && (
            <>
              <LightboxNavButton
                className="lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
              >
                <FontAwesomeIcon icon="chevron-left" />
              </LightboxNavButton>
              <LightboxNavButton
                className="lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
              >
                <FontAwesomeIcon icon="chevron-right" />
              </LightboxNavButton>
            </>
          )}

          <LightboxCaption onClick={(e) => e.stopPropagation()}>
            <p className="lightbox__title">{current.photoItem.title}</p>
            {hasMultiple && (
              <span className="lightbox__counter">
                {lightbox.index + 1} / {lightbox.entries.length}
              </span>
            )}
          </LightboxCaption>

          <LightBoxCloseButton
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close Lightbox"
          >
            <FontAwesomeIcon icon="times" />
          </LightBoxCloseButton>
        </Lightbox>
      )}
    </PhotosWrapper>
  );
};

Card.propTypes = {
  photoItem: PropTypes.object.isRequired,
  currentImg: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default Gallery;
