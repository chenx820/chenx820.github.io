import React from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import slugify from "@components/slugify";

export const useUniversity = () => {
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
              institution
            }
          }
        }
      }
    }
  `);

  // Filter by language and collect institutions
  const languagePosts = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.language === language
  );

  // Collect all institutions from current language posts
  const institutionCounts = {};
  languagePosts.forEach(({ node }) => {
    if (node.frontmatter.institution) {
      const institutions = Array.isArray(node.frontmatter.institution)
        ? node.frontmatter.institution
        : [node.frontmatter.institution];

      institutions.forEach((institution) => {
        institutionCounts[institution] =
          (institutionCounts[institution] || 0) + 1;
      });
    }
  });

  // Convert to the expected format
  const group = Object.entries(institutionCounts).map(
    ([fieldValue, totalCount]) => ({
      fieldValue,
      totalCount,
    })
  );

  return { allMarkdownRemark: { group } };
};

export const TagBreadcrumb = styled(Link)`
  float: left;
  border: 1px solid ${(p) => (p.theme.dark ? p.theme.primaryColor : "#d9e0ff")};
  border-radius: 50px;
  padding: 8px 13px;
  line-height: 110%;
  margin: 5px;
  font-size: 12px;

  &:hover {
    background: ${(p) => (p.theme.dark ? p.theme.primaryColor : "#d9e0ff")};
    color: ${(p) => (p.theme.dark ? "#d9e0ff" : "#105286")};
  }
`;

const Institutions = () => {
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
              institution
            }
          }
        }
      }
    }
  `);

  // Filter by language and collect institutions
  const languagePosts = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.language === language
  );

  // Collect all institutions from current language posts
  const institutionCounts = {};
  languagePosts.forEach(({ node }) => {
    if (node.frontmatter.institution) {
      const institutions = Array.isArray(node.frontmatter.institution)
        ? node.frontmatter.institution
        : [node.frontmatter.institution];

      institutions.forEach((institution) => {
        institutionCounts[institution] =
          (institutionCounts[institution] || 0) + 1;
      });
    }
  });

  // Convert to the expected format
  const institutions = Object.entries(institutionCounts).map(
    ([fieldValue, totalCount]) => ({
      fieldValue,
      totalCount,
    })
  );

  return (
    <section style={{ overflow: "auto" }}>
      {institutions.map((tag) => (
        <TagBreadcrumb
          key={tag.fieldValue}
          to={`/notes/institution/${slugify(tag.fieldValue)}/`}
          aria-label={`${tag.totalCount} posts tagged with ${tag.fieldValue}`}
        >
          {tag.fieldValue}, {tag.totalCount}
        </TagBreadcrumb>
      ))}
    </section>
  );
};

export default Institutions;
