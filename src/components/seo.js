import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import socialBanner from "@src/static/images/social-banner.jpg";

function SEO({ title, description, slug, isPost }) {
  return null;
}

export function PageHead({ title, description, slug, isPost }) {
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

  // Use useTranslation hook to get current language for htmlAttributes
  const { language } = useI18next();
  const { t } = useTranslation();

  const defaults = site.siteMetadata;

  if (defaults.siteUrl === "") {
    console.error("Please set a siteUrl in your site metadata!");
  }

  const pageTitle = title || t("siteTitle", { defaultValue: defaults.title });
  const pageDescription =
    description || t("siteDescription", { defaultValue: defaults.description });

  let url = `${defaults.siteUrl}${slug || ""}`;
  let twitter = defaults.twitter; // Assuming defaults.twitter exists
  let ogimage = `${defaults.siteUrl}${socialBanner}`;

  if (isPost) {
    const postTitle = title
      ? `${title} | Chen Huang`
      : `${t("postPrefix", { defaultValue: "Post" })} | Chen Huang`;
    ogimage = `${defaults.siteUrl}${slug}/social-banner-img.jpg`; // Ensure this path is correct if dynamic
  }

  return (
    <>
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {ogimage && <meta name="image" content={ogimage} />}
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      {isPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {ogimage && <meta property="og:image" content={ogimage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {twitter && <meta name="twitter:creator" content={twitter} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {ogimage && <meta name="twitter:image" content={ogimage} />}
    </>
  );
}

export default SEO;
