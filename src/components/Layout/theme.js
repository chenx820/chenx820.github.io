import { css } from "styled-components";

export const sizes = {
  mobile: "480px",
  tablet: "768px",
  fablet: "1000px",
  desktop: "1200px",
};

const themeCommon = {
  onPrimaryColor: "#303649",
  typewriter: '"Courier New", "Courier", "Noto Sans Mono CJK SC", monospace',
  shadow: "0px 10px 10px rgba(0, 0, 0, 0.2)",
  shadowSmall: "0px 5px 10px rgba(0, 0, 0, 0.05)",
  fontFamily:
    '"Montserrat", "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  secondaryFontFamily:
    '"Karla", "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
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
  gradient: "linear-gradient(134deg, #a8d8ea 0%, #aa96da 100%)",
  gradient2: "linear-gradient(99deg, #a8d8ea 0%, #aa96da 130%)",
  swapIfDark(prop1, prop2) {
    return `${this.dark ? this[prop1] : this[prop2]};`;
  },
};

// Inspired by Color Hunt: https://colorhunt.co/palette/a8d8eaaa96dafcbad3ffffd2
// Use the palette blue directly for the primary color.
export const themelight = {
  dark: false,
  bgColor: "#fafcfe",
  borderColor: "#dce7ef",
  pastelBlue: "#a8d8ea",
  pastelPurple: "#aa96da",
  pastelPink: "#fcbad3",
  pastelYellow: "#ffffd2",
  mutedColor: "#65758a",
  primaryColor: "#a8d8ea",
  primaryTextColor: "#35617e",
  secondaryColor: " #FFFFFF",
  accentColor: "#786297",
  accentColor2: " #fcbad3",
  accentColor3: " #ffffd2",
  gradientColor: "linear-gradient(134deg, #FFFFFF 0%, #a8d8ea 100%)",
  textColor: "#293e52",
  ...themeCommon,
};

export const themedark = {
  dark: true,
  bgColor: "#1c202e",
  borderColor: "#3d4258",
  pastelBlue: "#a8d8ea",
  pastelPurple: "#aa96da",
  pastelPink: "#fcbad3",
  pastelYellow: "#ffffd2",
  mutedColor: "#a2a6b8",
  primaryColor: "#a8d8ea",
  primaryTextColor: "#a8d8ea",
  secondaryColor: "#252a3b",
  accentColor: "#b9a6e1",
  accentColor2: " #fcbad3",
  accentColor3: " #ffffd2",
  gradientColor: "linear-gradient(134deg, #dceaff 0%, #a8d8ea 100%)",
  textColor: " #FBFBFB",
  ...themeCommon,
};
