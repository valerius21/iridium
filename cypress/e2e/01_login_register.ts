describe("Register a user from home and go to survey", () => {
  const registerMale = () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Ticket nicht gefunden");
    cy.visit("http://localhost:3000/?tic=foxtrott");
    cy.get("#start").click();
    cy.contains("Registrieren");
    cy.get("select").select("18-24");
    cy.get("#gender-m").check();
    cy.get('[type="checkbox"]').check();

    // register
    cy.get("button").contains("Weiter").click();
    cy.url().should("include", "/survey/1");
  };
  it("should route over /register to /survey/1", async () => {
    registerMale();
  });

  it("should register 5 more users", () => {
    for (let index = 0; index < 6; index++) {
      registerMale();
    }
  });

  it("should fail to register more than 6 males between 18-24", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Ticket nicht gefunden");
    cy.visit("http://localhost:3000/?tic=foxtrott");
    cy.get("#start").click();
    cy.contains("Registrieren");
    cy.get("select").select("18-24");
    cy.get("#gender-m").check();
    cy.get('[type="checkbox"]').check();

    // register
    cy.get("button").contains("Weiter").click();
  });
});
