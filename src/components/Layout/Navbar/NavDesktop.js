import React from "react";
import logo from "@src/static/logo.svg";

import { Link, useTranslation } from "gatsby-plugin-react-i18next";

import { NavItems, NavItem } from "./Navbar.style";

import NavLinks, { scrollToHomeSection } from "./NavLinks";
import ToggleSwitch from "@common/ToggleSwitch";
import LanguageSwitch from "@common/LanguageSwitch";

const NavDesktop = () => {
  const { t } = useTranslation();

  return (
    <>
      <Link
        className="logo"
        to="/"
        aria-label={t("nav.home")}
        onClick={(event) => {
          if (scrollToHomeSection("home")) event.preventDefault();
        }}
      >
        <img
          src={logo}
          alt=""
          style={{ width: "clamp(80px, 8vw, 200px)", height: "auto" }}
        />
      </Link>

      <nav>
        <NavItems>
          <NavLinks NavItem={NavItem} />

          <NavItem>
            <Link to="/publications">{t("nav.publications")}</Link>
          </NavItem>
          <NavItem>
            <Link to="/notes">{t("nav.notes")}</Link>
          </NavItem>
          <NavItem>
            <Link to="/gallery">{t("nav.gallery")}</Link>
          </NavItem>
          <NavItem>
            <LanguageSwitch />
          </NavItem>
          <NavItem>
            <ToggleSwitch />
          </NavItem>
        </NavItems>
      </nav>
    </>
  );
};

export default NavDesktop;
