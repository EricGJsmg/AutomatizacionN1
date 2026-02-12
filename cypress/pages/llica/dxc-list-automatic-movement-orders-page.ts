class DXCListAutomaticMovementOrdersPage {
  visit(): Cypress.Chainable<any> {
    console.log('Visiting DXC List Automatic Movement Orders Page');
    return cy.visit('/#/picking/list-automatic-movement-orders').dxcValidateLocation({ relPath: '/picking/list-automatic-movement-orders' });
  }

  filterInsertOrderMvAut(orderMvAut: string): Cypress.Chainable<any> {
    console.log('Filtering by Order Movement Auto: ' + orderMvAut);
    return cy
      .get(':nth-child(12) > :nth-child(1)  filtro-lista .mat-form-field-infix mat-select')
      .should('be.visible')
      .click() // open Wave filter
      .wait(500)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .type(orderMvAut, { delay: 100 })

      .wait(1000)
      .type('{esc}');
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.get('button').contains('span', 'Set').parents('button').click().wait(500);
  }

  pressRefreshButton(): Cypress.Chainable<any> {
    return cy.get('#refreshButton').click().wait(500);
  }

  insertContainer(container: string): Cypress.Chainable<any> {
    return cy.get('#quickFilterInput').type(container, { delay: 100 }).wait(500); // necessary wait to detect only one row
  }

  selectContainer(): Cypress.Chainable<any> {
    return cy.get('.ag-cell-range-left > .ag-cell-wrapper').click(); // clic on row
  }

  pressConfirmOpenWizard(): Cypress.Chainable<any> {
    return cy
      .getButton(' Confirm ') // open wizard
      .should('be.visible')
      .click();
  }
  confirm(): Cypress.Chainable<string> {
    return cy
      .get('button')
      .contains('span', 'Confirm')
      .parents('button') // confirm
      .click()
      .wait(500)
      .getText('done-step > .alert, done-step alert-success')
      .then((message) => {
        console.log('Resultado: ' + message);
        return message; // Asegúrate de devolver el mensaje aquí
      })
      .then((message) => {
        return cy
          .get('#finishButton')
          .should('exist')
          .should('be.visible') // to wait the last page
          .click()
          .wait(12000)
          .then(() => message); // Devuelve el mensaje al final
      });
  }

  ensureFiltersVisible(): Cypress.Chainable<any> {
    return cy.get('#silo-filtro-lista-button').then(($button) => {
      if ($button.find('span').text().includes('Show filters')) {
        cy.wrap($button).click();
      }
    });
  }

  pressFinish(): Cypress.Chainable<any> {
    return cy.get('#finishButton');
  }
}

export default DXCListAutomaticMovementOrdersPage;
