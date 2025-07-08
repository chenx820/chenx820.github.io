import React from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";
import { useTranslation } from "gatsby-plugin-react-i18next";

import Layout from "@components/Layout/Layout";

import Home from "@components/Home/Home";
import About from "@components/About/About";
import Research from "@components/Research/Research";
import Patents from "@components/Patents/Patents";
import Contact from "@components/Contact/Contact";

const IndexPage = () => {
  const { t } = useTranslation();
  return (
  <Layout>
    <SEO title={t("global.name")} />

    <Home />
    <About />
    <Research />
    <Patents />
    {/* <Contact /> */}
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
