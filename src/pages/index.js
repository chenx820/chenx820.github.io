import React, { useEffect } from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { scrollToHomeSection } from "@components/Layout/Navbar/NavLinks";

import Layout from "@components/Layout/Layout";

import Home from "@components/Home/Home";
import About from "@components/About/About";
import Research from "@components/Research/Research";

const IndexPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const target = window.location.hash.replace("#", "") || "home";

    // Images below the fold change the page height after mount, so a single
    // scroll attempt lands in the wrong place. Retry (instantly) a few times
    // and again once everything has loaded, until the position settles.
    let attempts = 0;
    let timer;

    // "home" is always at the top and its position is stable, so it needs no
    // retries (and retrying could fight an early manual scroll).
    const maxAttempts = target === "home" ? 1 : 6;

    const tryScroll = () => {
      scrollToHomeSection(target, "auto");
      attempts += 1;
      if (attempts < maxAttempts) {
        timer = window.setTimeout(tryScroll, 150);
      }
    };

    const raf = window.requestAnimationFrame(tryScroll);
    window.addEventListener("load", tryScroll);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("load", tryScroll);
    };
  }, []);

  return (
    <Layout>
      <SEO title={t("global.name")} />

      <Home />
      <About />
      <Research />
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
