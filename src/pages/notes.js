import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "@components/Layout/Layout";
import { PageHead } from "@components/seo";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const NotePage = () => {
  const noteposts = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          filter: { fields: { posttype: { eq: "notes" } } }
          sort: { fields: frontmatter___date, order: DESC }
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
      <PageHead title="Notes | Chen Huang" />

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
