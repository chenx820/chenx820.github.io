import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '@components/Layout/Layout';
import { PageHead } from "@components/seo";

import BlogCard from '@components/Blog/BlogCard';
import BlogLayout from '@components/Blog/BlogLayout';

const BlogPage = () => {
  const blogposts = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          filter: { fields: { posttype: { eq: "blog" } } }
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
                blogtags
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
      <PageHead title="Blog | Chen Huang" />

      <BlogLayout>
        {blogposts.allMarkdownRemark.edges.map(({ node }) => (
          <BlogCard
            key={node.id}
            slug={node.fields.slug}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            blogtags={node.frontmatter.blogtags}
            readtime={node.timeToRead}
            excerpt={node.excerpt}
          />
        ))}
      </BlogLayout>
    </Layout>
  );
};

export default BlogPage;
