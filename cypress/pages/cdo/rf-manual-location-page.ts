class RFManualLocationPage {
  insertContainer(container: string): Cypress.Chainable<any> {
    return cy
      .get('#P32_MATRICULA')
      .type(container)

      .getControl('input[value="OK"], #P32_OK')
      .click();
  }

  insertArticle(article: string, quantity?: string): Cypress.Chainable<any> {
    cy.get('#P32_COD_ART_LEIDO').type(article, { delay: 100 });

    cy.get('body').click();
    cy.wait(5000);

    if (quantity) cy.get('#P32_CANTIDAD').type(quantity);
    return cy.get('input[value="OK"]').click();
  }

  confirmDestination(position: string, warehouse: string): Cypress.Chainable<any> {
    cy.get('#P32_UBICACION_DES').type(position, { delay: 10 });
    cy.get('#P32_ALMACEN_DES').type(warehouse, { delay: 10 });
    return cy.getControl('input[value="OK"], #P32_OK_DETERMINAR_DES').click();
  }
}

export default RFManualLocationPage;
