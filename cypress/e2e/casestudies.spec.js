describe("Should check Case Studies it's and subpages", () => {
  const PROJECT_NAME = /Verly Range Slider/i;
  const URL = "case-studies/verly-range-slider";
  const LIVE_DEMO_URL = "//chenx820.github.io/VerlyRangeSlider";
  const GITHUB_URL = "//github.com/chenx820/VerlyRangeSlider";

  beforeEach(() => {
    cy.visit("/");
  });

  function assertProjectLinks() {
    cy.findByText(/Live Demo/i, { selector: "a" })
      .should("have.attr", "href", LIVE_DEMO_URL)
      .findByLabelText("github")
      .should("have.attr", "href", GITHUB_URL);
  }

  it("should navigate to note", () => {
    cy.findByText(PROJECT_NAME, { selector: "h2" })
      .parent()
      .parent()
      .parent() // parent of projects
      .within(() => {
        cy.get("iframe").should("exist");
        assertProjectLinks();
        cy.findByText(/Case Study/i, { selector: "a" }).click();
      })
      .url()
      .should("contain", URL)
      .findByText(PROJECT_NAME, { selector: "h1" })
      .get("iframe")
      .should("exist");

    // asset project links on individual case study page
    assertProjectLinks();
  });
});
