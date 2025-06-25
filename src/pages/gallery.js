import React from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";
import { useTranslation } from "gatsby-plugin-react-i18next";

import Layout from "@components/Layout/Layout";

import Gallery from "@src/components/Gallery/GalleryLayout";

const GalleryPage = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEO title={t("gallery.title") + " | " + t("global.name")} />

      <Gallery />
    </Layout>
  );
};

export default GalleryPage;

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
