import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";

import BlogCard from "@src/components/Blog/BlogCard";
import BlogLayout from "@src/components/Blog/BlogLayout";

const TagsPage = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`;

  return (
    <Layout>
      <SEO title={tagHeader + " | " + t("global.name")} />

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
  query ($tag: String, $language: String!) {
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
        frontmatter: { blogtags: { in: [$tag] } }
        fields: { language: { eq: $language } }
      }
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
            date(formatString: "MMMM DD, YYYY", locale: $language)
          }
        }
      }
    }
  }
`;
