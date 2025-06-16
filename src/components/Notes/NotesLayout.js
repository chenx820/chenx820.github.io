import React from "react";

import PropTypes from "prop-types";
import { Link } from "gatsby";

import Tags from "@src/components/Notes/NotesTags";
import Institutions from "@src/components/Notes/NotesInstitutions";
import SplitLayout from "@common/SplitLayout";
import useRandomNotePost from "@src/hooks/useRandomNotePost";

const NoteLayout = ({ children, sharerSection }) => {
  const { randomSlug, randomTitle } = useRandomNotePost();

  return (
    <SplitLayout
      content={children}
      aside={
        <>
          <section>
            <h4>Random note</h4>
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
          <section>
            <h4>Institution</h4>
            <Institutions />
            <br />
          </section>
          {sharerSection && sharerSection}
        </>
      }
    />
  );
};

NoteLayout.propTypes = {
  children: PropTypes.node.isRequired,
  sharerSection: PropTypes.node,
};

export default NoteLayout;
