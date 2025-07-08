import React from "react";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
import { Link as SLink } from "react-scroll";

const NavItemsSmoothLinks = ({ NavItem }) => {
  const { t } = useTranslation();
  return (
    <>
      <NavItem>
        <SLink smooth offset={-70} hashSpy to="home">
          {t("nav.home")}
        </SLink>
      </NavItem>
      <NavItem>
        <SLink smooth offset={-100} hashSpy to="about">
          {t("nav.about")}
        </SLink>
      </NavItem>
      <NavItem>
        <SLink smooth offset={-100} hashSpy to="research">
          {t("nav.research")}
        </SLink>
      </NavItem>
      <NavItem>
        <SLink smooth offset={-100} hashSpy to="patents">
          {t("nav.patents")}
        </SLink>
      </NavItem>
      {/* <NavItem>
        <SLink smooth offset={-100} hashSpy to="contact">
          {t('nav.contact')}
        </SLink>
      </NavItem> */}
    </>
  );
};

const NavItemsGatsbyLinks = ({ NavItem }) => {
  const { t } = useTranslation();
  return (
    <>
      <NavItem>
        <Link to="/">{t("nav.home")}</Link>
      </NavItem>
      <NavItem>
        <Link to="/#about">{t("nav.about")}</Link>
      </NavItem>
      <NavItem>
        <Link to="/#research">{t("nav.research")}</Link>
      </NavItem>
      <NavItem>
        <Link to="/#patents">{t("nav.patents")}</Link>
      </NavItem>
      {/* <NavItem>
        <Link to="/#contact">{t("nav.contact")}</Link>
      </NavItem> */}
    </>
  );
};

const NavLinks = React.memo(({ NavItem }) => {
  let path = null;
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }

  return (
    <>
      {path === "/" ? (
        <NavItemsSmoothLinks NavItem={NavItem} />
      ) : (
        <NavItemsGatsbyLinks NavItem={NavItem} />
      )}
    </>
  );
});

export default NavLinks;
