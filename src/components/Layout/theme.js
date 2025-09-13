import { css } from "styled-components";

export const sizes = {
  mobile: "480px",
  tablet: "768px",
  fablet: "1000px",
  desktop: "1200px",
};

const themeCommon = {
  shadow: "0px 10px 10px rgba(0, 0, 0, 0.2)",
  shadowSmall: "0px 5px 10px rgba(0, 0, 0, 0.05)",
  fontFamily: '"Montserrat", sans-serif',
  secondaryFontFamily: '"Karla", sans-serif',
  spacing: {
    sectionBottom: "margin-bottom: 100px",
    sectionTop: "margin-top: 100px",
    sectionTopBottom: css`
      margin-top: 100px;
      margin-bottom: 100px;
    `,
  },
  media: {
    mobile: `(max-width: ${sizes.mobile})`,
    tablet: `(max-width: ${sizes.tablet})`,
    fablet: `(max-width: ${sizes.fablet})`,
    desktop: `(max-width: ${sizes.desktop})`,
    minMobile: `(min-width: ${sizes.mobile})`,
    minTablet: `(min-width: ${sizes.tablet})`,
  },
  gradient: "linear-gradient(134deg, #3E7CB1 0%, #105286 50%)",
  gradient2: "linear-gradient(99deg, #3E7CB1 0%, #082B41 130%)",
  swapIfDark(prop1, prop2) {
    return `${this.dark ? this[prop1] : this[prop2]};`;
  },
};

export const themelight = {
  dark: false,
  bgColor: " #FFFFFF", // default white
  primaryColor: " #799EFF",
  secondaryColor: " #F8F8F8",
  accentColor: " #FFBC4C",
  accentColor2: " #FFDE63",
  accentColor3: " #FEFFC4",
  textColor: " #383838",
  ...themeCommon,
};

export const themedark = {
  dark: true,
  bgColor: " #1C1C1E",
  primaryColor: " #FFBC4C",
  secondaryColor: " #232323",
  accentColor: " #799EFF",
  textColor: " #FBFBFB",
  ...themeCommon,
};
