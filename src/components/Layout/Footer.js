import React from "react";
import styled from "styled-components";
import Wrapper from "@common/Wrapper";

import logo from "@src/static/logo.svg";

const FooterWrapper = styled.footer`
  width: 100vw;
  padding: 10px;
  background: ${(p) => p.theme.primaryColor};

  p {
    font-size: 1rem;
    line-height: 35px;
    color: ${(p) => p.theme.bgColor};
  }

  a {
    color: ${(p) => p.theme.primaryColor};
    &:hover {
      color: ${(p) => p.theme.accentColor};
    }
  }
`;

const Footer = () => (
  <FooterWrapper>
    <Wrapper>
      <img width="35px" src={logo} alt="" />
      <p style={{ float: "right" }}>
        &copy; {new Date().getFullYear()} Chen Huang. All rights reserved.
      </p>
    </Wrapper>
  </FooterWrapper>
);

export default Footer;
