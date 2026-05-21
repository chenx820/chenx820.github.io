import React from "react";
import styled from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Wrapper from "@common/Wrapper";

import logo from "@src/static/logo.svg";

const FooterWrapper = styled.footer`
  width: 100%;
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

const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterWrapper>
      <Wrapper>
        <img width="35px" src={logo} alt="" />
        <p style={{ float: "right" }}>
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </Wrapper>
    </FooterWrapper>
  );
};

export default Footer;
