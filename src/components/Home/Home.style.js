import styled from 'styled-components';
import { slideDownKeyframe } from '@components/css-animations';

export const Intro = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;

  min-height: clamp(520px, calc(80vh - 100px), 680px);
  ${props => props.theme.spacing.sectionBottom};

  .home__text {
    animation: ${slideDownKeyframe} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s
      forwards;

    z-index: 1;

    a.cta {
      display: block;
      margin: 30px 0;
    }

    @media ${props => props.theme.media.tablet} {
      text-align: center;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }

  h1 {
    margin: -4px 0;
    font-size: clamp(2.4rem, 5vw, 4.5rem);
    font-weight: 900;
    letter-spacing: 0;
    line-height: 1.05;
  }

  p {
    font-family: ${props => props.theme.fontFamily};
  }
  .adjust {
    font-size: 1.06rem;
  }

  .home__CTA {
    width: max-content;
  }
  .home__social {
    color: ${props => props.theme.primaryColor};
    display: flex;
    justify-content: flex-start;
    gap: 28px;
    font-size: 24px;
  }

  @media ${props => props.theme.media.tablet} {
    justify-content: space-between;
    flex-direction: column;
    /* height and m-b for fixing issue
    which was hiding the "thing i love" header */
    height: fit-content;
    margin-bottom: 110px;

    h1 {
      margin: 6px 0;
      line-height: 100%;
    }
  }
`;

export const HomeWrapper = styled.section`
  margin-bottom: 80px;
  margin-top: 125px;

  .svg-rect {
    width: min(38vw, 520px);
    position: absolute;
    top: 60px;
    right: 0;
    z-index: -1;
    opacity: 0.92;
  }

  @media ${props => props.theme.media.tablet} {
    margin-top: 80px;

    .svg-rect {
      top: 0px;
      width: 60vw;
      opacity: 0.28;
    }
  }
`;
