import React from "react";
import Layout from "@components/Layout/Layout";
import SEO from "@components/seo";
import Gallery from "@src/components/Gallery/GalleryLayout";

const ZhGalleryPage = () => {
  return (
    <Layout>
      <SEO title="Gallery | Chen Huang" />
      <Gallery />
    </Layout>
  );
};

export default ZhGalleryPage;
