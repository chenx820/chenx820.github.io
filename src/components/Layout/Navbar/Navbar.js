import React, { useState, useEffect } from "react";

import { NavContent, NavWrapper } from "./Navbar.style";

import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

import { Visible } from "react-grid-system";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <NavWrapper isScrolled={isScrolled}>
        <NavContent as="div">
          <Visible md lg xl>
            <NavDesktop />
          </Visible>
        </NavContent>
      </NavWrapper>
      <Visible xs sm>
        <NavMobile />
      </Visible>
    </header>
  );
};

export default Navbar;
