import React from "react";

import Layout from "@components/Layout/Layout";
import SEO from "@components/seo";

import Home from "@components/Home/Home";
import About from "@components/About/About";
import Research from "@components/Research/Research";
import Contact from "@components/Contact/Contact";

const IndexPage = () => (
  <Layout>
    <SEO title="Chen Huang" />

    <Home />
    <About />
    <Research />
    {/* <Contact /> */}
  </Layout>
);

export default IndexPage;
