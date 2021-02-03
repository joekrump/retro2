describe("Participating in an active retro", () => {

  function loginAsSession(sessionId: string): Function {
    const previousSessionId = sessionStorage.getItem("retroSessionId");
    sessionStorage.setItem("retroSessionId", sessionId);
    return function logInAsPreviousSession() {
      sessionStorage.setItem("retroSessionId", previousSessionId);
    };
  }

  function moveCardToColumn (
    card: Cypress.Chainable<JQuery<HTMLElement>>,
    column: Cypress.Chainable<JQuery<HTMLElement>>) {
    const dataTransfer = new DataTransfer;

    card.trigger("dragstart", { force: true, dataTransfer }).wait(1000);;
    column.find(".card--list")
      .trigger("dragenter", { force: true, dataTransfer })
      .wait(2000)
      .trigger("drop", { force: true, dataTransfer });
  }

  before(() => {
    cy.visit("/");
    cy.wait(1000);
  });

  it("allows a card to added, edited, deleted, and have its column changed", () => {
    // Create
    cy.get(".column [data-cy=add-card-button]")
      .first()
      .click()

    cy.get("#columns > div:nth-child(1) [data-cy=card-contents-textarea]")
      .click()
      .type("**Bold content** _italic content_ ![doggo image](https://cdn2.thedogapi.com/images/rkZRggqVX_1280.jpg)");
    cy.get("[data-cy=save-card-button]")
      .click();

    cy.get(".column").first().get(".card--list > .card-container:last-child > .card--content")
      .should("contain.html", "<strong>Bold content</strong>")
      .and("contain.html", "<em>italic content</em>")
      .and("contain.html", "<img alt=\"doggo image\" src=\"https://cdn2.thedogapi.com/images/rkZRggqVX_1280.jpg\">");

    // Edit
    cy.get(".column").first().find(".card--list .card-container:last-child [data-cy=edit-card-button]").invoke("show")
      .click()
    cy.get("[data-cy=card-contents-textarea]")
      .click()
      .type("more TEXT!");

    cy.get("[data-cy=save-card-button]")
      .click();

    cy.get(".column").first().get(".card--list > .card-container:last-child > .card--content").should("contain", "more TEXT!")

    cy.get("[data-cy=save-card-button]").should("not.exist");

    // Test that anyone who is not the owner of the card cannot edit it.
    const dummySessionId = "111111";
    const undoPreviousSessionChange = loginAsSession(dummySessionId);
    cy.visit("/");
    cy.get(".column").first().get(".card--list .card-container:last-child [data-cy=edit-card-button]").should("not.exist");
    undoPreviousSessionChange();

    // Test that drag and drop works
    moveCardToColumn(
      cy.get(".column").first().get(".card--list .card-container:last-child"),
      cy.get(".column:nth-child(2)")
    );

    // Delete
    // cy.get(".column").first().get(".card--list .card-container:last-child [data-cy=edit-card-button]").invoke("show")
    //   .click()
    // cy.get(".column").first().get(".card--list .card-container:last-child [data-cy=delete-card-button]")
    //   .click()
    // cy.get(".column").first().get(".card--list .card-container").should("have.length", 0)
  });

  it("allows users to add and remove stars from cards", () => {
    // Star count on a card should not go less than 0.
    // Clicking on the star icon on a card adds 1 star

    // Clicking on the undo icon on a card removes 1 star that had been added by the user

    // A user cannot remove stars added by a different user.

    // Star pool for a user (remaining number of stars) should start at 10.
    // Star pool for a user should not go below 0.
  });

  it("columns can be added and edited", () => {
    // FIXME: add tests
  });

  it("allows the title of the retro to be updated", () => {
    // FIXME: add tests
  });
});
