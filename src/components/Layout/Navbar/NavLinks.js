import React from "react";
import { Link } from "gatsby";
import { Link as SLink } from "react-scroll";
import { useTranslation } from "react-i18next";

const NavItemsSmoothLinks = ({ NavItem }) => (
  <>
    <NavItem>
      <SLink smooth offset={-70} hashSpy to="home">
        home
      </SLink>
    </NavItem>
    <NavItem>
      <SLink smooth offset={-100} hashSpy to="about">
        about me
      </SLink>
    </NavItem>
    <NavItem>
      <SLink smooth offset={-100} hashSpy to="research">
        research
      </SLink>
    </NavItem>
    {/* <NavItem>
        <SLink smooth offset={-100} hashSpy to="contact">
          contact
        </SLink>
      </NavItem> */}
  </>
);

const NavItemsGatsbyLinks = ({ NavItem }) => (
  <>
    <NavItem>
      <Link to="/">home</Link>
    </NavItem>
    <NavItem>
      <Link to="/#about">about me</Link>
    </NavItem>
    <NavItem>
      <Link to="/#research">research</Link>
    </NavItem>
    {/* <NavItem>
        <Link to="/#contact">contact</Link>
      </NavItem> */}
  </>
);

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
