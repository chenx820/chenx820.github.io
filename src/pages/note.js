import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "@components/Layout/Layout";
import SEO from "@components/seo";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NoteLayout";

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
              timeToRead
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY", locale: "en")
                tags
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
      <SEO title="Notes - Chen's Physics World" />

      <NoteLayout>
        {noteposts.allMarkdownRemark.edges.map(({ node }) => (
          <NoteCard
            key={node.id}
            slug={node.fields.slug}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            tags={node.frontmatter.tags}
            readtime={node.timeToRead}
            excerpt={node.excerpt}
          />
        ))}
      </NoteLayout>
    </Layout>
  );
};

export default NotePage;
