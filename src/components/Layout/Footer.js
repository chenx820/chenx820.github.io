import React from "react";
import styled from "styled-components";
import Wrapper from "@common/Wrapper";

import logo from "@src/static/logo_white.svg";

const FooterWrapper = styled.footer`
  width: 100vw;
  padding: 10px 0px;
  background: ${(p) => p.theme.secondaryColor};
  margin-top: auto;

  p {
    font-size: 1rem;
    line-height: 35px;
    color: white;
  }

  a {
    color: ${(p) => p.theme.primaryColor};
    &:hover {
      color: ${(p) => p.theme.primaryText};
    }
  }
`;

const Footer = () => (
  <FooterWrapper>
    <Wrapper>
      {/* <img width="35px" src={logo} alt="Chen Huang" /> */}
      <p style={{ float: "right" }}>
        &copy; {new Date().getFullYear()} Chen Huang. All rights reserved.
      </p>
    </Wrapper>
  </FooterWrapper>
);

export default Footer;
