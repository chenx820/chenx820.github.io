import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { MapInteractionCSS } from "react-map-interaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import IFrame from "@common/IFrame";

import PageHeader from "@common/PageHeader";
import Button from "@common/Button";
import Grid from "@common/Grid";

import HighlightTemplate from "./HighlightTemplate";
import { HighlightPreview } from "./HighlightTemplate.style";

import {
  PhotosWrapper,
  PhotoCard,
  PhotoCardFooter,
  Lightbox,
  LightBoxCloseButton,
} from "./Gallery.style";

const Card = React.memo(({ nodes, currentImg, openLightbox }) => (
  <PhotoCard>
    <div
      style={{ width: "100%", height: "100%" }}
      onClick={() => openLightbox(currentImg)}
    >
      <GatsbyImage
        image={getImage(currentImg.node.childImageSharp.gatsbyImageData)}
        alt={nodes.node.title}
      />
    </div>

    <PhotoCardFooter
      nowrap
      align="center"
      justify="space-between"
      className="ccard__footer"
      onClick={(e) => e.stopPropagation()}
    >
      <p>{nodes.node.title}</p>
    </PhotoCardFooter>
  </PhotoCard>
));

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  const photo = useStaticQuery(
    graphql`
      query {
        allPhotosJson(sort: { fields: links___image }) {
          edges {
            node {
              id
              description
              title
              links {
                image
              }
            }
          }
        }
        allFile(
          filter: {
            sourceInstanceName: { eq: "images" }
            name: { regex: "/^photo_/" }
          }
          sort: { fields: name }
        ) {
          edges {
            node {
              name
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  quality: 90
                  width: 1200
                  placeholder: BLURRED
                )
              }
            }
          }
        }
      }
    `
  );

  return (
    <PhotosWrapper id="photo">
      <HighlightTemplate
        title="2024 Journey Highlights"
        desc="This year's adventures took me through breathtaking landscapes and vibrant cities across many countries."
        preview={
          <HighlightPreview>
            <IFrame src="https://www.youtube.com/embed/PSpghrPLQXI?rel=0&autoplay=0" />
          </HighlightPreview>
        }
      />
      <PageHeader>Photography</PageHeader>
      <Grid collapseHeight="1000px" showAll={showAll}>
        {photo.allPhotosJson.edges.map((nodes, index) => {
          let currentImg = photo.allFile.edges[index];
          return (
            <Card
              key={nodes.node.id}
              nodes={nodes}
              currentImg={currentImg}
              openLightbox={openLightbox}
            />
          );
        })}

        {!showAll && (
          <Button onClick={handleShowAll} className="showall__button">
            Show all
          </Button>
        )}
      </Grid>

      {isLightboxOpen && (
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
  nodes: PropTypes.object.isRequired,
  currentImg: PropTypes.object.isRequired,
  openLightbox: PropTypes.func.isRequired,
};

export default Gallery;
