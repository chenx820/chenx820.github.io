import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
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
        publicURL
      }
    }
  `);

  return (
    <AvatarWrapper>
      <img
        src={data.file.publicURL}
        alt="Chen Huang"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AvatarWrapper>
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Avatar;
