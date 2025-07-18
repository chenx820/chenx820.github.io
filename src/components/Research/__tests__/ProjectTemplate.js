import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { ThemeProvider } from "styled-components";
import { themelight } from "@src/components/Layout/theme";

import IFrame from "@src/components/common/IFrame";
import ResearchTemplate from "../ResearchTemplate";
import Button, { IconButton } from "@src/components/common/Button";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import {
  ResearchLinks,
  ResearchPreview,
  Tags,
} from "@src/components/Research/ResearchTemplate.style";

afterEach(cleanup);

test("should have title and description", () => {
  let { getByText, debug } = render(
    <ThemeProvider theme={themelight}>
      <ResearchTemplate
        key={0}
        title={"Research Title"}
        desc={"Research description"}
        links={null}
        preview={null}
      />
    </ThemeProvider>
  );

  expect(getByText(/Research Title/i)).toHaveTextContent("Research Title");
  expect(getByText(/Research description/i)).toHaveTextContent(
    "Research description"
  );
});

test("should have links and preview", () => {
  const node = {
    fields: {
      slug: "/research/project",
    },
    frontmatter: {
      title: "Research Title",
      description: "Research description",
      iframe: "https://whatever-link.com",
    },
  };
  const { t } = useTranslation();
  let { getByText, getByTitle, debug } = render(
    <ThemeProvider theme={themelight}>
      <ResearchTemplate
        key={0}
        title={node.frontmatter.title}
        desc={node.frontmatter.description}
        links={
          <ResearchLinks>
            <Button as={"a"} to={node.fields.slug}>
              {t("research.read-more")}
            </Button>
          </ResearchLinks>
        }
        preview={
          <ResearchPreview>
            <IFrame src={node.frontmatter.iframe} />
          </ResearchPreview>
        }
      />
    </ThemeProvider>
  );
  mockAllIsIntersecting(true);

  // debug();

  expect(getByText(/read more/i)).toHaveAttribute("to", "/research/project");
  expect(getByTitle(/^github$/i)).toHaveAttribute("href", "https://github.com");

  const iframe = getByRole("document");
  expect(iframe).toBeInTheDocument();
});



