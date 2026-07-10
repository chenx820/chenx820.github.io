import styled, { keyframes } from "styled-components";

import { Card, CardFooter } from "@common/Card";

export const PhotosWrapper = styled.section`
  ${(props) => props.theme.spacing.sectionBottom};
`;

export const PhotoTimeline = styled.div`
  overflow: hidden;
  position: relative;
  max-height: ${(p) => (p.showAll ? "100%" : p.collapseHeight)};

  ${(p) =>
    !p.showAll &&
    `
      &:before {
        content: "";
        width: 100%;
        height: 300px;
        position: absolute;
        border-radius: 10px;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0), 40%, ${p.theme.bgColor});
        z-index: 5;
        transition: 0.3s;
      }
    `}

  .showall__button {
    position: absolute;
    bottom: 50px;
    left: 50%;
    z-index: 6;
    padding: 15px 40px;
    font-weight: bold;
    transform: translateX(-50%);
  }
`;

export const PhotoTheme = styled.article`
  margin: 0 auto 70px;
  max-width: 1180px;
`;

export const PhotoThemeHeader = styled.header`
  margin: 0 5px 22px;

  .photo-theme__date {
    margin: 0 0 8px;
    color: ${(props) => props.theme.primaryColor};
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h3 {
    margin: 0 0 8px;
    color: ${(props) => props.theme.textColor};
    font-size: 1.55rem;
  }

  .photo-theme__description {
    margin: 0;
    max-width: 660px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.78;
    line-height: 1.7;
  }
`;

export const PhotoThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: center;
  align-items: center;
  gap: 50px 20px;
  padding: 5px;
`;

export const PhotoCard = styled(Card)`
  justify-self: center;

  margin: 0;
  position: relative;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  min-width: unset;
  width: 100%;

  height: auto;
  max-width: 90%;

  transform: translateY(0px);
  transition: transform 0.2s ease;
  &:hover {
    transition: transform 0.2s ease;
    transform: translateY(-5px);
  }

  h4 {
    font-weight: normal;
  }

  .gatsby-image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .thumbnail-a {
    width: 100%;
    height: 100%;
  }

  overflow: hidden;
  height: 300px;

  cursor: pointer;

  &:hover .ccard__footer {
    bottom: 0;
    opacity: 1;
    transition: 0.3s ease-in-out;
  }
`;

export const PhotoCardFooter = styled(CardFooter)`
  position: absolute;
  bottom: -100px;
  left: 0;
  opacity: 0;
  transition: 0.3s ease-in-out;
  padding: 10px 15px;
  background: ${(props) => props.theme.secondaryColor};

  @media ${(props) => props.theme.media.mobile} {
    bottom: 0;
    opacity: 1;
  }
`;

// LIGHTBOX
const lightboxFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const lightboxZoomIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const lightboxControl = `
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.26);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
`;

export const LightBoxCloseButton = styled.button`
  ${lightboxControl}
  position: fixed;
  top: 22px;
  right: 22px;
  z-index: 5002;
  width: 44px;
  height: 44px;
  font-size: 1.1rem;

  &:hover {
    transform: rotate(90deg);
  }
`;

export const LightboxNavButton = styled.button`
  ${lightboxControl}
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5002;
  width: 48px;
  height: 48px;
  font-size: 1.15rem;

  &:hover {
    transform: translateY(-50%) scale(1.08);
  }

  &.lightbox__nav--prev {
    left: 22px;
  }

  &.lightbox__nav--next {
    right: 22px;
  }

  @media ${(props) => props.theme.media.tablet} {
    width: 40px;
    height: 40px;
    font-size: 1rem;

    &.lightbox__nav--prev {
      left: 10px;
    }

    &.lightbox__nav--next {
      right: 10px;
    }
  }
`;

export const LightboxCaption = styled.div`
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 5002;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: min(640px, calc(100vw - 32px));
  padding: 10px 22px;
  border-radius: 999px;
  background: rgba(18, 20, 26, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);

  .lightbox__title {
    margin: 0;
    color: #fff;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lightbox__counter {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
  }
`;

export const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
  background: rgba(8, 9, 12, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${lightboxFadeIn} 0.25s ease;

  .lightbox__stage {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 56px 90px 100px;
    box-sizing: border-box;

    @media ${(props) => props.theme.media.tablet} {
      padding: 56px 14px 110px;
    }
  }

  .lightbox__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.55);
    animation: ${lightboxZoomIn} 0.3s ease;
    user-select: none;
    -webkit-user-drag: none;
  }
`;
