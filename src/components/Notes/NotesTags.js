import React from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import slugify from "@components/slugify";

export const useTags = () => {
  const { language } = useI18next();
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        limit: 2000
        filter: { fields: { posttype: { eq: "notes" } } }
      ) {
        edges {
          node {
            fields {
              language
            }
            frontmatter {
              notetags
            }
          }
        }
      }
    }
  `);

  // Filter by language and collect tags
  const languagePosts = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.language === language
  );

  // Collect all tags from current language posts
  const tagCounts = {};
  languagePosts.forEach(({ node }) => {
    if (node.frontmatter.notetags) {
      node.frontmatter.notetags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Convert to the expected format
  const group = Object.entries(tagCounts).map(([fieldValue, totalCount]) => ({
    fieldValue,
    totalCount,
  }));

  return { allMarkdownRemark: { group } };
};

export const TagBreadcrumb = styled(Link)`
  float: left;
  border: 1px solid ${(p) => (p.theme.dark ? p.theme.primaryColor : "#d9e0ff")};
  border-radius: 50px;
  padding: 8px 13px;
  line-height: 10px;
  margin: 5px;
  font-size: 12px;

  &:hover {
    background: ${(p) => (p.theme.dark ? p.theme.primaryColor : "#d9e0ff")};
    color: ${(p) => (p.theme.dark ? "#d9e0ff" : "#105286")};
  }
`;

const Tags = () => {
  const { language } = useI18next();
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        limit: 2000
        filter: { fields: { posttype: { eq: "notes" } } }
      ) {
        edges {
          node {
            fields {
              language
            }
            frontmatter {
              notetags
            }
          }
        }
      }
    }
  `);

  // Filter by language and collect tags
  const languagePosts = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.language === language
  );

  // Collect all tags from current language posts
  const tagCounts = {};
  languagePosts.forEach(({ node }) => {
    if (node.frontmatter.notetags) {
      node.frontmatter.notetags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Convert to the expected format
  const tags = Object.entries(tagCounts).map(([fieldValue, totalCount]) => ({
    fieldValue,
    totalCount,
  }));

  return (
    <section style={{ overflow: "auto" }}>
      {tags.map((tag) => (
        <TagBreadcrumb
          key={tag.fieldValue}
          to={`/notes/tags/${slugify(tag.fieldValue)}/`}
          aria-label={`${tag.totalCount} posts tagged with ${tag.fieldValue}`}
        >
          {tag.fieldValue}, {tag.totalCount}
        </TagBreadcrumb>
      ))}
    </section>
  );
};

export default Tags;
