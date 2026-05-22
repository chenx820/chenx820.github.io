import React from "react";
import { graphql } from "gatsby";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";
import Publications from "@components/Publications/Publications";

const PublicationsPage = ({ data }) => {
  const { t } = useTranslation();
  const { language } = useI18next();
  const patentData =
    language === "zh" ? data.allPatentsZhJson : data.allPatentsJson;

  return (
    <Layout>
      <SEO title={t("publications.title") + " | " + t("global.name")} />

      <Publications
        papers={data.allPublicationsJson.nodes}
        patents={patentData.nodes}
      />
    </Layout>
  );
};

export default PublicationsPage;

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
    allPublicationsJson(sort: { year: DESC }) {
      nodes {
        kind
        title
        authors
        venue
        year
        status
        links {
          href
          label
        }
      }
    }
    allPatentsJson(sort: { date: DESC }) {
      nodes {
        id
        title
        date(formatString: "MMMM DD, YYYY", locale: "en")
        number
        status
        inventor
        links {
          src
          file
        }
      }
    }
    allPatentsZhJson(sort: { date: DESC }) {
      nodes {
        id
        title
        date(formatString: "YYYY-MM-DD", locale: "zh")
        number
        status
        inventor
        links {
          src
          file
        }
      }
    }
  }
`;
