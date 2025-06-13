import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useStaticQuery, graphql } from "gatsby";

const AvatarWrapper = styled.div`
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 5px solid #f8f8f8;
  overflow: hidden;
  margin: 0;
  background-color: #f8f8f8;
`;

const Avatar = ({ src }) => {
  const data = useStaticQuery(graphql`
    query {
      file(name: { eq: "avatar" }) {
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
            width: 230
            height: 230
            quality: 90
            placeholder: BLURRED
          )
        }
      }
    }
  `);

  const image = getImage(data.file.childImageSharp.gatsbyImageData);

  return (
    <AvatarWrapper>
      <GatsbyImage image={image} alt="Chen Huang" />
    </AvatarWrapper>
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Avatar;
