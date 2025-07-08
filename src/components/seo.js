import React from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import socialBanner from "@src/static/images/social-banner.jpg";
import { useTranslation } from "gatsby-plugin-react-i18next";

function SEO({ title, description, slug, isPost }) {
  const { t } = useTranslation();
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
          siteLogo
          siteBanner
        }
      }
    }
  `);

  const defaults = site.siteMetadata;

  if (defaults.siteUrl === "") {
    console.error("Please set a siteUrl in your site metadata!");
    return null;
  }

  title = title || defaults.title;
  description = description || defaults.description;

  let url = `${defaults.siteUrl}${slug || ""}`;
  let ogimage = `${defaults.siteUrl}${socialBanner}`;

  if (isPost) {
    title = title + " | " + t("global.name");
    ogimage = `${defaults.siteUrl}${slug}/social-banner-img.jpg`;
  }

  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="url" content={url} />
      <meta name="description" content={description} />
      {ogimage && <meta name="image" content={ogimage} />}
      <link rel="canonical" href={url} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogimage && <meta property="og:image" content={ogimage} />}
    </Helmet>
  );
}

export default SEO;
