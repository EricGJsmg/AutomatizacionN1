class DXCListOrdersPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/outputs/list-orders').dxcValidateLocation({ relPath: '/outputs/list-orders', haveFilters: true });
  }

  selectAll(): Cypress.Chainable<any> {
    return cy.get('#pedidos-grid input').first().check().wait(500);
  }

  loadMore(): Cypress.Chainable<any> {
    return cy
      .get('body')
      .wait(2000) // necessary wait to reload body
      .then(($body) => {
        const $loadMoreBtn = $body.find('//button[span[text()="Load more"]]');

        if ($loadMoreBtn?.text().includes('Load more')) {
          cy.wrap($loadMoreBtn).click();
          return this.loadMore();
        } else return cy.then(() => null);
      });
  }

  selectAssignToWave(): Cypress.Chainable<any> {
    return cy.get('button').contains('Assign to wave').click().wait(1000); // necessary wait to dialog open
  }

  wizardNext2To3WW(): Cypress.Chainable<any> {
    return cy.get('select-pedidos-serie-step.ng-star-inserted .button-primary-fondo-blanco > .ng-star-inserted > span').closest('button').click();
  }

  wizardCreateAssignWaveWW(waveToAssign?: string): Cypress.Chainable<any> {
    if (waveToAssign) {
      // assign wave
      return cy
        .get('#selectWaveId')
        .type(waveToAssign, { delay: 50 })

        .wait(1000) // wait to close select

        .get('select-serie-step button[type="submit"]')
        .should('be.visible')
        .click(); // go next (3To4)
    } else {
      // create wave
      return cy
        .get('mat-radio-button')
        .contains('Create wave')
        .click()

        .get('empty-step button[type="submit"]')
        .click(); // go next (3To4)
    }
  }

  wizardAddNoteWW(note: string = ''): Cypress.Chainable<string> {
    if (note) cy.get('div.mat-form-field-infix > textarea').type(note, { delay: 10 });
    return cy.then(() => note);
  }

  wizardNext4To5WW(): Cypress.Chainable<any> {
    return cy.get('enter-comentario-step button[type="submit"]').click(); // assign to wave
  }

  getWaveInfoAndCloseWW(): Cypress.Chainable<any> {
    const create: any = {};

    return cy
      .get('#finishButton')
      .should('be.visible') // wait last page

      .getText('done-step > .alert, done-step h1 span')
      .then((message) => {
        create.message = message;
      })

      .getText('done-step > .alert, done-step alert-success')
      .then((message) => {
        create.id = message.split(' ').pop()?.trim();
      })

      .get('#finishButton')
      .should('be.visible')
      .click() // close wizard

      .then(() => create);
  }

  filterInsertOrders(orders: string[]): Cypress.Chainable<any> {
    return cy
      .get(':nth-child(2) > :nth-child(1) > filtro-lista  .mat-form-field-infix mat-select')
      .should('be.visible')
      .click()
      .wait(100)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .then(($selectOrder) => {
        return cy.wrap(orders).each((order: string) => {
          return cy
            .wrap($selectOrder)
            .as('selectOrder')
            .then(() => {
              return cy
                .get('@selectOrder')
                .type(order, { delay: 100 })
                .wait(500)
                .then(() => {
                  return cy.get('@selectOrder').clear().wait(200);
                });
            });
        });
      })

      .wait(500) // necessary to wait select

      .get('body')
      .type('{esc}', { delay: 100 }); // select collapse
  }

  filterEstadoOrder(estado: string): Cypress.Chainable<any> {
    return cy
      .get(':nth-child(1) > :nth-child(1) > filtro-lista .mat-form-field-infix mat-select')
      .should('be.visible')
      .click()
      .wait(100)
      .get('.mat-select-search-inner > .mat-select-search-input')
      .type(estado, { delay: 100 })
      .wait(500)
      .get('body')
      .type('{esc}', { delay: 100 });
  }

  setFilter(): Cypress.Chainable<any> {
    return cy

      .get('#FiltrosPedidos > div > div > div.widget-footer.text-left > button.button.button-default.button-primary-fondo-blanco')
      .should('be.visible')
      .click()

      .wait(2000); // wait necessary to get list
  }
}

export default DXCListOrdersPage;
