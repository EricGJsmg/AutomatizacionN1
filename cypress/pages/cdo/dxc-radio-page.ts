class DXCRadioPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/picking/list-radios').dxcValidateLocation({ relPath: '/picking/list-radios' });
  }

  refresh(): Cypress.Chainable<any> {
    return cy.get('#ListaRadios > div > div > div.alert.alert-info.ng-star-inserted > span > a').click(); // press on click here
  }

  loadMore(): Cypress.Chainable<any> {
    return cy
      .get('body')
      .wait(2000) // necessary wait to reload body
      .then(($body) => {
        const $loadMoreBtn = $body.find('#ListaRadios > div > div > div.contenedor-grid.ng-star-inserted > radios-grid > div:nth-child(3) > button');

        if ($loadMoreBtn.text().includes('Load more')) {
          cy.wrap($loadMoreBtn).click();
          return this.loadMore();
        } else return cy.wrap(null);
      });
  }

  searchByTerm(term: string = Cypress.env('username')): Cypress.Chainable<any> {
    return cy.get('#quickFilterInput').type(term, { delay: 100 });
  }

  // clic and return chainable true if radio found
  selectAllRadios(): Cypress.Chainable<boolean> {
    return cy
      .get('.ag-checkbox-input')
      .first()
      .click() // select all radios

      .getText('#ListaRadios > div > div > div.contenedor-grid.ng-star-inserted > radios-grid > div.ng-star-inserted > span')
      .then((rowsSelected) => parseInt(rowsSelected.trim(), 10) > 0); // count selected radios
  }

  disconnect(): Cypress.Chainable<any> {
    return cy
      .get('button')
      .contains('Disconnect')
      .click() // open disconnection wizard

      .get("button[data-cy='wizard-button']")
      .click() // disconnect radio

      .get('#finishButton')
      .should('be.visible')
      .click(); // close wizzard
  }
}

export default DXCRadioPage;
