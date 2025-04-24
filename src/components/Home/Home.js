import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import svgRect from "@src/static/home_rect.svg";

import { HeroCard } from "./HeroCard";
import { HomeWrapper, Intro } from "./Home.style";

import IconLink from "@common/IconLink";
import PageHeader from "@common/PageHeader";
import Flex from "@common/Flex";
import Button from "@common/Button";

import { Card, CardIcon, CardText, CardTitle } from "@common/Card";

const ThingsILove = () => (
  <Flex justify="space-between" align="center">
    <Card>
      <CardIcon>
        <FontAwesomeIcon icon={["fab", "react"]} />
      </CardIcon>
      <CardTitle>Physics</CardTitle>
      <CardText>I am majoring in Physics and all about quantum.</CardText>
    </Card>

    <Card>
      <CardIcon>
        <FontAwesomeIcon icon={["fas", "network-wired"]} />
      </CardIcon>
      <CardTitle>Quantum Computing</CardTitle>
      <CardText>My research focus on quantum computing.</CardText>
    </Card>

    <Card>
      <CardIcon>
        <FontAwesomeIcon icon="code" />
      </CardIcon>
      <CardTitle>Coding</CardTitle>
      <CardText>I love coding.</CardText>
    </Card>
  </Flex>
);

const Home = () => {
  return (
    <HomeWrapper id="home">
      <img className="svg-rect" src={svgRect} alt=""></img>

      <Intro>
        {/* <Parallax y={[50, -50]} className="home__text"> */}
        <div className="home__text">
          <p>Hello, I'm</p>
          <h1>CHEN HUANG</h1>
          <p className="adjust">EXPLORING THE QUANTUM WORLD</p>

          <div className="home__CTA">
            <Button className="cta" as="a" href="/CV_ChenHuang.pdf">
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
        {/* </Parallax> */}
        <HeroCard />
      </Intro>

      {/* Things I LOVE */}
      {/* <PageHeader style={{ marginBottom: 30 }}>
        Things I love <i className="fas fa-heart" />
      </PageHeader>
      <ThingsILove /> */}
    </HomeWrapper>
  );
};

export default Home;
