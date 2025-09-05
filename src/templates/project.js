import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

import Layout from "@components/Layout/Layout";
import SEO from "@components/seo";

import Flex from "@common/Flex";
import IFrame from "@common/IFrame";

import SocialShareSection from "@src/components/Notes/SocialShareSection";
import SplitLayout from "@components/common/SplitLayout";

import { InfoTitle, ResearchWrapper } from "./project.style";

const Research = ({ data }) => {
  const { t } = useTranslation();
  const baseSlugUrl =
    "https://chenx820.github.io" + data.markdownRemark.fields.slug;
  const project = data.markdownRemark.frontmatter;

  const infoLinks = project.info.links && (
    <div>
      <InfoTitle>Links & Resources</InfoTitle>
      <ul>
        {project.info.links.map((link, i) => (
          <li key={i}>
            <a href={link[1]}>{link[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Layout>
      <SEO slug={data.markdownRemark.fields.slug} title={project.title} />
      <ResearchWrapper>
        <Flex className="research_title" justify="space-between" align="center">
          <h1>{project.title}</h1>
        </Flex>

        <section className="research__info">
          <div>
            <aside>
              <InfoTitle>Abstract</InfoTitle>
              <p>{project.info.abstract}</p>
            </aside>
            <aside>
              <InfoTitle>Collaborators</InfoTitle>
              <ul>
                {project.info.collaborators.map((collaborators, i) => (
                  <li key={i}>{collaborators}</li>
                ))}
              </ul>
            </aside>
            {infoLinks}
          </div>
          <div className="research__iframe-container">
            <IFrame src={project.iframe} />
          </div>
        </section>

        <SplitLayout
          content={
            <article
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
            />
          }
          aside={
            <div>
              <h4>Share on</h4>
              <SocialShareSection
                baseSlugUrl={baseSlugUrl}
                title={project.title}
              />
            </div>
          }
        />
      </ResearchWrapper>
    </Layout>
  );
};

export const query = graphql`
  query projectBySlug($slug: String!, $language: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        iframe
        title
        info {
          abstract
          links
          collaborators
        }
      }
    }
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
  }
`;

export default Research;
