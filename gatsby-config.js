const path = require("path");
const config = require("./config/website");

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    description: config.siteDescription,
    siteUrl: config.siteUrl,
    siteLogo: config.siteLogo,
    siteBanner: config.siteBanner,
  },
  trailingSlash: `always`,
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          quality: 100,
          formats: ["auto", "webp"],
          placeholder: "blurred",
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "json",
        path: path.join(__dirname, "content", "json"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "research",
        path: path.join(__dirname, "content", "research"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "notes",
        path: path.join(__dirname, "content", "notes"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "locale",
        path: path.join(__dirname, "locales"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "images",
        path: path.join(__dirname, "src", "static", "images"),
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embedder`,
          {
            resolve: `gatsby-remark-katex`,
            options: { strict: `ignore` },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `gatsby-remark-autolink`,
              maintainCase: true,
              removeAccents: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              showLineNumbers: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              quality: 100,
              showCaptions: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `zh`],
        defaultLanguage: `en`,
        siteUrl: config.siteUrl,
        generateDefaultLanguagePage: false,
        redirect: true,
        i18nextOptions: {
          // detection: {
          //   order: [
          //     "querystring",
          //     "cookie",
          //     "localStorage",
          //     "navigator",
          //     "htmlTag",
          //   ],
          //   caches: [],
          // },
          interpolation: {
            escapeValue: false,
          },
          keySeparator: ".",
          nsSeparator: ":",
          ns: ["common"],
          defaultNS: "common",
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.siteTitleAlt,
        short_name: config.siteShortName,
        start_url: `/`,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: `standalone`,
        icon: config.siteLogo,
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `#105286`,
        showSpinner: false,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/notes/tags/*`, `/notes/institution/*`, `/goodies`],
      },
    },
    `gatsby-plugin-social-banners`,
  ],
};
