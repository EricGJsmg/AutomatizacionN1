class RFRelocateStockPage {
  insertOrigin(options: { warehouse: string; location: string }): Cypress.Chainable<any> {
    cy.get('#P32_DESC_ALM').type(options.warehouse);
    cy.get('#P32_UBI_ORIG').type(options.location);
    return cy.get('input[value="OK"]').click();
  }

  insertArticle(options: { article: string }): Cypress.Chainable<any> {
    cy.get('#P32_COD_ART_LEIDO').type(options.article, { delay: 100 });

    cy.get('body').click();
    cy.wait(5000);

    return cy.get('input[value="OK"]').click();
  }

  insertDestination(options: { warehouse: string; location: string }): Cypress.Chainable<any> {
    cy.get('#P32_ALMACEN_DES').type(options.warehouse);
    cy.get('#P32_UBICACION_DES').type(options.location);
    return cy.get('input[value="OK"]').click();
  }
}

export default RFRelocateStockPage;
