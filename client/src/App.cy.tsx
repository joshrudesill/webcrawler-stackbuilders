import App from "./App";

describe("<App />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<App />);
  });

  it("should display 30 crawl results after fetching", () => {
    cy.mount(<App />);

    cy.contains("Crawl Results", { timeout: 15000 }).should("be.visible");

    // Check that exactly 30 result items are displayed
    cy.get('[data-testid="crawl-row"]').should("have.length", 30);

    // Verify the count display shows 30
    cy.contains("Count: 30").should("be.visible");
  });

  it("should still contain 30 items with sort changed", () => {
    cy.mount(<App />);

    cy.contains("Crawl Results", { timeout: 15000 }).should("be.visible");

    cy.get('[data-testid="crawl-row"]').should("have.length", 30);

    cy.contains("Count: 30").should("be.visible");

    const sortOptions = ["Score", "# Comments", "# Words", "Rank"];

    sortOptions.forEach((sortOption) => {
      cy.get('[data-testid="sort-select"]').select(sortOption);
      cy.get('[data-testid="crawl-row"]').should("have.length", 30);
    });
  });

  it("should have 0 results with less than or = 0 words", () => {
    cy.mount(<App />);
    cy.contains("Crawl Results", { timeout: 15000 }).should("be.visible");

    cy.get('[data-testid="crawl-row"]').should("have.length", 30);

    cy.get('[data-testid="filter-select"]').select("lte");

    cy.get('[data-testid="word-count-input"]').clear();

    cy.get('[data-testid="crawl-row"]', { timeout: 15000 }).should(
      "have.length",
      0
    );
    cy.contains("Count: 0").should("be.visible");
  });

  it("should set filter to lte 0, have 0 results, then reset and have 30 results again", () => {
    cy.mount(<App />);

    cy.contains("Crawl Results", { timeout: 15000 }).should("be.visible");

    cy.get('[data-testid="crawl-row"]').should("have.length", 30);

    cy.get('[data-testid="filter-select"]').select("lte");

    cy.get('[data-testid="word-count-input"]').clear();

    cy.get('[data-testid="crawl-row"]', { timeout: 15000 }).should(
      "have.length",
      0
    );
    cy.contains("Count: 0").should("be.visible");

    cy.get('[data-testid="reset-button"]').click();

    cy.get('[data-testid="crawl-row"]', { timeout: 15000 }).should(
      "have.length",
      30
    );
    cy.contains("Count: 30").should("be.visible");
  });
});
