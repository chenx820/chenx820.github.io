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
  bg: "#F3F4F3", // default white
  primaryColor: "#105286",
  secondaryColor: "#F8F8F8",
  accentColor: "#FDB338",
  primaryText: "#383838",
  ...themeCommon,
};

export const themedark = {
  dark: true,
  bg: "#373937", // defaultblack
  primaryColor: "#FDB338", // orange
  secondaryColor: "#232323", // dark gray
  accentColor: "#105286", // blue
  primaryText: "#F8F8F8", // white
  ...themeCommon,
};
