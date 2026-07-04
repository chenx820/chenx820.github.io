import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
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
  LightBoxCloseButton,
} from "./Gallery.style";

const Card = React.memo(({ photoItem, currentImg, openLightbox }) => (
  <PhotoCard>
    <div
      style={{ width: "100%", height: "100%" }}
      onClick={() => openLightbox(currentImg)}
    >
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
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
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
  const openLightbox = useCallback((img) => {
    setSelectedImg(img);
    setLightboxOpen(true);
  }, []);

  function closeLightBox(e) {
    if (e.target.tagName !== "IMG") {
      setSelectedImg(null);
      setLightboxOpen(false);
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
        {photo.allPhotosJson.edges.map(({ node }) => (
          <PhotoTheme key={node.id}>
            <PhotoThemeHeader>
              <p className="photo-theme__date">{node.date}</p>
              <h3>{node.title}</h3>
              <p className="photo-theme__description">{node.description}</p>
            </PhotoThemeHeader>

            <PhotoThemeGrid>
              {node.photos.map((photoItem) => {
                const currentImg = imageByFilename[photoItem.links.image];

                if (!currentImg) {
                  return null;
                }

                return (
                  <Card
                    key={photoItem.links.image}
                    photoItem={photoItem}
                    currentImg={currentImg}
                    openLightbox={openLightbox}
                  />
                );
              })}
            </PhotoThemeGrid>
          </PhotoTheme>
        ))}

        {!showAll && (
          <Button onClick={handleShowAll} className="showall__button">
            {t("gallery.show-all")}
          </Button>
        )}
      </PhotoTimeline>

      {isLightboxOpen && isClient && MapInteractionCSS && (
        <Lightbox data-testid="lightbox" onClick={closeLightBox}>
          <MapInteractionCSS>
            <GatsbyImage
              className="lightbox__gatsbyimage"
              image={getImage(selectedImg.node.childImageSharp.gatsbyImageData)}
            />
          </MapInteractionCSS>

          <LightBoxCloseButton
            tabindex="1"
            onClick={closeLightBox}
            aria-label="Close Lightbox"
          >
            <FontAwesomeIcon icon="times" size="2x" />
          </LightBoxCloseButton>
        </Lightbox>
      )}
    </PhotosWrapper>
  );
};

Card.propTypes = {
  photoItem: PropTypes.object.isRequired,
  currentImg: PropTypes.object.isRequired,
  openLightbox: PropTypes.func.isRequired,
};

export default Gallery;
