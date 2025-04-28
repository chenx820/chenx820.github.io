import React from "react";
import styled from "styled-components";
import { Link, graphql, useStaticQuery } from "gatsby";
import slugify from "@components/slugify";

export const useTags = () => {
  const notetags = useStaticQuery(graphql`
    query {
      allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___notetags) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return notetags;
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
  const notetags = useTags();

  return (
    <section style={{ overflow: "auto" }}>
      {notetags.allMarkdownRemark.group.map((tag) => (
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
