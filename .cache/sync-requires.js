const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-404-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/pages/404.js"))),
  "component---src-pages-blog-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/pages/blog.js"))),
  "component---src-pages-goodies-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/pages/goodies.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/pages/index.js"))),
  "component---src-templates-blog-post-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/templates/blog-post.js"))),
  "component---src-templates-case-study-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/templates/case-study.js"))),
  "component---src-templates-tags-js": hot(preferDefault(require("/Users/chenhuang/chenx820.github.io/src/templates/tags.js")))
}

