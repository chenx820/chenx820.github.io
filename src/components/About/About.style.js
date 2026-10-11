import styled from "styled-components";

export const AboutWrapper = styled.section`
  position: relative;
  margin-bottom: 200px;

  .quotes__wrapper {
    position: relative;
    top: 80px;

    @media ${(props) => props.theme.media.tablet} {
      top: 40px;
    }
  }
  .news__wrapper {
    position: relative;
    top: 80px;

    @media ${(props) => props.theme.media.tablet} {
      top: 40px;
    }
  }
`;

export const AboutInfo = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  padding: 15px 0;

  > div:first-child {
    margin-right: 10%;
  }

  p {
    color: ${(p) => p.theme.textColor};
    line-height: 1.85;
  }

  .about__link {
    color: ${(p) =>
      p.theme.dark ? p.theme.primaryTextColor : p.theme.accentColor};
  }
  @media ${(props) => props.theme.media.tablet} {
    flex-direction: column;
    margin-top: 35px;

    > div:first-child {
      margin-right: 0;
      margin-bottom: 30px;
    }
  }
`;
