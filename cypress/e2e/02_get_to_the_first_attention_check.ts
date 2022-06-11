describe("Click through the forms until the first attention check at 15 is passed", () => {
  it("should register a user and fill out 15 forms", () => {
    cy.visit("https://c109-055.cloud.gwdg.de/");
    cy.setCookie(
      "dfg_session",
      "eyJ1c2VySWQiOiJjbDJzd3dmdm4wMDA2ZTd4NTk3dHMxdm9pIn0%3D.wUEg1lM%2FT%2FrB5FBJfFUSuh4QcRf3ylVKCw%2B0QuyGmP0"
    );
    cy.visit("https://c109-055.cloud.gwdg.de/survey/3");
    // cy.get("label").click({ multiple: true });
    // cy.get("button[type=submit]").click();
    cy.visit(
      "https://c109-055.cloud.gwdg.de/images/65ea1cfc-938c-4c5b-b986-3db344ecac89/qone"
    );

    for (let i = 0; i < 65; i++) {
      cy.wait(1000);
      cy.get("label").contains("nicht entscheidbar").click();
      cy.get("label").contains("1 - sehr unsicher").click();
      cy.get("button[type=submit]").click();
      cy.wait(1000);
      cy.get("[type=checkbox]").first().check();
      cy.get("[type=radio]").first().check();
      cy.get("button[type=submit]").click();
      cy.wait(1000);
    }
  });
});
