import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { useInView } from "react-intersection-observer";

import logo from "@src/static/logo_white.svg";

const IframeWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
  background-color: ${(props) => props.theme.accentColor};
  border-radius: 10px;

  /* @media ${(props) => props.theme.media.tablet} {
    min-height: 100px;
  } */
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const LoaderWrapper = styled.div`
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 60px;
    animation: loaderPulse 1.2s infinite ease-in-out alternate;
  }

  @keyframes loaderPulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <img src={logo} alt="loading" />
    </LoaderWrapper>
  );
};

const IFrame = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const handleLoaded = () => {
    setIsLoading(false);
  };

  return (
    <IframeWrapper className="iframe-wrapper" ref={ref}>
      <iframe
        title={src}
        style={{ opacity: isLoading ? "0" : "1" }}
        src={inView ? src : undefined}
        onLoad={handleLoaded}
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
        allowFullScreen
      />
      {isLoading && <Loader />}
    </IframeWrapper>
  );
};

IFrame.propTypes = {
  src: PropTypes.string.isRequired,
};

export default IFrame;
