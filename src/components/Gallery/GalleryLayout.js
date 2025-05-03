import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { MapInteractionCSS } from "react-map-interaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Img from "gatsby-image";

import PageHeader from "@common/PageHeader";
import Button, { IconButton } from "@common/Button";
import Grid from "@common/Grid";

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
      <Img
        fluid={currentImg.node.childImageSharp.fluid}
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
          filter: { name: { regex: "/^photo_/" } }
          sort: { fields: name }
        ) {
          edges {
            node {
              relativePath
              childImageSharp {
                fluid(quality: 90, maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `
  );

  return (
    <PhotosWrapper id="photo">
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
            <Img
              className="lightbox__gatsbyimage"
              fluid={selectedImg.node.childImageSharp.fluid}
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
