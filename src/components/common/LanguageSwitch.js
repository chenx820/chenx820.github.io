import React from "react";
import styled from "styled-components";
import { useI18next } from "gatsby-plugin-react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GlobeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(p) => p.theme.textColor};
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: ${(p) => p.theme.primaryColor};
  }

  .lang-label {
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
`;

const LanguageSwitch = () => {
  const { language, changeLanguage } = useI18next();
  const isEn = language === "en";
  const nextLang = isEn ? "zh" : "en";

  return (
    <GlobeButton
      type="button"
      aria-label={isEn ? "Switch to Chinese" : "切换到英文"}
      title={isEn ? "切换到中文" : "Switch to English"}
      onClick={() => changeLanguage(nextLang)}
    >
      <FontAwesomeIcon icon="globe" />
      <span className="lang-label">{isEn ? "EN" : "中"}</span>
    </GlobeButton>
  );
};

export default LanguageSwitch;
