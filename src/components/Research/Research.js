import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";
import IFrame from "@common/IFrame";
import Button from "@common/Button";

import ResearchTemplate from "./ResearchTemplate";
import { ResearchLinks, ResearchPreview } from "./ResearchTemplate.style";

const ResearchWrapper = styled.section`
  ${(props) => props.theme.spacing.sectionBottom};
`;
const Research = () => {
  const { t } = useTranslation();
  const research = useStaticQuery(
    graphql`
      {
        allMarkdownRemark(
          filter: { fields: { posttype: { eq: "research" } } }
          sort: { fields: { fileIndex: ASC } }
        ) {
          edges {
            node {
              id
              frontmatter {
                excerpt
                iframe
                title
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
    <ResearchWrapper id="research" style={{ marginBottom: 100 }}>
      <PageHeader>{t("research.title")}</PageHeader>

      {research.allMarkdownRemark.edges.map(({ node }) => (
        <ResearchTemplate
          key={node.id}
          title={node.frontmatter.title}
          desc={node.frontmatter.excerpt}
          links={
            <ResearchLinks>
              <Button as={Link} to={node.fields.slug}>
                Read More
              </Button>
            </ResearchLinks>
          }
          preview={
            <ResearchPreview>
              <IFrame src={node.frontmatter.iframe} />
            </ResearchPreview>
          }
        />
      ))}
    </ResearchWrapper>
  );
};

export default Research;
