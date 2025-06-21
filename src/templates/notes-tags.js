import React from "react";
import { graphql } from "gatsby";

import { PageHead } from "@components/seo";
import Layout from "@components/Layout/Layout";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const TagsPage = ({ data, pageContext }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`;

  return (
    <Layout>
      <PageHead title={tagHeader + " | Chen Huang"} />

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
  query ($tag: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { notetags: { in: [$tag] } } }
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
            date(formatString: "MMMM DD, YYYY", locale: "en")
            institution
          }
        }
      }
    }
  }
`;
