import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "styled-components";
import { themedark } from "../theme";

import { NavContent, NavWrapper } from "./Navbar.style";

import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

import { Visible } from "react-grid-system";

const Navbar = ({ darkHero = false }) => {
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [overHero, setOverHero] = useState(darkHero);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
      setOverHero(
        darkHero &&
          document.getElementById("home")?.getBoundingClientRect().bottom > 60,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [darkHero]);

  return (
    <ThemeProvider theme={overHero ? themedark : theme}>
      <header>
        <NavWrapper isScrolled={isScrolled} $overHero={overHero}>
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
    </ThemeProvider>
  );
};

export default Navbar;
