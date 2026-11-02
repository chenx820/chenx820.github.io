const meta = {
  // Metadata
  siteTitle: "Chen Huang",
  siteDescription: "Chen Huang",
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
  // Public Web Analytics token from Cloudflare's JS snippet (not an API key).
  cloudflareWebAnalyticsToken: "4d434e7f00884781b0073f2ed14f492e",
  // Manifest
  themeColor: " #799EFF",
  backgroundColor: " #FFFFFF",
};

module.exports = website;
