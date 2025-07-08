import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import styled from "styled-components";

import { CardText } from "@common/Card";
import Button, { IconButton } from "@common/Button";
import { ResearchLinks } from "../Research/ResearchTemplate.style";

const PatentCardWrapper = styled.div`
  position: relative;

  background-color: ${(props) => props.theme.secondaryColor};
  border-radius: 10px;
  padding: 30px;
  height: 280px;

  .patent__links {
    position: absolute;
    bottom: 20px;
  }
`;

const PatentCard = ({
  id,
  title,
  number,
  status,
  date,
  inventor,
  links,
  description,
}) => {
  const { t } = useTranslation();

  return (
    <PatentCardWrapper key={id}>
      <h4>{title}</h4>
      <CardText>
        {number} | {status} {date}
      </CardText>
      <CardText>
        {t("patents.inventors")}: {inventor}
      </CardText>
      <ResearchLinks className="patent__links">
        <Button target="__blank" as="a" href={links.src}>
          {t("patents.see-patent")}
        </Button>
        <IconButton
          label="file"
          icon={["fas", "file-pdf"]}
          href={links.file}
          target="__blank"
        />
      </ResearchLinks>
    </PatentCardWrapper>
  );
};

export default PatentCard;
