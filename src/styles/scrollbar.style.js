import { css } from "styled-components";

const scrollBar = css`
  ::-webkit-scrollbar-track {
    background-color: ${(p) => (p.theme.dark ? "#000" : "#FFF")};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 7px;
    background-color: ${(p) => (p.theme.dark ? "#000" : "#FFF")};
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.primaryColor};
  }

  ::-moz-scrollbartrack-vertical {
    background-color: ${(p) => (p.theme.dark ? "#000" : "#FFF")};
  }

  ::-moz-scrollbar {
    width: 10px;
    height: 7px;
    background-color: ${(p) => (p.theme.dark ? "#000" : "#FFF")};
    cursor: pointer;
  }

  ::-moz-scrollbarbutton-up {
    background-color: ${(p) => p.theme.primaryColor};
  }

  input[type="checkbox"] {
    height: 0;
    width: 0;
    visibility: hidden;
  }
`;

export default scrollBar;
