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
