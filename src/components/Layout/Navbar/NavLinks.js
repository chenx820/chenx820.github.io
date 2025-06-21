import React from "react";
import {Link, Trans, useTranslation} from 'gatsby-plugin-react-i18next';
import { Link as SLink } from "react-scroll";

const NavItemsSmoothLinks = ({ NavItem }) => {
  const { t } = useTranslation();
  return (
    <>
      <NavItem>
        <SLink smooth offset={-70} hashSpy to="home">
          {t("home")}
        </SLink>
      </NavItem>
      <NavItem>
        <SLink smooth offset={-100} hashSpy to="about">
          {t("about")}
        </SLink>
      </NavItem>
      <NavItem>
        <SLink smooth offset={-100} hashSpy to="research">
          {t("research")}
        </SLink>
      </NavItem>
      {/* <NavItem>
        <SLink smooth offset={-100} hashSpy to="contact">
          {t('contact')}
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
        <Link to="/">{t("home")}</Link>
      </NavItem>
      <NavItem>
        <Link to="/#about">{t("about")}</Link>
      </NavItem>
      <NavItem>
        <Link to="/#research">{t("research")}</Link>
      </NavItem>
      {/* <NavItem>
        <Link to="/#contact">{t("contact")}</Link>
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
