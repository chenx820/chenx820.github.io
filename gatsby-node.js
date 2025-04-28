const axios = require("axios");
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
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

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const projectTemplate = path.resolve("src/templates/project.js");
  const notePostTemplate = path.resolve("src/templates/note-post.js");
  const blogPostTemplate = path.resolve("src/templates/blog-post.js");
  const noteTagTemplate = path.resolve("src/templates/notes-tags.js");
  const blogTagTemplate = path.resolve("src/templates/blog-tags.js");

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              notetags
              blogtags
            }
            fields {
              slug
              posttype
            }
          }
        }
      }
    }
  `).then((res) => {
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
        node.frontmatter.notetags.forEach((tag) => noteTagSet.add(tag));

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

        // create each individual notes post with `notePostTemplate`
        createPage({
          path: node.fields.slug,
          component: notePostTemplate,
          context: {
            slug: node.fields.slug,
          },
        });
      } else {
        const blogTagSet = new Set();
        node.frontmatter.blogtags.forEach((tag) => blogTagSet.add(tag));

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

        // create each individual blog post with `blogPostTemplate`
        createPage({
          path: node.fields.slug,
          component: blogPostTemplate,
          context: {
            slug: node.fields.slug,
          },
        });
      }
    });
  });
};

exports.sourceNodes = ({
  actions,
  createNodeId,
  createContentDigest,
  store,
  cache,
}) => {
  const { createNode } = actions;
  const CC_PROJECTS_URI = "https://anuraghazra.github.io/CanvasFun/data.json";

  const createCreativeCodingNode = (project, i) => {
    const node = {
      id: createNodeId(`${i}`),
      parent: null,
      children: [],
      internal: {
        type: `CreativeCoding`,
        content: JSON.stringify(project),
        contentDigest: createContentDigest(project),
      },
      ...project,
    };

    // create `allCreativeCoding` Node
    createNode(node);
  };

  // GET IMAGE THUMBNAILS
  const createRemoteImage = async (project, i) => {
    try {
      // it will download the remote files
      await createRemoteFileNode({
        id: `${i}`,
        url: project.img, // the image url
        store,
        cache,
        createNode,
        createNodeId,
      });
    } catch (error) {
      throw new Error("error creating remote img node - " + error);
    }
  };

  // promise based sourcing
  return axios
    .get(CC_PROJECTS_URI)
    .then((res) => {
      res.data.forEach((project, i) => {
        createCreativeCodingNode(project, i);
        createRemoteImage(project, i);
      });
    })
    .catch((err) => {
      // just create a dummy node to pass the build if faild to fetch data
      createCreativeCodingNode(
        {
          id: "0",
          demo: "",
          img: "",
          title: "Error while loading Data",
          src: "",
        },
        0
      );
      throw new Error(err);
    });
};
