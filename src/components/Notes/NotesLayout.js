import React from "react";

import PropTypes from "prop-types";
import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
import Tags from "@src/components/Notes/NotesTags";
import Institutions from "@src/components/Notes/NotesInstitutions";
import SplitLayout from "@common/SplitLayout";
import useRandomNotePost from "@src/hooks/useRandomNotePost";

const NoteLayout = ({ children, sharerSection }) => {
  const { t } = useTranslation();
  const { randomSlug, randomTitle } = useRandomNotePost();

  return (
    <SplitLayout
      content={children}
      aside={
        <>
          {randomSlug && randomTitle && (
            <section>
              <h4>{t("nav.random-note", "Random note")}</h4>
              <Link style={{ fontSize: "16px" }} to={randomSlug}>
                {randomTitle}
              </Link>
              <br />
              <br />
            </section>
          )}
          <section>
            <h4>{t("nav.tags", "Tags")}</h4>
            <Tags />
            <br />
          </section>
          <section>
            <h4>{t("nav.institution", "Institution")}</h4>
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
