import React from "react";
import PropTypes from "prop-types";

import Link from "gatsby-link";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TagBreadcrumb } from "./NotesTags";
import slugify from "@components/slugify";

const PostWrapper = styled.article`
  overflow: auto;
  margin-bottom: 70px;
  /* margin-top: 100px; */
  padding: 30px 30px;
  border-top: 5px solid ${(p) => p.theme.primaryColor};
  border-radius: 10px;
  box-shadow: ${(p) => p.theme.shadowSmall};
  background-color: ${(p) => p.theme.secondaryColor};

  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  span {
    font-size: 13px;
    color: gray;
  }
`;

export const NoteDateAndReadTime = ({ date, university }) => (
  <span style={{ fontSize: 13, color: "gray" }}>
    <span aria-label={`publish date ${date}`}>
      <FontAwesomeIcon color="gray" icon="calendar-alt" />
      &nbsp;&nbsp;{date}
    </span>
    &nbsp;&nbsp;&nbsp;
    <span aria-label={`${university}`}>
      <FontAwesomeIcon color="gray" icon={["fas", "university"]} />
      &nbsp;&nbsp;{university}
    </span>
  </span>
);

const NoteCard = ({ date, university, title, excerpt, slug, notetags }) => {
  return (
    <Link to={slug} aria-label={`${title} - ${university}`}>
      <PostWrapper>
        <NoteDateAndReadTime date={date} university={university} />

        <h2>{title}</h2>
        <p>{excerpt}</p>

        <div style={{ marginTop: 20 }}>
          {notetags.map((tag) => (
            <TagBreadcrumb
              key={tag}
              aria-label={`${tag} tag`}
              to={`/notes/tags/${slugify(tag)}/`}
            >
              {tag}
            </TagBreadcrumb>
          ))}
        </div>
      </PostWrapper>
    </Link>
  );
};

NoteDateAndReadTime.propTypes = {
  date: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
};

NoteCard.propTypes = {
  date: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  notetags: PropTypes.array.isRequired,
};
export default NoteCard;
