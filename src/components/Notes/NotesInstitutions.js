import React from "react";
import styled from "styled-components";
import { Link, graphql, useStaticQuery } from "gatsby";
import slugify from "@components/slugify";

export const useUniversity = () => {
  const noteinstitution = useStaticQuery(graphql`
    query {
      allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___institution) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return noteinstitution;
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
  const noteinstitution = useUniversity();

  return (
    <section style={{ overflow: "auto" }}>
      {noteinstitution.allMarkdownRemark.group.map((tag) => (
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
