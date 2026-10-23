/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

require("typeface-montserrat");
require("typeface-karla");

// require('prismjs/themes/prism-tomorrow.css')
require("./src/styles/prism-purpleking-dark.css");
require("prismjs/plugins/line-numbers/prism-line-numbers.css");
require("katex/dist/katex.min.css");

const { Helmet } = require("react-helmet");

exports.onRenderBody = ({
  pathname,
  setHtmlAttributes,
  setBodyAttributes,
  setHeadComponents,
}) => {
  const helmet = Helmet.renderStatic();
  setHtmlAttributes({
    ...helmet.htmlAttributes.toComponent(),
    lang: pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en",
  });
  setBodyAttributes(helmet.bodyAttributes.toComponent());
  setHeadComponents([
    ...helmet.title.toComponent(),
    ...helmet.meta.toComponent(),
    ...helmet.link.toComponent(),
    ...helmet.script.toComponent(),
    ...helmet.style.toComponent(),
    ...helmet.noscript.toComponent(),
  ]);
};
