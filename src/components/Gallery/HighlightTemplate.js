import React from "react";
import PropTypes from "prop-types";

import {
  HighlightContent,
  HighlightDetail,
  HighlightWrapper,
} from "./HighlightTemplate.style";

const HighlightTemplate = ({ title, desc, preview }) => {
  return (
    <HighlightWrapper>
      <HighlightContent>
        <HighlightDetail>
          <div className="project__detail-container">
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>
        </HighlightDetail>

        {preview}
      </HighlightContent>
    </HighlightWrapper>
  );
};

HighlightTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  preview: PropTypes.node.isRequired,
};

export default HighlightTemplate;
