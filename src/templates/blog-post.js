import React from "react";
import { graphql } from "gatsby";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";

import BlogLayout from "@components/Blog/BlogLayout";
import SocialShareSection from "@components/Blog/SocialShareSection";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlogDateAndReadTime } from "@components/Blog/BlogCard";
import { DiscussionEmbed } from "disqus-react";

import { siteUrl, disqusShortName } from "../../config/website";

const BlogPost = ({ data, pageContext }) => {
  const { title, date, blogtags } = data.markdownRemark.frontmatter;
  const { timeToRead, html, excerpt, id } = data.markdownRemark;

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

      <BlogLayout
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
        <BlogDateAndReadTime date={date} readtime={timeToRead} />
        <h1>{title}</h1>
        <article
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <DiscussionEmbed shortname={disqusShortName} config={disqusConfig} />
      </BlogLayout>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostBySlug($slug: String!, $language: String!) {
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
      timeToRead
      id
      frontmatter {
        date(formatString: "MMMM DD, YYYY", locale: $language)
        title
        blogtags
      }
    }
  }
`;

export default BlogPost;
