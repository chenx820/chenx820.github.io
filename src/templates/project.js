import React from "react";
import { graphql } from "gatsby";

import Layout from "@components/Layout/Layout";
import SEO from "@components/seo";

import Flex from "@common/Flex";
import IFrame from "@common/IFrame";
import Button, { IconButton } from "@common/Button";

import { ProjectLinks } from "@components/Projects/ProjectTemplate.style";
import SocialShareSection from "@src/components/Notes/SocialShareSection";
import SplitLayout from "@components/common/SplitLayout";

import { InfoTitle, ProjectWrapper } from "./project.style";

const Project = ({ data }) => {
  const baseSlugUrl =
    "https://chenx820.github.io" + data.markdownRemark.fields.slug;
  const study = data.markdownRemark.frontmatter;

  const infoLinks = study.info.links && (
    <div>
      <InfoTitle>Links & Resources</InfoTitle>
      <ul>
        {study.info.links.map((link, i) => (
          <li key={i}>
            <a href={link[1]}>{link[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Layout>
      <SEO slug={data.markdownRemark.fields.slug} title={study.title} />
      <ProjectWrapper>
        <Flex className="case__title" justify="space-between" align="center">
          <h1>{study.title}</h1>

          {/* <ProjectLinks className="case__links">
            <Button target="__blank" as="a" href={study.demo}>
              Live Demo
            </Button>
            <IconButton
              label="github"
              icon={["fab", "github"]}
              href={study.src}
            />
          </ProjectLinks> */}
        </Flex>

        <section className="case__info">
          <div>
            <aside>
              <InfoTitle>Abstract</InfoTitle>
              <p>{study.info.abstract}</p>
            </aside>
            <aside>
              <InfoTitle>Collaborators</InfoTitle>
              <ul>
                {study.info.collaborators.map((collaborators, i) => (
                  <li key={i}>{collaborators}</li>
                ))}
              </ul>
            </aside>
            {infoLinks}
          </div>
          <div className="case__iframe-container">
            <IFrame src={study.iframe} />
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
                title={study.title}
              />
            </div>
          }
        />
      </ProjectWrapper>
    </Layout>
  );
};

export const query = graphql`
  query projectBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        iframe
        src
        title
        info {
          abstract
          links
          collaborators
        }
      }
    }
  }
`;

export default Project;
