import React from "react";
import { graphql } from "gatsby";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";

import NoteLayout from "@src/components/Notes/NotesLayout";
import SocialShareSection from "@src/components/Notes/SocialShareSection";
import ScrollExtras from "@common/ScrollExtras";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NoteDateAndReadTime } from "@src/components/Notes/NoteCard";
import { DiscussionEmbed } from "disqus-react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";

import { siteUrl, disqusShortName } from "../../config/website";

const NotePost = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const { language, originalPath } = useI18next();
  const { title, date, institution } = data.markdownRemark.frontmatter;
  const { html, excerpt, id } = data.markdownRemark;

  const baseSlugUrl =
    siteUrl + (language === "en" ? "" : `/${language}`) + originalPath;
  const disqusConfig = {
    identifier: id,
    title: title,
    url: baseSlugUrl,
    language: language === "zh" ? "zh" : "en",
  };

  const githubLink = `https://github.com/chenx820/chenx820.github.io/tree/main/${data.markdownRemark.fields.sourcePath}`;

  return (
    <Layout>
      <SEO isPost title={title} description={excerpt} slug={pageContext.slug} />

      <NoteLayout
        sharerSection={
          <div>
            <h4>{t("common.share-on")}</h4>
            <SocialShareSection baseSlugUrl={baseSlugUrl} title={title} />
            <hr style={{ margin: "25px 0" }} />
            <a
              style={{ fontSize: "16px" }}
              aria-label={t("common.edit-on-github")}
              rel="noopener norefferer"
              target="__blank"
              href={githubLink}
            >
              <FontAwesomeIcon style={{ fontSize: 18 }} icon="edit" />{" "}
              {t("common.edit-on-github")}
            </a>
          </div>
        }
      >
        <NoteDateAndReadTime date={date} institution={institution} />
        <h1>{title}</h1>
        <article
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <DiscussionEmbed shortname={disqusShortName} config={disqusConfig} />
      </NoteLayout>

      <ScrollExtras />
    </Layout>
  );
};

export const query = graphql`
  query NotePostBySlug($slug: String!, $language: String!) {
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
    markdownRemark(
      fields: { slug: { eq: $slug }, language: { eq: $language } }
    ) {
      excerpt
      html
      id
      fields {
        sourcePath
      }
      frontmatter {
        date
        title
        institution
      }
    }
  }
`;

export default NotePost;
