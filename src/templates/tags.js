import React from "react";
import { graphql } from "gatsby";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";
import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NoteLayout";

const TagsPage = ({ data, pageContext }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`;

  return (
    <Layout>
      <SEO title={tagHeader + " | Chen Huang"} />

      <NoteLayout>
        <h1>{tagHeader}</h1>
        <br />
        <br />
        {edges.map(({ node }) => {
          const { slug } = node.fields;
          const { title, date, tags } = node.frontmatter;
          return (
            <NoteCard
              tags={tags}
              key={node.id}
              slug={slug}
              title={title}
              date={date}
              readtime={node.timeToRead}
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
  query($tag: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt
          timeToRead
          fields {
            slug
          }
          frontmatter {
            tags
            title
            date(formatString: "MMMM DD, YYYY", locale: "en")
          }
        }
      }
    }
  }
`;
