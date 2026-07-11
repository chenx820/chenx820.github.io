import React from "react";
import styled from "styled-components";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Wrapper from "@common/Wrapper";

import logo from "@src/static/logo.svg";

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 24px 10px;
  background: ${(p) => p.theme.primaryColor};
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    display: block;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${(p) => p.theme.bgColor};
  }
`;

const FooterNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;

  a {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${(p) => p.theme.bgColor};
    text-decoration: none;
    opacity: 0.9;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

const FooterSocial = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    font-size: 1.15rem;
    color: ${(p) => p.theme.bgColor};
    opacity: 0.9;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover {
      opacity: 1;
      transform: translateY(-2px);
    }
  }
`;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterWrapper>
      <Wrapper>
        <FooterInner>
          <FooterBrand>
            <img width="35px" src={logo} alt="" />
            <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          </FooterBrand>

          <FooterNav>
            <Link to="/">{t("nav.home")}</Link>
            <Link to="/publications">{t("nav.publications")}</Link>
            <Link to="/notes">{t("nav.notes")}</Link>
            <Link to="/gallery">{t("nav.gallery")}</Link>
          </FooterNav>

          <FooterSocial>
            <a
              href="https://github.com/chenx820"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            <a href="mailto:chen.huang678@gmail.com" aria-label="Email">
              <FontAwesomeIcon icon={["fas", "envelope"]} />
            </a>
            <a
              href="https://linkedin.com/in/chen-huang-820x/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={["fab", "linkedin"]} />
            </a>
            <a
              href="https://scholar.google.com/citations?user=3hd6xq4AAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Scholar"
            >
              <FontAwesomeIcon icon={["fab", "google-scholar"]} />
            </a>
          </FooterSocial>
        </FooterInner>
      </Wrapper>
    </FooterWrapper>
  );
};

export default Footer;
