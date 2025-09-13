import React from "react";

import SkewBg from "@common/SkewBg";
import PageHeader from "@common/PageHeader";
import Avatar from "./Avatar";

import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
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
        <p>
          <Trans>
            Hi, I'm Chen, an incoming PhD student in Computer Science and
            Engineering at{" "}
            <a
              className="about__link"
              target="__blank"
              href="https://www.innovationadvancedlab.com/home"
            >
              The Chinese University of Hong Kong (CUHK)
            </a>
            .
            <br />
            <br />
            I am passionate about advancing quantum computing through both
            theoretical research and experimental realization. My academic
            journey has equipped me with a strong foundation in physics and
            hands-on experience with a variety of quantum systems, including
            neutral atoms, trapped ions, and semiconductor qubits.
            <br />
            <br />I also work with quantum circuits. At BAQIS, my research
            focuses on developing efficient quantum compilation strategies that
            help bridge the gap between hardware capabilities and practical,
            scalable quantum computing.
          </Trans>
        </p>
      </AboutInfo>

      <div className="news__wrapper">
        <News
          items={[
            "2025-10-01 I received the Master's degree in Physics from Imperial College London with distinction! 🎓",
            "2025-09-12 My fifth patent was filed.",
            "2025-08-28 I received the Admission Letter from CUHK CSE! Next stop, Hong Kong! 🇭🇰",
            "2025-06-18 I completed my Master's thesis defense and got a high score of 85.15/100 for my research project! ",
          ]}
        />
      </div>
    </AboutWrapper>
  );
};

export default About;
