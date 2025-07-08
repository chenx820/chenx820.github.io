import React from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Opps, seems like you are lost!</h1>
    <p>
      Mind going back? or <Link to="/notes">read some notes</Link>
    </p>
  </Layout>
);

export default NotFoundPage;

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
