import styled from "styled-components";

export const Intro = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: clamp(30px, 6vw, 100px);
  min-height: 570px;
  padding: 30px 0 50px;
  .home__text {
    min-width: 0;
  }
  .eyebrow {
    color: ${({ theme }) => theme.primaryTextColor};
    font: 14px/1.5 ${({ theme }) => theme.typewriter};
    letter-spacing: 0;
    margin-bottom: 32px;
  }
  h1 {
    font-size: clamp(3rem, 5.2vw, 5.5rem);
    letter-spacing: -0.045em;
    line-height: 1.05;
    margin: 10px 0 24px;
    font-weight: 700;
  }
  .adjust {
    max-width: 480px;
    font-size: clamp(1.15rem, 1.7vw, 1.6rem);
    line-height: 1.5;
    opacity: 0.8;
  }
  .home__CTA {
    margin-top: 34px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }
  a.cta {
    font-size: 14px;
    padding: 15px 20px;
  }
  .home__social {
    display: flex;
    gap: 20px;
    font-size: 21px;
  }
  .home__social a {
    transition: transform 0.2s;
  }
  .home__social a:hover {
    transform: translateY(-4px);
  }
  .quantum-panel {
    min-width: 0;
  }
  @media ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 35px;
    padding-top: 24px;
    .eyebrow {
      margin-bottom: 22px;
    }
    h1 {
      font-size: clamp(3rem, 12vw, 4.5rem);
    }
  }
`;
export const HomeWrapper = styled.section`
  position: relative;
  margin-top: 105px;
  margin-bottom: 100px;
  .home-footer {
    flex-wrap: wrap;
    gap: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${({ theme }) => theme.borderColor};
    padding: 22px 0;
    font: 14px ${({ theme }) => theme.typewriter};
    letter-spacing: 0;
  }
  .home-footer a {
    font-size: 14px;
  }
  .home-footer a span {
    display: inline-block;
    margin-left: 12px;
    transition: transform 0.2s;
  }
  .home-footer a:hover span {
    transform: translate(3px, 3px);
  }
  @media ${({ theme }) => theme.media.tablet} {
    margin-top: 75px;
    .home-footer > span {
      display: none;
    }
  }
`;
