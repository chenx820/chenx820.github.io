import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

export const randomGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const useRandomBlogPost = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const blogposts = useStaticQuery(graphql`
    query {
      allMarkdownRemark(filter: { fields: { posttype: { eq: "blog" } } }) {
        edges {
          node {
            frontmatter {
              title
            }
            fields {
              slug
              language
            }
          }
        }
        totalCount
      }
    }
  `);

  // 根据当前语言过滤文章
  const filteredPosts = blogposts.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.language === currentLanguage
  );

  // 如果没有当前语言的文章，返回null
  if (filteredPosts.length === 0) {
    return {
      randomSlug: null,
      randomTitle: null,
    };
  }

  let randomPost = filteredPosts[randomGenerator(0, filteredPosts.length - 1)];

  // make sure we don't have redundant randomPost
  if (typeof window !== "undefined") {
    while (randomPost.node.fields.slug === window.location.pathname) {
      randomPost = filteredPosts[randomGenerator(0, filteredPosts.length - 1)];
      // don't wanna run it second time
      break;
    }
  }

  return {
    randomSlug: randomPost.node.fields.slug,
    randomTitle: randomPost.node.frontmatter.title,
  };
};
export default useRandomBlogPost;
