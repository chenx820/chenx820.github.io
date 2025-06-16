import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const Image = ({ src, alt = "", ...props }) => {
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          name
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              quality: 90
              width: 2000
              placeholder: BLURRED
            )
          }
        }
      }
    }
  `);

  const match = data.allFile.nodes.find((node) => node.name === src);
  const image = match ? getImage(match.childImageSharp.gatsbyImageData) : null;

  return image ? <GatsbyImage image={image} alt={alt} {...props} /> : null;
};

export default Image;
