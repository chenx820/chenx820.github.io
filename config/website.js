const meta = {
  // Metadata
  siteTitle: "Chen Huang - Chen's Physics World",
  siteDescription: "Chen Huang - Chen's Physics World.",
  siteTitleAlt: "Chen Huang",
  siteShortName: "Chen Huang",
  siteUrl: "https://chenx820.github.io", // No trailing slash!
};

const social = {
  siteLogo: `src/static/logo.svg`,
  siteBanner: `${meta.siteUrl}/images/social-banner.jpg`,
};

const website = {
  ...meta,
  ...social,
  disqusShortName: "chenx820",
  googleAnalyticsID: "G-6S4PRFFZ9P",
  // Manifest
  themeColor: "#105286",
  backgroundColor: "#105286",
};

module.exports = website;
