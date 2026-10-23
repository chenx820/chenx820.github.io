import React from "react";

import { useTranslation } from "gatsby-plugin-react-i18next";

import ResearchWordCloud from "./ResearchWordCloud";
import { HomeWrapper, Intro } from "./Home.style";

import IconLink from "@common/IconLink";
import Button from "@common/Button";

const Home = () => {
  const { t } = useTranslation();
  return (
    <HomeWrapper id="home">
      <Intro>
        <ResearchWordCloud />

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
              label={t("common.email")}
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
      </Intro>
    </HomeWrapper>
  );
};

export default Home;
