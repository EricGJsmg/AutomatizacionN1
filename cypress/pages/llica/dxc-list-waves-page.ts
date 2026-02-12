class DXCListWavesPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/outputs/list-waves').dxcValidateLocation({ relPath: '/outputs/list-waves', haveFilters: true });
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.get('button').contains('span', 'Set').parents('button').click().wait(500);
  }

  selectLaunchWave(): Cypress.Chainable<any> {
    return cy.get('button').contains('Launch').click().wait(1000); // wait necessary to wait the dialog
  }

  filterInsertWave(waveId: string): Cypress.Chainable<any> {
    return cy
      .get(':nth-child(2) > :nth-child(1) > filtro-lista > .mat-error-warning > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
      .should('be.visible')
      .click() // open Wave filter
      .wait(500)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .type(waveId, { delay: 100 })

      .wait(1000)
      .type('{esc}');
  }

  selectLaunchingTypeAndLaunch(type: string): Cypress.Chainable<any> {
    // possibles values --> type: SINGLE|MULTI|BATCH
    const launch: any = {};
    return (
      cy
        .get('body')
        .type(' ', { delay: 100 }) // open select

        .wait(500) // necessary to wait select

        .type(type, { delay: 100 }) // type to show mat-option

        .get('span > span.DescLarga.ng-star-inserted')
        .then(($matOptiondetails) => $matOptiondetails.remove()) // only show the launching ids

        .get('mat-option')
        .contains('b', type)
        .click() // select Launching type

        .get('select-tipo-lanzamiento-step .button-pull-right')
        .click() // next

        // paso solo para Lliça
        .get('display-rotura-stock-serie-step > div.col-xs-12 > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
        .click({ timeout: 120000 }) // Launch

        .getText('done-step > .alert, done-step h1 span')
        .then((message) => {
          launch.message = message;
          launch.type = type;
        })

        .get('#finishButton')
        .should('be.visible')
        .click()

        .then(() => launch)
    );
  }
}

export default DXCListWavesPage;
