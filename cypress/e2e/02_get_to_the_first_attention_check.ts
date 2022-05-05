describe("Click through the forms until the first attention check at 15 is passed", () => {
  it("should register a user and fill out 15 forms", () => {
    cy.visit("http://localhost:3000/");
    cy.setCookie(
      "dfg_session",
      "eyJ1c2VySWQiOiJjbDJzd25wMmQxMjI5MzZrbHNoMDVmZG9mc3oifQ%3D%3D.5Qr2DcTl4xKpKpklqw8A4jhijoWsuvZnxxmGikt8YPk"
    );
    cy.visit("http://localhost:3000/survey/3");
    // cy.get("label").click({ multiple: true });
    // cy.get("button[type=submit]").click();
    cy.visit(
      "http://localhost:3000/images/65ea1cfc-938c-4c5b-b986-3db344ecac89/qone"
    );

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

      cy.get("label").contains("nicht entscheidbar").click();
      cy.get("label").contains("1 - sehr unsicher").click();
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
