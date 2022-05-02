describe("Click through the forms until the first attention check at 15 is passed", () => {
  it("should register a user and fill out 15 forms", () => {
    cy.visit("http://localhost:3000/");
    cy.setCookie(
      "dfg_session",
      "eyJ1c2VySWQiOiJjbDJwNXQ3a3AwMjYxaXJzaHBuZjEzY3I1In0%3D.CYem4nZJvWtwMaBnAOhnWqQR7FLCJyey52ad6g0NPZ4"
    );
    cy.visit("http://localhost:3000/survey/3");
    cy.get("[type=radio]").check("0");
    cy.get("button[type=submit]").click();

    for (let i = 0; i < 65; i++) {
      cy.wait(500);

      //   if (i == 16 || i == 30 || i == 45) {
      //     cy.url().should("include", "att");
      //     cy.get("[name=questionOne]").click();
      //     cy.get("[name=confidenceOne]").click();
      //     cy.get("button[type=submit]").click();
      //     cy.wait(250);
      //     continue;
      //   } else {
      //     cy.url().should("include", "qone");
      //   }

      cy.get("[type=radio]").click({ multiple: true });
      cy.get("button[type=submit]").click();
      cy.wait(250);
      //   cy.url().should("include", "qtwo");
      cy.get("[type=checkbox]").first().check();
      cy.get("[type=radio]").first().check();
      cy.get("button[type=submit]").click();
      cy.wait(500);
    }
  });
});
