import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const UniversitiesPage = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const { inst } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const institutionName = edges[0]?.node.frontmatter.institution || inst;

  const uniHeader = t("notes.tagged-posts", {
    count: totalCount,
    tag: institutionName,
  });

  return (
    <Layout>
      <SEO title={uniHeader + " | " + t("global.name")} />

      <NoteLayout>
        <h1>{uniHeader}</h1>
        <br />
        <br />
        {edges.map(({ node }) => {
          const { slug } = node.fields;
          const { title, date, notetags, institution } = node.frontmatter;
          return (
            <NoteCard
              notetags={notetags}
              key={node.id}
              slug={slug}
              title={title}
              date={date}
              institution={institution}
              excerpt={node.excerpt}
            />
          );
        })}
      </NoteLayout>
    </Layout>
  );
};
export default UniversitiesPage;

export const pageQuery = graphql`
  query ($institutionSlug: String!, $language: String!) {
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
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: {
          posttype: { eq: "notes" }
          language: { eq: $language }
          institutionSlugs: { in: [$institutionSlug] }
        }
      }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            notetags
            title
            date
            institution
          }
        }
      }
    }
  }
`;
