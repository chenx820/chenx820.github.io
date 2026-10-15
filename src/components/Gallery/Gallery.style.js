import styled, { keyframes } from "styled-components";

export const PhotosWrapper = styled.section`
  --island-paper: ${(p) => (p.theme.dark ? "#344c43" : "#fbf6df")};
  --island-ink: ${(p) => (p.theme.dark ? "#e6edce" : "#526b50")};
  --island-line: ${(p) => (p.theme.dark ? "#637d65" : "#d5dcbc")};
  --island-leaf: ${(p) => (p.theme.dark ? "#b0d49a" : "#5b916b")};
  font-family: ${(p) => p.theme.fontFamily};
  padding-top: 26px;
  ${(p) => p.theme.spacing.sectionBottom};
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  button {
    font-family: inherit;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 3px solid ${(p) => p.theme.accentColor};
    outline-offset: 4px;
  }
`;

export const GalleryHeader = styled.header`
  margin-bottom: 28px;
  h1 {
    font-size: clamp(1.9rem, 3.3vw, 3.1rem);
    font-weight: 700;
    color: var(--island-ink);
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0;
  }
`;

export const MapFrame = styled.div`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$hasAlbum ? "minmax(0, 1fr) minmax(280px, 32%)" : "minmax(0, 1fr)"};
  border: 6px solid var(--island-paper);
  border-radius: 30px;
  overflow: hidden;
  background: var(--island-paper);
  box-shadow: 0 6px 0 ${(p) => (p.theme.dark ? "#172e2a" : "#dbe2c8")};
  @media ${(p) => p.theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const MapViewport = styled.div`
  position: relative;
  min-width: 0;
  height: clamp(420px, 46vw, 620px);
  overflow: hidden;
  background: ${(p) =>
    p.theme.dark
      ? "linear-gradient(160deg, #376c70 0%, #28575e 100%)"
      : "linear-gradient(160deg, #8ad3c4 0%, #75bfc1 100%)"};
  .map-credit {
    position: absolute;
    left: 18px;
    bottom: 15px;
    font-size: 0.6rem;
    color: ${(p) => (p.theme.dark ? "#e2efcf" : "#355b56")};
    background: ${(p) => (p.theme.dark ? "#28575ed9" : "#a0dccec9")};
    border-radius: 6px;
    padding: 3px 6px;
  }
  @media ${(p) => p.theme.media.tablet} {
    height: clamp(280px, 66vw, 400px);
  }
`;

export const MapCanvas = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  user-select: none;
  cursor: ${(p) => (p.$dragging ? "grabbing" : "grab")};
  &:focus-visible {
    outline: 3px solid ${(p) => p.theme.accentColor};
    outline-offset: -5px;
  }
  .ocean-wave {
    fill: none;
    stroke: #e8f7df;
    stroke-width: 2;
    stroke-linecap: round;
    opacity: 0.32;
  }
  .ocean-dot {
    fill: #e8f7df;
    opacity: 0.35;
  }
  .map-shallows,
  .map-beach,
  .map-land {
    stroke-linejoin: round;
    stroke-linecap: round;
    fill-rule: evenodd;
  }
  .map-shallows {
    fill: none;
    stroke: ${(p) => (p.theme.dark ? "#69a69d" : "#c1ead6")};
    stroke-width: 14;
    opacity: 0.5;
  }
  .map-beach {
    fill: ${(p) => (p.theme.dark ? "#c8c19a" : "#f6e9b9")};
    stroke: ${(p) => (p.theme.dark ? "#c8c19a" : "#f6e9b9")};
    stroke-width: 7;
  }
  .map-land {
    fill: url(#gallery-island-grass);
    stroke: ${(p) => (p.theme.dark ? "#719069" : "#8ebf77")};
    stroke-width: 1.5;
    paint-order: stroke fill;
  }
  .grass-base {
    fill: ${(p) => (p.theme.dark ? "#8ca77a" : "#b1d68d")};
  }
  .grass-texture {
    fill: ${(p) => (p.theme.dark ? "#d9e3b3" : "#729c5d")};
    opacity: 0.16;
  }
  .detail-shadow {
    fill: #3c6b55;
    opacity: 0.18;
  }
  .tree-trunk {
    fill: #92714f;
  }
  .tree-crown {
    fill: ${(p) => (p.theme.dark ? "#4a7e61" : "#5b9e63")};
  }
  .tree-highlight {
    fill: ${(p) => (p.theme.dark ? "#7ea47d" : "#8abb71")};
  }
  .tree-fruit {
    fill: #f0b861;
    stroke: #edce8b;
    stroke-width: 0.6;
  }
  .cedar-crown {
    fill: ${(p) => (p.theme.dark ? "#416d5d" : "#5c9467")};
  }
  .cedar-highlight {
    fill: ${(p) => (p.theme.dark ? "#648c70" : "#83ad76")};
  }
  .flower-stem {
    fill: none;
    stroke: #5b8c5c;
    stroke-width: 2;
    stroke-linecap: round;
  }
  .flower-petals {
    fill: #fff5d5;
  }
  .flower-center {
    fill: #e6b35d;
  }
  .shell-body,
  .shell-foot {
    fill: #f4dbc7;
    stroke: #d4b8aa;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  .shell-ribs {
    fill: none;
    stroke: #d4b8aa;
    stroke-width: 1.3;
    stroke-linecap: round;
  }
  .island-fish {
    fill: ${(p) => (p.theme.dark ? "#9ec7ba" : "#5ca69c")};
    opacity: 0.6;
  }
  .island-fish circle {
    fill: ${(p) => (p.theme.dark ? "#28575e" : "#c5ead3")};
  }
  .map-marker {
    cursor: pointer;
    outline: none;
  }
  .marker-hit {
    fill: transparent;
  }
  .marker-ground {
    fill: #365f51;
    opacity: 0.2;
    pointer-events: none;
  }
  .marker-halo {
    fill: ${(p) => (p.theme.dark ? "#ffe3b0" : "#fff7df")};
    opacity: 0;
  }
  .marker-dot,
  .marker-cluster {
    stroke: #fff7da;
    stroke-width: 3;
    stroke-linejoin: round;
    transition: fill 0.15s;
  }
  .marker-dot {
    fill: #fff4cf;
  }
  .marker-cluster {
    fill: #f0d28d;
  }
  .marker-camera {
    fill: #54846b;
    pointer-events: none;
  }
  .marker-center {
    fill: #fff8e9;
    pointer-events: none;
  }
  .map-marker.is-active .marker-dot {
    fill: #f3d287;
  }
  .marker-number {
    fill: #5b704e;
    font-family: ${(p) => p.theme.fontFamily};
    font-size: 14px;
    font-weight: 800;
    pointer-events: none;
  }
  .marker-label {
    fill: ${(p) => (p.theme.dark ? "#fff7dd" : "#496b4d")};
    stroke: ${(p) => (p.theme.dark ? "#355d52" : "#fff7df")};
    paint-order: stroke;
    stroke-width: 5px;
    stroke-linejoin: round;
    font-family: ${(p) => p.theme.fontFamily};
    font-size: 12px;
    font-weight: 700;
    pointer-events: none;
  }
  .map-marker:hover .marker-halo,
  .map-marker:focus-visible .marker-halo,
  .map-marker.is-active .marker-halo {
    opacity: 0.4;
  }
  .map-marker:focus-visible .marker-halo {
    stroke: ${(p) => p.theme.textColor};
    stroke-width: 2;
    stroke-dasharray: 3 3;
  }
`;

