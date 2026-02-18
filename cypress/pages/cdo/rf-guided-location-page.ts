class RFGuidedLocationPage {
  insertContainer(container: string): Cypress.Chainable<any> {
    return cy
      .get('#LEC_MATRICULA')
      .type(container)

      .get('#CONFIRMA_LECTURA')
      .click()

      .wait(2000) // necessary wait to reload body
      .get('body')
      .then(($body) => {
        const errMsg: string = $body.find('font[color="white"]')?.text().trim();
        expect(errMsg, 'No deberian haber mensajes de error.').to.be.empty;
      });
  }

  insertArticle(article: string, quantity?: string): Cypress.Chainable<any> {
    cy.get('#LEC_ARTICULO').type(article);
    if (quantity) cy.get('#LEC_CANTIDAD').type(quantity);
    return cy.get('input[value="OK"]').click();
  }

  confirmDestination(): Cypress.Chainable<string> {
    return cy.getText('#CONFIRMACION_UBI_MOSTRAR_DISPLAY').then((destination) => {
      return cy
        .get('#CONFIRMACION_UBI_CAPTURAR')
        .type(destination, { delay: 10 })
        .then(() => {
          return cy.get('#RFUBICA_CONFIRMAR').click();
        })
        .then(() => cy.wrap(destination));
    });
  }

  deleteBox(): Cypress.Chainable<any> {
    return cy
      .wait(500)
      .get('body')
      .then(($body) => {
        const $closeBoxBtn = $body.find('#FIN_CAJA');
        if ($closeBoxBtn.length) {
          cy.get('#FIN_CAJA').click();
          return cy.get('#CONF_FIN_CAJA_SI').click();
        }
      });
  }

  exit(): Cypress.Chainable<any> {
    return cy.get('#EXIT').should('be.visible').click();
  }
}

export default RFGuidedLocationPage;
