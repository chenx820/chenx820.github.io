import React from "react";

import PropTypes from "prop-types";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
import Tags from "@src/components/Blog/BlogTags";
import SplitLayout from "@common/SplitLayout";
import useRandomBlogPost from "@src/hooks/useRandomBlogPost";

const BlogLayout = ({ children, sharerSection }) => {
  const { randomSlug, randomTitle } = useRandomBlogPost();

  return (
    <SplitLayout
      content={children}
      aside={
        <>
          <section>
            <h4>Random post</h4>
            <Link style={{ fontSize: "16px" }} to={randomSlug}>
              {randomTitle}
            </Link>
            <br />
            <br />
          </section>
          <section>
            <h4>Tags</h4>
            <Tags />
            <br />
          </section>
          {sharerSection && sharerSection}
        </>
      }
    />
  );
};

BlogLayout.propTypes = {
  children: PropTypes.node.isRequired,
  sharerSection: PropTypes.node,
};

export default BlogLayout;
