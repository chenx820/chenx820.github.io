// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---src-pages-404-js": () => import("./../../../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-pages-blog-js": () => import("./../../../src/pages/blog.js" /* webpackChunkName: "component---src-pages-blog-js" */),
  "component---src-pages-goodies-js": () => import("./../../../src/pages/goodies.js" /* webpackChunkName: "component---src-pages-goodies-js" */),
  "component---src-pages-index-js": () => import("./../../../src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */),
  "component---src-templates-blog-post-js": () => import("./../../../src/templates/blog-post.js" /* webpackChunkName: "component---src-templates-blog-post-js" */),
  "component---src-templates-case-study-js": () => import("./../../../src/templates/case-study.js" /* webpackChunkName: "component---src-templates-case-study-js" */),
  "component---src-templates-tags-js": () => import("./../../../src/templates/tags.js" /* webpackChunkName: "component---src-templates-tags-js" */)
}

