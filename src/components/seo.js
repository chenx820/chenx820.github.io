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

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chen Huang",
    url: defaults.siteUrl,
    image: ogimage,
    jobTitle: "PhD Student in Computer Science and Engineering",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "The Chinese University of Hong Kong",
    },
    knowsAbout: ["Quantum Computing", "Computer Science"],
    sameAs: [
      "https://github.com/chenx820",
      "https://linkedin.com/in/chen-huang-820x",
    ],
  };

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

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogimage && <meta name="twitter:image" content={ogimage} />}

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
}

export default SEO;
