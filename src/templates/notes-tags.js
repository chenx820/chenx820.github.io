import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { getNoteTagLabel } from "@components/Notes/noteTag";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const TagsPage = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const { language } = useI18next();
  const tag = getNoteTagLabel(pageContext.tagSlug, language, pageContext.tag);
  const { edges, totalCount } = data.allMarkdownRemark;

  const tagHeader = t("notes.tagged-posts", { count: totalCount, tag });

  return (
    <Layout>
      <SEO title={tagHeader + " | " + t("global.name")} />

      <NoteLayout>
        <h1>{tagHeader}</h1>
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
export default TagsPage;

export const pageQuery = graphql`
  query ($tagSlug: String!, $language: String!) {
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
          noteTagSlugs: { in: [$tagSlug] }
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
