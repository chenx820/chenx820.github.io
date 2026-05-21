import React from "react";

import SkewBg from "@common/SkewBg";
import PageHeader from "@common/PageHeader";
import Avatar from "./Avatar";

import { Trans, useTranslation } from "gatsby-plugin-react-i18next";
import { AboutWrapper, AboutInfo } from "./About.style";
import News from "./News";

const About = () => {
  const { t } = useTranslation();
  return (
    <AboutWrapper id="about">
      <PageHeader>{t("about.title")}</PageHeader>
      <SkewBg />
      <AboutInfo>
        <div>
          <Avatar src="avatar.png" />
        </div>
        <Trans
          i18nKey="about.bio"
          components={{
            p: <p />,
            br: <br />,
            cuhk: (
              <a
                className="about__link"
                target="__blank"
                href="https://www.innovationadvancedlab.com/home"
              />
            ),
            strong: <strong />,
          }}
        />
      </AboutInfo>

      <div className="news__wrapper">
        <News
          items={[
            t("about.news.0"),
            t("about.news.1"),
            t("about.news.2"),
            t("about.news.3"),
            t("about.news.4"),
            t("about.news.5"),
          ]}
        />
      </div>
    </AboutWrapper>
  );
};

export default About;
