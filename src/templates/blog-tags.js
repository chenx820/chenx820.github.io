import React from "react";
import { graphql } from "gatsby";

import { PageHead } from "@components/seo";
import Layout from "@components/Layout/Layout";

import BlogCard from "@src/components/Blog/BlogCard";
import BlogLayout from "@src/components/Blog/BlogLayout";

const TagsPage = ({ data, pageContext }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`;

  return (
    <Layout>
      <PageHead title={tagHeader + " | Chen Huang"} />

      <BlogLayout>
        <h1>{tagHeader}</h1>
        <br />
        <br />
        {edges.map(({ node }) => {
          const { slug } = node.fields;
          const { title, date, blogtags } = node.frontmatter;
          return (
            <BlogCard
              blogtags={blogtags}
              key={node.id}
              slug={slug}
              title={title}
              date={date}
              readtime={node.timeToRead}
              excerpt={node.excerpt}
            />
          );
        })}
      </BlogLayout>
    </Layout>
  );
};
export default TagsPage;

export const pageQuery = graphql`
  query ($tag: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { blogtags: { in: [$tag] } } }
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
            blogtags
            title
            date(formatString: "MMMM DD, YYYY", locale: "en")
          }
        }
      }
    }
  }
`;
