import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import NoteCard from "@components/Notes/NoteCard";
import NoteLayout from "@components/Notes/NotesLayout";

const NotesPage = ({ data }) => {
  const { t } = useTranslation();
  const { allMarkdownRemark } = data;

  return (
    <Layout>
      <SEO title={t("notes.title") + " | " + t("global.name")} />

      <NoteLayout>
        {allMarkdownRemark.edges.map(({ node }) => (
          <NoteCard
            key={node.id}
            slug={node.fields.slug}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            notetags={node.frontmatter.notetags}
            institution={node.frontmatter.institution}
            excerpt={node.excerpt}
          />
        ))}
      </NoteLayout>
    </Layout>
  );
};

export default NotesPage;

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
    allMarkdownRemark(
      filter: {
        fields: { posttype: { eq: "notes" }, language: { eq: $language } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY", locale: $language)
            notetags
            institution
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
