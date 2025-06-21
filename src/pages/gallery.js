import React from "react";

import Layout from "@components/Layout/Layout";
import { PageHead } from "@components/seo";

import Gallery from "@src/components/Gallery/GalleryLayout";

const GalleryPage = () => {
  return (
    <Layout>
      <PageHead title="Gallery | Chen Huang" />

      <Gallery />
    </Layout>
  );
};

export default GalleryPage;
