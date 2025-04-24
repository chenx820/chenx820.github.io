import React from "react";
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
      slug: "/case-studies/project",
    },
    frontmatter: {
      title: "Research Title",
      description: "Research description",
      demo: "https://demo.com",
      src: "https://github.com",
      iframe: "https://codepen.io",
    },
  };
  let { getByText, getByTitle, debug } = render(
    <ThemeProvider theme={themelight}>
      <ResearchTemplate
        key={0}
        title={node.frontmatter.title}
        desc={node.frontmatter.description}
        links={
          <ResearchLinks>
            <Button as={"a"} to={node.fields.slug}>
              Read More
            </Button>
            {/* <Button target="__blank" as="a" href={node.frontmatter.demo}>
              Live Demo
            </Button>
            <IconButton
              label="github"
              icon={['fab', 'github']}
              href={node.frontmatter.src}
            /> */}
          </ResearchLinks>
        }
        preview={
          <ResearchPreview>
            <IFrame
              livedemo={!!node.frontmatter.iframe.match("codepen")}
              src={node.frontmatter.iframe}
            />
            <Tags>
              <FontAwesomeIcon icon={["fab", "js"]} />
              <FontAwesomeIcon icon={["fab", "html5"]} />
              <FontAwesomeIcon icon={["fab", "css3"]} />
            </Tags>
          </ResearchPreview>
        }
      />
    </ThemeProvider>
  );
  mockAllIsIntersecting(true);

  // debug();

  expect(getByText(/case study/i)).toHaveAttribute(
    "to",
    "/case-studies/project"
  );
  expect(getByText(/live demo/i)).toHaveAttribute("href", "https://demo.com");
  expect(getByTitle(/^github$/i)).toHaveAttribute("href", "https://github.com");

  const iframe = getByTitle("https://codepen.io");
  expect(iframe).toHaveAttribute("src", "https://codepen.io");
  expect(iframe).toBeInTheDocument();
});
