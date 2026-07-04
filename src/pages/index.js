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
    window.requestAnimationFrame(() => {
      scrollToHomeSection(target);
    });
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
