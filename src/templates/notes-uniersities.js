import React from "react";
import { graphql } from "gatsby";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";

import NoteCard from "@src/components/Notes/NoteCard";
import NoteLayout from "@src/components/Notes/NotesLayout";

const UniversitiesPage = ({ data, pageContext }) => {
  const { uni } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  const uniHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${uni}"`;

  return (
    <Layout>
      <SEO title={uniHeader + " | Chen Huang"} />

      <NoteLayout>
        <h1>{uniHeader}</h1>
        <br />
        <br />
        {edges.map(({ node }) => {
          const { slug } = node.fields;
          const { title, date, notetags, university } = node.frontmatter;
          return (
            <NoteCard
              notetags={notetags}
              key={node.id}
              slug={slug}
              title={title}
              date={date}
              university={university}
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
  query($uni: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { university: { in: [$uni] } } }
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
            university
          }
        }
      }
    }
  }
`;
