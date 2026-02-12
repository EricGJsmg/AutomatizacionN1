class DXCListOutputsLinesPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/outputs/list-output-lines').dxcValidateLocation({ relPath: '/outputs/list-output-lines', haveFilters: true });
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.get('button').contains('span', 'Set').parents('button').click().wait(500);
  }

  selectOutputLines(): Cypress.Chainable<any> {
    return cy.get('div > span:nth-child(1)').contains('Output lines').click().wait(1000); // wait necessary to wait the dialog
  }

  confirmShortage(): Cypress.Chainable<any> {
    console.log('confirmShortage');
    return cy.get('button').contains('Confirm shortage').click();
  }

  finishButton(): Cypress.Chainable<any> {
    console.log('finishButton');
    return cy.get('button').contains('Finish').click();
  }

  finishFalta(): Cypress.Chainable<string> {
    let message: string = '';

    return cy
      .get('#finishButton', { timeout: 120000 }) // if not have valid labels on the scanned material, it could be slow
      .should('be.visible') // Wait for the button to be visible

      .getText('done-step > .alert, done-step h1 span div')
      .then((result) => {
        message = result.trim();
      }) // error if any message is displayed, should just be OK

      .get('#finishButton')
      .should('be.visible')
      .click()

      .then(() => message);
  }

  filterInsertOutput(salida: string): Cypress.Chainable<any> {
    return cy
      .get('div > div > div.row > div:nth-child(3) > div > filtro-lista')
      .should('be.visible')
      .click() // open Wave filter
      .wait(500)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .type(salida, { delay: 100 })

      .wait(1000)
      .type('{esc}');
  }

  filterInsertOutputStatus(status: string): Cypress.Chainable<any> {
    return cy

      .get('div > div > div.row > div:nth-child(2) > div > filtro-lista')
      .should('be.visible')
      .click() // open Wave filter
      .wait(500)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .type(status, { delay: 100 })

      .wait(1000)
      .type('{esc}');
  }

  selectAll(): Cypress.Chainable<any> {
    return cy.bLog({ msg: 'selectAll' }).get('#detalles-salida-grid input').first().check().wait(500);
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

export default DXCListOutputsLinesPage;
