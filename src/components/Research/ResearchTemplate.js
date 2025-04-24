import React from "react";
import PropTypes from "prop-types";

import {
  ResearchContent,
  ResearchDetail,
  ResearchWrapper,
} from "./ResearchTemplate.style";

const ResearchTemplate = ({ title, desc, links, preview }) => {
  return (
    <ResearchWrapper>
      <ResearchContent>
        <ResearchDetail>
          <div className="project__detail-container">
            <h2>{title}</h2>
            <p>{desc}</p>
            {links}
          </div>
        </ResearchDetail>

        {preview}
      </ResearchContent>
    </ResearchWrapper>
  );
};

ResearchTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  links: PropTypes.node.isRequired,
  preview: PropTypes.node.isRequired,
};

export default ResearchTemplate;
