import React from "react";
import styled from "styled-components";
import Wrapper from "@common/Wrapper";

const FooterWrapper = styled.footer`
  width: 100vw;
  padding: 10px;
  background: ${(p) => p.theme.primaryColor};
  margin-top: auto;

  p {
    font-size: 1rem;
    line-height: 35px;
    color: ${(p) => p.theme.textColor};
  }

  a {
    color: ${(p) => p.theme.primaryColor};
    &:hover {
      color: ${(p) => p.theme.textColor};
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
