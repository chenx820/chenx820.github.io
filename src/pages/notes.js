import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Trans, useTranslation } from "gatsby-plugin-react-i18next";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const NotePage = () => {
  const noteposts = useStaticQuery(
    graphql`
      {
        allMarkdownRemark(
          filter: { fields: { posttype: { eq: "notes" } } }
          sort: { frontmatter: { date: DESC } }
        ) {
          edges {
            node {
              id
              excerpt
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY", locale: "en")
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
    `
  );
  return (
    <Layout>
      <SEO title="Notes | Chen Huang" />

      <NoteLayout>
        {noteposts.allMarkdownRemark.edges.map(({ node }) => (
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

export default NotePage;
