import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import "normalize.css";
import { ThemeProvider } from "styled-components";
import { themedark } from "./theme";
import Wrapper from "@common/Wrapper/";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import GlobalStyle from "@src/styles/GlobalStyle";
import "@components/fontLib";
import { setConfiguration } from "react-grid-system";

setConfiguration({ breakpoints: [576, 769, 992, 1200] });

const RootWrapper = styled(Wrapper)`
  margin-top: 100px;
  margin-bottom: 50px;
  min-height: calc(100vh - 125px);
  @media ${(props) => props.theme.media.tablet} {
    margin-top: 50px;
  }
`;

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={themedark}>
      <GlobalStyle />
      <Navbar />
      <RootWrapper>{children}</RootWrapper>
      <Footer />
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
