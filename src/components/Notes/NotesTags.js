import React from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";
import { Link, useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import { getNoteTagSlug } from "./noteTag";

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
    ({ node }) => node.fields.language === language,
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
  border: 1px solid ${(p) => p.theme.primaryColor};
  border-radius: 50px;
  padding: 8px 13px;
  line-height: 10px;
  margin: 5px;
  font-size: 12px;

  ${(p) =>
    p.$active &&
    `
    background: ${p.theme.primaryColor};
    color: ${p.theme.onPrimaryColor};
    font-weight: 600;
  `}

  &:hover {
    background: ${(p) => p.theme.primaryColor};
    color: ${(p) => p.theme.onPrimaryColor};
  }
`;

const Tags = () => {
  const { language, originalPath } = useI18next();
  const { t } = useTranslation();
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
    ({ node }) => node.fields.language === language,
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
      {tags.map((tag) => {
        const tagSlug = getNoteTagSlug(tag.fieldValue);
        const isActive = originalPath === `/notes/tags/${tagSlug}/`;
        const linkTo = isActive ? "/notes/" : `/notes/tags/${tagSlug}/`;

        return (
          <TagBreadcrumb
            key={tag.fieldValue}
            to={linkTo}
            $active={isActive}
            aria-selected={isActive}
            aria-label={t("notes.tagged-posts", {
              count: tag.totalCount,
              tag: tag.fieldValue,
            })}
          >
            {tag.fieldValue}, {tag.totalCount}
          </TagBreadcrumb>
        );
      })}
    </section>
  );
};

export default Tags;
