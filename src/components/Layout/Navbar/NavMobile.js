import React, { useState, useContext } from "react";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";

import {
  MobileMenuWrapper,
  FloatingButton,
  NavItemMobile as NavItem,
  NavItemsBottomNav,
} from "./NavMobile.style";

import NavLinks from "./NavLinks";

import LanguageSwitch from "@common/LanguageSwitch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeToggleContext from "../ThemeToggleContext";
import Burger from "./Burger";

const DarkModeButton = () => {
  const { toggleTheme, theme } = useContext(ThemeToggleContext);
  const { t } = useTranslation();

  return (
    <>
      <input
        aria-label={t("common.toggle-theme")}
        type="checkbox"
        className="checkbox"
        id="darkmode-input"
        onChange={toggleTheme}
        checked={theme === "dark" ? true : false}
      />
      <FloatingButton
        as="label"
        role="button"
        aria-label={t("common.toggle-theme")}
        htmlFor="darkmode-input"
      >
        <FontAwesomeIcon icon={theme === "light" ? "moon" : "sun"} size="2x" />
      </FloatingButton>
    </>
  );
};

const NavbarMobile = () => {
  const [isMenuOpen, setMenu] = useState(false);
  const { t } = useTranslation();

  const handleMenuState = () => {
    setMenu(!isMenuOpen);
  };

  return (
    <>
      <MobileMenuWrapper>
        <FloatingButton
          onClick={handleMenuState}
          as="button"
          aria-label={t(isMenuOpen ? "nav.close-menu" : "nav.open-menu")}
          aria-expanded={isMenuOpen}
        >
          <Burger isActive={isMenuOpen} />
        </FloatingButton>

        <NavItemsBottomNav isOpen={isMenuOpen}>
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
          <NavItem style={{ width: "auto" }}>
            <DarkModeButton />
          </NavItem>
          <NavItem style={{ width: "auto" }}>
            <LanguageSwitch />
          </NavItem>
        </NavItemsBottomNav>
      </MobileMenuWrapper>
    </>
  );
};

export default NavbarMobile;
