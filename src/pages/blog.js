import React from "react";
import { graphql } from "gatsby";
import { Trans, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import BlogCard from "@components/Blog/BlogCard";
import BlogLayout from "@components/Blog/BlogLayout";

const BlogPage = ({ data }) => {
  const { t } = useTranslation();
  const { language } = useI18next();
  const { allMarkdownRemark } = data;

  return (
    <Layout>
      <SEO title={t("blog.title") + " | " + t("global.name")} />

      <BlogLayout>
        {allMarkdownRemark.edges.map(({ node }) => (
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

export const query = graphql`
  query ($language: String!) {
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
      filter: {
        fields: { posttype: { eq: "blog" }, language: { eq: $language } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          excerpt
          timeToRead
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY", locale: $language)
            blogtags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
