const meta = {
  // Metadata
  siteTitle: "Chen Huang - Chen's Physics World",
  siteDescription: "Chen Huang - Chen's Physics World.",
  siteTitleAlt: "Chen Huang",
  siteShortName: "Chen Huang",
  siteUrl: "https://chenx820.github.io", // No trailing slash!
};

const social = {
  siteLogo: `src/static/logo.png`,
  siteBanner: `${meta.siteUrl}/images/social-banner.png`,
  twitter: "@anuraghazru",
};

const website = {
  ...meta,
  ...social,
  disqusShortName: "chenx820",
  googleAnalyticsID: "UA-119972196-1",
  // Manifest
  themeColor: "#6D83F2",
  backgroundColor: "#6D83F2",
};

module.exports = website;
