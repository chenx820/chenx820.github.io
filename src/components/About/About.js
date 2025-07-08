import React from "react";

import SkewBg from "@common/SkewBg";
import PageHeader from "@common/PageHeader";
import Avatar from "./Avatar";

import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
import { AboutWrapper, AboutInfo } from "./About.style";

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
            Hi, I'm Chen, an MSc student in Physics at{" "}
            <a
              className="about__link"
              target="__blank"
              href="https://www.imperial.ac.uk/a-z-research/quantum-optics-and-laser-science/research/controlled-quantum-dynamics/"
            >
              Imperial College London
            </a>{" "}
            and a remote research intern at the{" "}
            <a
              className="about__link"
              target="__blank"
              href="http://en.baqis.ac.cn/research/groups/?cid=814"
            >
              Beijing Academy of Quantum Information Sciences (BAQIS)
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
    </AboutWrapper>
  );
};

export default About;