export const MapControls = styled.div`
  position: absolute;
  right: 16px;
  bottom: 30px;
  display: flex;
  border: 2px solid var(--island-paper);
  border-radius: 18px;
  background: var(--island-paper);
  box-shadow: 0 3px 0 ${(p) => (p.theme.dark ? "#1c3c37" : "#6caa96")};
  button {
    min-width: 44px;
    height: 44px;
    padding: 0 12px;
    background: transparent;
    color: var(--island-ink);
    border: 0;
    border-right: 1px solid var(--island-line);
    font-size: 1.3rem;
    cursor: pointer;
  }
  button:last-child {
    border-right: 0;
  }
  button:disabled {
    opacity: 0.3;
    cursor: default;
  }
  button:not(:disabled):hover {
    background: ${(p) => (p.theme.dark ? "#47634e" : "#e5edc9")};
    border-radius: 10px;
  }
  .map-reset {
    font-size: 0.7rem;
    font-weight: 600;
  }
`;

export const CityList = styled.nav`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  button {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 14px;
    min-height: 44px;
    border: 1px solid var(--island-line);
    border-radius: 100px;
    background: var(--island-paper);
    color: var(--island-ink);
    font-size: 0.78rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  button:hover,
  button[aria-pressed="true"] {
    background: ${(p) => (p.theme.dark ? "#47634e" : "#e5edc9")};
    border-color: var(--island-leaf);
  }
  .city-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--island-leaf);
  }
`;

export const CityAlbum = styled.aside`
  color: var(--island-ink);
  background: var(--island-paper);
  min-width: 0;
  height: clamp(420px, 46vw, 620px);
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-left: 1px solid var(--island-line);
  padding: 24px;
  .album-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 22px;
  }
  .album-country {
    margin: 0 0 8px;
    color: var(--island-leaf);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  h2 {
    font-size: 1.35rem;
    line-height: 1.35;
    margin: 0;
    letter-spacing: -0.03em;
    scroll-margin-top: 90px;
  }
  h2:focus {
    outline: none;
  }
  .album-close {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border: 1px solid var(--island-line);
    border-radius: 50%;
    background: transparent;
    color: var(--island-ink);
    cursor: pointer;
    font-size: 1.4rem;
  }
  @media ${(p) => p.theme.media.tablet} {
    height: auto;
    max-height: 440px;
    border-left: 0;
    border-top: 1px solid var(--island-line);
    padding: 20px;
  }
`;

export const AlbumGrid = styled.div`
  display: grid;
  gap: 20px;
  @media ${(p) => p.theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media ${(p) => p.theme.media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const PhotoCard = styled.button`
  display: block;
  width: 100%;
  padding: 7px 7px 12px;
  border-radius: 14px;
  box-shadow: 0 3px 0 ${(p) => (p.theme.dark ? "#223b33" : "#dfdfc3")};
  text-align: left;
  background: ${(p) => (p.theme.dark ? "#405b4c" : "#fffcef")};
  color: var(--island-ink);
  border: 0;
  cursor: pointer;
  .gatsby-image-wrapper {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 10px;
    transition: opacity 0.2s;
  }
  &:hover .gatsby-image-wrapper {
    opacity: 0.85;
  }
  > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px 5px 0;
    font-size: 0.75rem;
    line-height: 1.5;
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
  min-width: 48px;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 22px;
  font-size: 0.8rem;

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
    max-width: 100px;
    padding: 10px 12px;
    font-size: 0.75rem;

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
