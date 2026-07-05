import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "gatsby-plugin-react-i18next";

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: ${(p) => p.$progress}%;
  background: ${(p) => p.theme.primaryColor};
  z-index: 2000;
  transition: width 0.1s ease-out;
`;

const BackToTopButton = styled.button`
  position: fixed;
  right: 24px;
  bottom: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: ${(p) => p.theme.bgColor};
  background: ${(p) => p.theme.primaryColor};
  box-shadow: ${(p) => p.theme.shadow};
  z-index: 1500;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? "visible" : "hidden")};
  transform: translateY(${(p) => (p.$visible ? 0 : "12px")});
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;

  &:hover {
    filter: brightness(1.08);
  }

  @media ${(p) => p.theme.media.mobile} {
    right: 16px;
    bottom: 20px;
  }
`;

const ScrollExtras = ({ showProgress = true }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setVisible(scrollTop > 400);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showProgress && <ProgressBar $progress={progress} />}
      <BackToTopButton
        type="button"
        $visible={visible}
        aria-label={t("common.back-to-top", "Back to top")}
        title={t("common.back-to-top", "Back to top")}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FontAwesomeIcon icon="chevron-up" />
      </BackToTopButton>
    </>
  );
};

export default ScrollExtras;
