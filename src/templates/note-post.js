import React from "react";
import { graphql } from "gatsby";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";

import NoteLayout from "@src/components/Notes/NotesLayout";
import SocialShareSection from "@src/components/Notes/SocialShareSection";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NoteDateAndReadTime } from "@src/components/Notes/NoteCard";
import { DiscussionEmbed } from "disqus-react";

import { siteUrl, disqusShortName } from "../../config/website";

const NotePost = ({ data, pageContext }) => {
  const { title, date, institution } = data.markdownRemark.frontmatter;
  const { html, excerpt, id } = data.markdownRemark;

  const baseSlugUrl = siteUrl + pageContext.slug;
  const disqusConfig = {
    identifier: id,
    title: title,
    url: baseSlugUrl,
  };

  const githubLink = `https://github.com/chenx820/chenx820.github.io/tree/main/content${pageContext.slug}/index.md`;

  return (
    <Layout>
      <SEO isPost title={title} description={excerpt} slug={pageContext.slug} />

      <NoteLayout
        sharerSection={
          <div>
            <h4>Share on</h4>
            <SocialShareSection baseSlugUrl={baseSlugUrl} title={title} />
            <hr style={{ margin: "25px 0" }} />
            <a
              style={{ fontSize: "16px" }}
              aria-label="Edit post on github"
              rel="noopener norefferer"
              target="__blank"
              href={githubLink}
            >
              <FontAwesomeIcon style={{ fontSize: 18 }} icon="edit" /> Edit post
              on GitHub
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
        {typeof window !== "undefined" && (
          <DiscussionEmbed shortname={disqusShortName} config={disqusConfig} />
        )}
      </NoteLayout>
    </Layout>
  );
};

export const query = graphql`
  query NotePostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt
      html
      id
      frontmatter {
        date(formatString: "MMMM DD, YYYY", locale: "en")
        title
        institution
      }
    }
  }
`;

export default NotePost;
