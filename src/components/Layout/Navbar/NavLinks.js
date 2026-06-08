import React from "react";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";

const sectionOffsets = {
  home: -70,
  about: -100,
  research: -100,
};

export const scrollToHomeSection = (target) => {
  if (typeof window === "undefined") {
    return false;
  }

  const element = document.getElementById(target);
  if (!element) {
    return false;
  }

  const top =
    element.getBoundingClientRect().top +
    window.pageYOffset +
    (sectionOffsets[target] || 0);

  window.history.pushState(
    null,
    "",
    target === "home" ? window.location.pathname : `#${target}`
  );
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  return true;
};

const HomeSectionLink = ({ children, target }) => {
  const to = target === "home" ? "/" : `/#${target}`;

  const handleClick = (event) => {
    if (scrollToHomeSection(target)) {
      event.preventDefault();
    }
  };

  return (
    <Link to={to} onClick={handleClick}>
      {children}
    </Link>
  );
};

const NavLinks = React.memo(({ NavItem }) => {
  const { t } = useTranslation();

  return (
    <>
      <NavItem>
        <HomeSectionLink target="home">{t("nav.home")}</HomeSectionLink>
      </NavItem>
      <NavItem>
        <HomeSectionLink target="about">{t("nav.about")}</HomeSectionLink>
      </NavItem>
      <NavItem>
        <HomeSectionLink target="research">{t("nav.research")}</HomeSectionLink>
      </NavItem>
    </>
  );
});

export default NavLinks;
