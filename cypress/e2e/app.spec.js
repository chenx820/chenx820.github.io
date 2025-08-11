/// <reference types="Cypress" />
function scrollLinks() {
  let routes = ["home", "about", "research", "patents"];
  cy.wrap(routes).each((route) => {
    cy.findByText(new RegExp(route, "i"), { selector: "a" })
      .click()
      .hash()
      .should("eq", "#" + route.replace(/\s/, "-"));
  });
}
describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should toggle darkmode", () => {
    cy.findByLabelText("toggle theme")
      .click()
      .should(() => {
        expect(localStorage.getItem("chenx820-theme")).to.eq("dark");
      })
      .click()
      .should(() => {
        expect(localStorage.getItem("chenx820-theme")).to.eq("light");
      });
  });

  it("should navigate to sections", () => {
    scrollLinks();
  });

  it("should navigate to sections in mobile", () => {
    cy.viewport("iphone-3");

    cy.get('button[class*="NavMobilestyle__FloatingButton-"]')
      .click({ force: true })
      .findByText(/home/i, { selector: "a" })
      .should("be.visible");

    scrollLinks();
  });

  it("should navigate to notes", () => {
    const editGithubUrl = `https://github.com/chenx820/chenx820.github.io/tree/main/content/notes/any-post/index.md`;
    cy.findByText(/notes/i, { selector: "a" })
      .click()
      .findByText(/Random note/i)
      .findByText(/Tags/i);

    cy.findByText(/Exciting New Features In Javascript/i, { selector: "h2" })
      .click()
      .findByText(/Exciting New Features In Javascript/i, { selector: "h1" })
      .findByText(/Share on/i)
      .findByText(/Edit post on GitHub/i, { selector: "a" })
      .should("have.attr", "href", editGithubUrl);
  });
});
