import React from "react";
import logo from "@src/static/logo.svg";

import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
import { Link as SLink } from "react-scroll";

import { NavItems, NavItem } from "./Navbar.style";

import NavLinks from "./NavLinks";
import ToggleSwitch from "@common/ToggleSwitch";
import LanguageSwitcher from "@common/LanguageSwitcher";

const NavDesktop = () => {
  const { t } = useTranslation();

  return (
    <>
      <SLink smooth offset={-100} hashSpy={true} to="home">
        <Link className="logo" to="/">
          <img
            src={logo}
            alt="Chen Huang"
            style={{ width: "clamp(80px, 8vw, 200px)", height: "auto" }}
          />
        </Link>
      </SLink>

      <nav>
        <NavItems>
          <NavLinks NavItem={NavItem} />

          <NavItem>
            <Link to="/notes">{t("nav.notes")}</Link>
          </NavItem>
          <NavItem>
            <Link to="/blog">{t("nav.blog")}</Link>
          </NavItem>
          <NavItem>
            <Link to="/gallery">{t("nav.gallery")}</Link>
          </NavItem>
          {/* <NavItem>
            <ToggleSwitch />
          </NavItem> */}
          <NavItem>
            <LanguageSwitcher />
          </NavItem>
        </NavItems>
      </nav>
    </>
  );
};

export default NavDesktop;
