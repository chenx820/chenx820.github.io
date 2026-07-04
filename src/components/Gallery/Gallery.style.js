import styled from "styled-components";

import { FloatingButton } from "@components/Layout/Navbar/NavMobile.style";
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
export const LightBoxCloseButton = styled(FloatingButton)`
  width: 50px;
  height: 50px;
  border: none;
  position: fixed;
  top: 50px;
  right: 20px;
  z-index: 5;

  @media ${(props) => props.theme.media.minMobile} {
    display: none;
  }
`;

export const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5000;

  .lightbox__gatsbyimage {
    transform-origin: center 0;
    transform: scale(0.7);

    @media ${(props) => props.theme.media.tablet} {
      transform: translateY(35vh) scale(0.9);
    }
  }
`;
