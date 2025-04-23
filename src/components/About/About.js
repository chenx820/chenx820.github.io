import React from "react";

import SkewBg from "@common/SkewBg";
import PageHeader from "@common/PageHeader";
import Flex from "@common/Flex";

import Quote from "./Quote";
import Avatar from "./Avatar";

import { AboutWrapper, AboutInfo } from "./About.style";

const About = () => {
  return (
    <AboutWrapper id="about">
      <PageHeader>About Me</PageHeader>
      <SkewBg />
      <AboutInfo>
        <div>
          <Avatar src="avatar.JPG" />
        </div>
        <p>
          Hi, I'm Chen Huang, an MSc student in Physics at Imperial College
          London and a remote research intern at the
          <a
            className="about__link"
            href="http://en.baqis.ac.cn/research/groups/?cid=814"
          >
            Beijing Academy of Quantum Information Sciences (BAQIS)
          </a>
          .
          <br />
          <br />
          I am passionate about advancing quantum computing through both
          theoretical research and experimental realization. My academic journey
          has equipped me with a strong foundation in physics and hands-on
          experience with a variety of quantum systems, including neutral atoms,
          trapped ions, and semiconductor qubits.
          <br />
          <br />I also work extensively with quantum circuits. At BAQIS, my
          research focuses on developing efficient quantum compilation
          strategies that help bridge the gap between hardware capabilities and
          practical, scalable quantum computing.
        </p>
      </AboutInfo>
    </AboutWrapper>
  );
};

export default About;
