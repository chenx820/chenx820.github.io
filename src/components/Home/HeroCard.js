import React, { useRef, useEffect, useState } from "react";
import { withTheme } from "styled-components";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";

import {
  HeroCardWrapper,
  ContentCardWrapper,
  ColorPaletteWrapper,
  ColorBoxWrapper,
} from "./HeroCard.style";

export const ContentCard = ({ contentText }) => {
  return (
    <ContentCardWrapper>
      <div dangerouslySetInnerHTML={{ __html: contentText }} />
    </ContentCardWrapper>
  );
};

const ColorBox = ({ color, changeText }) => {
  const tooltipRef = useRef();

  useEffect(() => {
    return tooltipRef.current.addEventListener("animationend", () => {
      tooltipRef.current.classList.remove("tooltip-animate");
    });
  });
  const onClick = () => {
    changeText();
    tooltipRef.current?.classList.add("tooltip-animate");
  };

  return (
    <ColorBoxWrapper
      ref={tooltipRef}
      onClick={onClick}
      style={{ background: color }}
    />
  );
};

export const ColorPalette = withTheme(({ changeText, defaultContent }) => {
  const { t } = useTranslation();
  const colors = [
    {
      color: "#082b41",
      message: defaultContent,
    },
    {
      color: "#105286",
      message: t(
        "about.nameMeaning.chen",
        `My given name is <b>Chen</b>, which means "dawn" or
              "early morning" in Chinese. This meaning suits me well, as I am a
              morning person who enjoys the calm and peacefulness of the early
              hours. Interestingly, "Chen" is sometimes misheard as "Cheng",
              which means "orange" in Chinese. Because of this playful
              similarity, my friends affectionately call me "Cheng-Zi".`
      ),
    },
    {
      color: "#F1F2F4",
      message: t(
        "about.nameMeaning.huang",
        `My surname is <b>Huang</b>, which means "yellow" in Chinese. This name has deep historical and cultural roots. It is often associated with the Yellow Emperor, a legendary figure considered one of the founding ancestors of Chinese civilization.`
      ),
    },
    {
      color: "#FDB338",
      message: t(
        "about.research.imperial",
        `I am an MSc student in the <b>Controlled Quantum Dynamics Group</b> at Imperial College London. My research focuses on charge noise in semiconductor qubits. By conducting experiments and simulations, I aim to understand the impact of charge noise on qubit performance and develop strategies to mitigate its effects.`
      ),
    },
    {
      color: "#171D1D",
      message: t(
        "about.research.baqis",
        `Simutaneously, I am also a remote research intern in the  <b>Quantum Operation System Group</b> at the Beijing Academy of Quantum Information Sciences (BAQIS). My research focuses on quantum compilation with neutral atoms.`
      ),
    },
  ];

  return (
    <ColorPaletteWrapper>
      {colors.map(({ color, message }) => (
        <ColorBox
          key={color}
          color={color}
          changeText={() => changeText(message)}
        />
      ))}
    </ColorPaletteWrapper>
  );
});

export const HeroCard = () => {
  const defaultContent = `I am passionate about expanding my knowledge through interdisciplinary research and collaboration. If you are interested in discussing research or potential collaborations, feel free to reach out via <a href="mailto:chen.huang23@imperial.ac.uk">email</a> or connect with me on <a href="https://www.linkedin.com/in/chen-huang-820x" target="_blank" >LinkedIn</a>.`;

  const [contentText, setContentText] = useState(defaultContent);

  const changeText = (text) => {
    setContentText(text);
  };

  return (
    <HeroCardWrapper>
      <ContentCard contentText={contentText} />
      <ColorPalette changeText={changeText} defaultContent={defaultContent} />
    </HeroCardWrapper>
  );
};
