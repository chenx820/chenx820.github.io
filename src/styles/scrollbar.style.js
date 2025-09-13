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

  /* 滚动时显示滚动条 */
  :hover::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.primaryColor};
  }

  :hover::-webkit-scrollbar-track {
    background-color: ${(p) =>
      p.theme.dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }

  /* 滚动条悬停时的效果 */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(p) =>
      p.theme.dark ? "rgba(255, 188, 76, 0.8)" : "rgba(121, 158, 255, 0.8)"};
  }

  /* Firefox 滚动条样式 */
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

  /* Firefox 滚动条悬停效果 */
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
