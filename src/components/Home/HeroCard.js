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

const ColorBox = ({ color, changeText, label }) => {
  const tooltipRef = useRef();

  useEffect(() => {
    const tooltipEl = tooltipRef.current;
    const handleAnimationEnd = () => {
      tooltipEl.classList.remove("tooltip-animate");
    };

    tooltipEl?.addEventListener("animationend", handleAnimationEnd);
    return () => {
      tooltipEl?.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);
  const onClick = () => {
    changeText();
    tooltipRef.current?.classList.add("tooltip-animate");
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <ColorBoxWrapper
      ref={tooltipRef}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={label}
      role="button"
      tabIndex={0}
      title={label}
      style={{ background: color }}
    />
  );
};

export const ColorPalette = withTheme(({ changeText, defaultContent, theme }) => {
  const { t } = useTranslation();
  const colors = [
    {
      color: theme.bgColor,
      label: t("about.heroCard.palette.default", "Intro"),
      message: defaultContent,
    },
    {
      color: theme.primaryColor,
      label: t("about.heroCard.palette.chen", "Chen"),
      message: t(
        "about.nameMeaning.chen",
        `My given name is <b>Chen</b>, which means "dawn" or
              "early morning" in Chinese. This meaning suits me well, as I am a
              morning person who enjoys the calm and peacefulness of the early
              hours. Interestingly, "Chen" is sometimes misheard as "Cheng",
              which means "orange" in Chinese. Because of this playful
              similarity, my friends affectionately call me "Cheng-Zi".`,
      ),
    },
    {
      color: theme.accentColor,
      label: t("about.heroCard.palette.huang", "Huang"),
      message: t(
        "about.nameMeaning.huang",
        `My surname is <b>Huang</b>, which means "yellow" in Chinese. This name has deep historical and cultural roots. It is often associated with the Yellow Emperor, a legendary figure considered one of the founding ancestors of Chinese civilization.`,
      ),
    },
    {
      color: theme.gradientColor,
      label: t("about.heroCard.palette.imperial", "Imperial"),
      message: t(
        "about.research.imperial",
        `I was an MSc in the <b>Controlled Quantum Dynamics Group</b> at Imperial College London. My research focused on charge noise in semiconductor qubits. By conducting experiments and simulations, I aimed to understand the impact of charge noise on qubit performance and develop strategies to mitigate its effects.`,
      ),
    },
    {
      color: theme.textColor,
      label: t("about.heroCard.palette.baqis", "BAQIS"),
      message: t(
        "about.research.baqis",
        `Simutaneously, I am also a remote research intern in the  <b>Quantum Operation System Group</b> at the Beijing Academy of Quantum Information Sciences (BAQIS). My research focuses on quantum compilation with neutral atoms.`,
      ),
    },
  ];

  return (
    <ColorPaletteWrapper>
      {colors.map(({ color, message, label }) => (
        <ColorBox
          key={color}
          color={color}
          label={label}
          changeText={() => changeText(message)}
        />
      ))}
    </ColorPaletteWrapper>
  );
});

export const HeroCard = () => {
  const { t, i18n } = useTranslation();
  const defaultContent = t("about.heroCard.default");

  const [contentText, setContentText] = useState(defaultContent);

  useEffect(() => {
    setContentText(defaultContent);
  }, [defaultContent, i18n.language]);

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
