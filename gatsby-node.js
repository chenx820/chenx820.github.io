const path = require("path");

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

const slugify = require("./src/components/slugify.js");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== "MarkdownRemark") return;

  const fileNode = getNode(node.parent);
  const slugFromTitle = slugify(node.frontmatter.title);

  // sourceInstanceName defined if its a notes or case-studie or blog
  const sourceInstanceName = fileNode.sourceInstanceName;

  // extract the name of the file because we need to sort by it's name
  // `001-blahblah`
  const fileIndex = fileNode.name.substr(2, 1);

  // create slug nodes
  createNodeField({
    node,
    name: "slug",
    // value will be {notes||research||blog}/my-title
    value: "/" + sourceInstanceName + "/" + slugFromTitle,
  });

  // adds a posttype field to extinguish between notes, blog and research
  createNodeField({
    node,
    name: "posttype",
    // value will be {notes||research||blog}
    value: sourceInstanceName,
  });

  if (sourceInstanceName == "research") {
    createNodeField({
      node,
      name: "fileIndex",
      value: fileIndex,
    });
  }
};

exports.createPages = async ({ actions, graphql }) => {
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
            }
          }
        }
      }
    }
  `);

  if (res.errors) return Promise.reject(res.errors);

  const edges = res.data.allMarkdownRemark.edges;

  edges.forEach(({ node }) => {
    if (node.fields.posttype === "research") {
      createPage({
        path: node.fields.slug,
        component: projectTemplate,
        context: {
          slug: node.fields.slug,
        },
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
        createPage({
          path: `/notes/tags/${slugify(tag)}/`,
          component: noteTagTemplate,
          context: {
            tag,
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
          createPage({
            path: `/notes/institution/${slugify(inst)}/`,
            component: noteUniTemplate,
            context: { inst },
          });
        });
      }

      createPage({
        path: node.fields.slug,
        component: notePostTemplate,
        context: {
          slug: node.fields.slug,
        },
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
        createPage({
          path: `/blog/tags/${slugify(tag)}/`,
          component: blogTagTemplate,
          context: {
            tag,
          },
        });
      });

      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
        },
      });
    }
  });
};
