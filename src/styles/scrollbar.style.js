import { css } from "styled-components";

const scrollBar = css`
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 4px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 7px;
    background-color: transparent;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  /* scrollbar hover effect */
  :hover::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.primaryColor};
  }

  :hover::-webkit-scrollbar-track {
    background-color: ${(p) =>
      p.theme.dark ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)"};
  }

  /* scrollbar hover effect */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(p) => p.theme.primaryColor};
  }

  /* Firefox scrollbar style */
  ::-moz-scrollbartrack-vertical {
    background-color: transparent;
  }

  ::-moz-scrollbar {
    width: 10px;
    height: 7px;
    background-color: transparent;
    cursor: pointer;
  }

  ::-moz-scrollbarbutton-up {
    background-color: transparent;
  }

  /* Firefox scrollbar hover effect */
  :hover::-moz-scrollbar-thumb {
    background-color: ${(p) => p.theme.primaryColor};
  }

  input[type="checkbox"] {
    height: 0;
    width: 0;
    visibility: hidden;
  }
`;

export default scrollBar;
