import React from "react";

import { useTranslation } from "gatsby-plugin-react-i18next";

import ResearchInterests from "./ResearchInterests";
import TinyCircuit from "./TinyCircuit";
import QuantumState from "./QuantumState";

import ResearchWordCloud from "./ResearchWordCloud";
import { HomeWrapper, Intro } from "./Home.style";

import IconLink from "@common/IconLink";
import Button from "@common/Button";

const Home = () => {
  const { t, i18n } = useTranslation();
  const zh = i18n.language.startsWith("zh");
  return (
    <HomeWrapper id="home">
      <Intro>
        <div className="home__text">
          <p>{t("home.greeting")}</p>
          <h1>{t("home.title")}</h1>
          <p className="adjust">
            {zh
              ? "在物理与计算之间，探索量子世界。"
              : "Exploring the quantum world, from physics to computation."}
          </p>
          <ResearchInterests />

          <div className="home__CTA">
            <Button
              className="cta"
              target="_blank"
              rel="noopener noreferrer"
              as="a"
              href="/CV_ChenHuang.pdf"
            >
              {t("home.resume")}
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
                href="mailto:chen.huang678@gmail.com"
              />
              <IconLink
                label="linkedin"
                icon={["fab", "linkedin"]}
                href="//linkedin.com/in/chen-huang-820x/"
              />
              <IconLink
                label="google scholar"
                icon={["fab", "google-scholar"]}
                href="//scholar.google.com/citations?user=3hd6xq4AAAAJ"
              />
            </div>
          </div>
        </div>
        <div className="quantum-panel">
          <QuantumState />
        </div>
      </Intro>
      <div className="home-footer">
        <a href="#research">
          {zh ? "探索研究" : "Explore research"} <span>↘</span>
        </a>
        <TinyCircuit />
      </div>
      <ResearchWordCloud />
    </HomeWrapper>
  );
};

export default Home;
