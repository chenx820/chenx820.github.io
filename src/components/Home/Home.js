import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import svgRect from "@src/static/home_rect.svg";

import { HeroCard } from "./HeroCard";
import { HomeWrapper, Intro } from "./Home.style";

import IconLink from "@common/IconLink";
import Button from "@common/Button";

const Home = () => {
  return (
    <HomeWrapper id="home">
      <img className="svg-rect" src={svgRect} alt=""></img>

      <Intro>
        <div className="home__text">
          <p>Hello, I'm</p>
          <h1>CHEN HUANG</h1>
          <p className="adjust">EXPLORING THE QUANTUM WORLD</p>

          <div className="home__CTA">
            <Button
              className="cta"
              target="__blank"
              as="a"
              href="/CV_chenhuang.pdf"
            >
              Download Resume
            </Button>

            <div className="home__social">
              <IconLink
                label="github"
                icon={["fab", "github"]}
                href="//github.com/chenx820"
              />
              <IconLink
                label="email"
                icon={["fas", "envelope"]}
                href="mailto:chen.huang23@imperial.ac.uk"
              />
              <IconLink
                label="linkedin"
                icon={["fab", "linkedin"]}
                href="//linkedin.com/in/chen-huang-820x/"
              />
            </div>
          </div>
        </div>
        <HeroCard />
      </Intro>
    </HomeWrapper>
  );
};

export default Home;
