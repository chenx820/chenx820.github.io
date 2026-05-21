import React from "react";
import { graphql } from "gatsby";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO title={t("notFound.title")} />
      <h1>{t("notFound.heading")}</h1>
      <p>
        <Trans
          i18nKey="notFound.body"
          components={{ notesLink: <Link to="/notes" /> }}
        />
      </p>
    </Layout>
  );
};

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
