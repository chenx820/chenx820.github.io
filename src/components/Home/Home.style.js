import styled from "styled-components";

export const Intro = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 60px);
  padding: 48px 0 72px;
  gap: 36px;

  .home__CTA {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px 32px;
  }
  a.cta {
    font-size: 14px;
    padding: 15px 20px;
    background: rgba(138, 204, 239, 0.1);
    border: 1px solid #7399b7;
    border-radius: 4px;
    color: #e3f4ff;
    box-shadow: inset 0 0 20px rgba(138, 204, 239, 0.04);
  }
  a.cta:hover {
    background: #bde8ff;
    color: #101e30;
    transform: translateY(-2px);
  }
  a:focus-visible {
    outline-color: #bde8ff;
  }
  .home__social {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 21px;
  }
  .home__social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: #9ab0c9;
    transition: color 0.2s;
  }
  .home__social a:hover {
    color: #eff8ff;
  }
  @media ${({ theme }) => theme.media.tablet} {
    min-height: 100svh;
    padding: 40px 0 56px;
    gap: 24px;
  }
  @media ${({ theme }) => theme.media.mobile} {
    .home__CTA {
      flex-direction: column;
      gap: 16px;
    }
  }
`;

export const HomeWrapper = styled.section`
  --hero-fade-height: clamp(88px, 9vw, 144px);
  position: relative;
  isolation: isolate;
  margin-inline: calc(50% - 50vw);
  margin-top: -10px;
  margin-bottom: 32px;
  padding-inline: 10vw;
  padding-bottom: var(--hero-fade-height);
  color: #c0cee0;
  background:
    linear-gradient(
      to top,
      ${({ theme }) => (theme.dark ? "#182e4b" : "#4976ae")},
      transparent var(--hero-fade-height)
    ),
    radial-gradient(ellipse at 35% 42%, #182e4b 0%, transparent 50%),
    radial-gradient(ellipse at 76% 64%, #22253f 0%, transparent 45%), #080f1e;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(#8ebcde 0.75px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse at center, #000, transparent 74%);
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      #000,
      transparent 74%
    );
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--hero-fade-height);
    background: ${({ theme }) => theme.bgColor};
    /* Ease into and out of the fade so neither edge reads as a horizontal band. */
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.01) 12%,
      rgba(0, 0, 0, 0.06) 24%,
      rgba(0, 0, 0, 0.18) 36%,
      rgba(0, 0, 0, 0.4) 48%,
      rgba(0, 0, 0, 0.68) 60%,
      rgba(0, 0, 0, 0.88) 72%,
      rgba(0, 0, 0, 0.97) 84%,
      #000 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.01) 12%,
      rgba(0, 0, 0, 0.06) 24%,
      rgba(0, 0, 0, 0.18) 36%,
      rgba(0, 0, 0, 0.4) 48%,
      rgba(0, 0, 0, 0.68) 60%,
      rgba(0, 0, 0, 0.88) 72%,
      rgba(0, 0, 0, 0.97) 84%,
      #000 100%
    );
    pointer-events: none;
  }

  @media ${({ theme }) => theme.media.tablet} {
    margin-top: -50px;
    margin-bottom: 24px;
    padding-inline: 5vw;
  }
`;
