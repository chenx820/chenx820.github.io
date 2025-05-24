import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const SwitcherWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageButton = styled(Link)`
  padding: 8px;
  font-size: 1.5rem;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const LanguageSwitcher = () => {
  const [isChinese, setIsChinese] = useState(false);
  const [path, setPath] = useState("");

  useEffect(() => {
    // Only run on client-side
    const currentPath = window.location.pathname;
    setIsChinese(currentPath.startsWith("/zh"));
    setPath(currentPath);
  }, []);

  const handleLanguageSwitch = (newLang) => {
    if (!path) return "/"; // Default to root if path is not available

    // If we're already on the correct language, do nothing
    if ((newLang === "zh" && isChinese) || (newLang === "en" && !isChinese)) {
      return path;
    }

    // Handle root path
    if (path === "/" || path === "/zh") {
      return newLang === "en" ? "/" : "/zh";
    }

    // Handle other paths
    const pathWithoutLang = path.replace(/^\/(zh|en)/, "");
    return newLang === "en" ? pathWithoutLang : `/zh${pathWithoutLang}`;
  };

  return (
    <SwitcherWrapper>
      <LanguageButton to={handleLanguageSwitch(isChinese ? "en" : "zh")}>
        {isChinese ? "🇬🇧" : "🇨🇳"}
      </LanguageButton>
    </SwitcherWrapper>
  );
};

export default LanguageSwitcher;
