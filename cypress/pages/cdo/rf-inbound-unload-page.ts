class RFInboundUnloadPage {
  insertEntrada(entrada: string): Cypress.Chainable<any> {
    return cy
      .get('#P34_ENTRADA')
      .type(entrada)

      .get('#34_BT_VALIDA_ENTRADA')
      .click();
  }

  insertContainer(container: string): Cypress.Chainable<any> {
    return cy
      .get('#34_LECTURA_PALET')
      .type(container)

      .get('#lectura')
      .click();
  }

  unload(): Cypress.Chainable<any> {
    return cy.get('#ACCION_PALET_DESCARGAR').click();
  }

  confirm(): Cypress.Chainable<any> {
    return cy.get('#lectura').click();
  }

  exit(): Cypress.Chainable<any> {
    return cy.get('#EXIT').should('be.visible').click();
  }
}

export default RFInboundUnloadPage;
