import React from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";

import Gallery from "@src/components/Gallery/GalleryLayout";

const GalleryPage = () => {
  return (
    <Layout>
      <SEO title="Gallery | Chen Huang" />

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
