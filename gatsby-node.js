const path = require("path");
const fs = require("fs");

// Define your default language here.
// This should match the defaultLanguage in your gatsby-config.js
const defaultLanguage = "en";

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        src: path.join(__dirname, "src"),
        "@src": path.join(__dirname, "src"),
        "@common": path.join(__dirname, "src/components/common"),
        "@components": path.join(__dirname, "src/components"),
        "@pages": path.join(__dirname, "src/pages"),
      },
    },
  });
};

const slugify = require("./src/components/slugify.js"); // Ensure this file exists and exports a slugify function

// Helper function to get English title for Chinese posts
const getEnglishTitle = (filePath, language) => {
  if (language !== "zh") return null;

  // Replace .zh.md with .en.md to get the English file path
  const englishFilePath = filePath.replace(/\.zh\.md$/, ".en.md");

  try {
    if (fs.existsSync(englishFilePath)) {
      const content = fs.readFileSync(englishFilePath, "utf8");
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        return titleMatch[1].trim();
      }
    }
  } catch (error) {
    console.warn(`Could not read English file for ${filePath}:`, error.message);
  }

  return null;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== "MarkdownRemark") return;

  const fileNode = getNode(node.parent);

  const fileName = path.basename(node.fileAbsolutePath);
  const parts = fileName.split(".");
  // Assuming filename format like `index.en.md` or `post-title.es.md`
  // The language part is typically the second to last segment before the file extension
  let language = parts[parts.length - 2];

  // sourceInstanceName defined if its a notes or case-studie or blog
  const sourceInstanceName = fileNode.sourceInstanceName;

  // For Chinese posts, try to get the English title to generate consistent slug
  let titleForSlug = node.frontmatter.title;
  if (language === "zh") {
    const englishTitle = getEnglishTitle(node.fileAbsolutePath, language);
    if (englishTitle) {
      titleForSlug = englishTitle;
    }
  }

  const slugFromTitle = slugify(titleForSlug);

  // extract the name of the file because we need to sort by it's name
  // `001-blahblah` - this assumes a specific naming convention for files like `001-title.en.md`
  // Adjust `substr(2, 1)` if your indexing changes or is not universally applicable.
  const fileIndex = fileNode.name.substr(2, 1);

  // create slug nodes
  // The slug here will be without the language prefix, e.g., `/blog/my-title`
  createNodeField({
    node,
    name: "slug",
    value: "/" + sourceInstanceName + "/" + slugFromTitle,
  });

  createNodeField({
    node,
    name: "language",
    value: language,
  });

  // adds a posttype field to distinguish between notes, blog and research
  createNodeField({
    node,
    name: "posttype",
    value: sourceInstanceName, // value will be {notes||research||blog}
  });

  if (sourceInstanceName === "research") {
    createNodeField({
      node,
      name: "fileIndex",
      value: fileIndex,
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const projectTemplate = path.resolve("src/templates/project.js");
  const notePostTemplate = path.resolve("src/templates/note-post.js");
  const blogPostTemplate = path.resolve("src/templates/blog-post.js");
  const noteTagTemplate = path.resolve("src/templates/notes-tags.js");
  const blogTagTemplate = path.resolve("src/templates/blog-tags.js");
  const noteUniTemplate = path.resolve("src/templates/notes-universities.js");

  const res = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              notetags
              blogtags
              institution
            }
            fields {
              slug
              posttype
              language
            }
          }
        }
      }
    }
  `);

  if (res.errors) {
    reporter.panicOnBuild("Error loading MarkdownRemark nodes:", res.errors);
    return Promise.reject(res.errors); // Properly reject the promise for error handling
  }

  const edges = res.data.allMarkdownRemark.edges;

  edges.forEach(({ node }) => {
    // Use the slug directly without adding language prefix
    // gatsby-plugin-react-i18next will handle the language routing automatically
    const pagePath = node.fields.slug;

    // Pass language to the context for all content types
    const commonContext = {
      slug: node.fields.slug,
      language: node.fields.language,
    };

    if (node.fields.posttype === "research") {
      createPage({
        path: pagePath,
        component: projectTemplate,
        context: commonContext,
      });
    } else if (node.fields.posttype === "notes") {
      const noteTagSet = new Set();
      if (
        node.frontmatter.notetags &&
        Array.isArray(node.frontmatter.notetags)
      ) {
        node.frontmatter.notetags.forEach((tag) => noteTagSet.add(tag));
      }

      const tagList = Array.from(noteTagSet);
      tagList.forEach((tag) => {
        // Tag pages are currently not localized by path (e.g., /notes/tags/science/ vs /es/notes/tags/ciencia/)
        // If you need localized tag paths, this logic would need to be expanded
        // to generate /notes/tags/science/ for EN and /es/notes/tags/ciencia/ for ES.
        // This usually involves creating language-specific tag slugs and separate tag pages for each language.
        createPage({
          path: `/notes/tags/${slugify(tag)}/`,
          component: noteTagTemplate,
          context: {
            tag,
            language: node.fields.language, // Pass language for consistent context
          },
        });
      });

      const universityField = node.frontmatter.institution;
      if (
        universityField &&
        (Array.isArray(universityField) || typeof universityField === "string")
      ) {
        const universityList = Array.isArray(universityField)
          ? universityField
          : [universityField];
        universityList.forEach((inst) => {
          // University pages are currently not localized by path
          createPage({
            path: `/notes/institution/${slugify(inst)}/`,
            component: noteUniTemplate,
            context: {
              inst,
              language: node.fields.language, // Pass language for consistent context
            },
          });
        });
      }

      createPage({
        path: pagePath,
        component: notePostTemplate,
        context: commonContext,
      });
    } else if (node.fields.posttype === "blog") {
      const blogTagSet = new Set();
      if (
        node.frontmatter.blogtags &&
        Array.isArray(node.frontmatter.blogtags)
      ) {
        node.frontmatter.blogtags.forEach((tag) => blogTagSet.add(tag));
      }

      const tagList = Array.from(blogTagSet);
      tagList.forEach((tag) => {
        // Blog tag pages are currently not localized by path
        createPage({
          path: `/blog/tags/${slugify(tag)}/`,
          component: blogTagTemplate,
          context: {
            tag,
            language: node.fields.language, // Pass language for consistent context
          },
        });
      });

      createPage({
        path: pagePath,
        component: blogPostTemplate,
        context: commonContext,
      });
    }
  });
};
