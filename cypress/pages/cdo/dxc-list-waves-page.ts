class DXCListWavesPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/outputs/list-waves').dxcValidateLocation({ relPath: '/outputs/list-waves', haveFilters: true });
  }

  filterInsertWave(waveId: string): Cypress.Chainable<any> {
    return cy
      .get('#selectWaveId')
      .should('be.visible')
      .click() // open Wave filter
      .wait(500)

      .get('#selectWaveId-panel .mat-select-search-inner > .mat-select-search-input')
      .type(waveId, { delay: 100 })

      .wait(1000)
      .type('{esc}');
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.get('button').contains('span', 'Set').parents('button').click().wait(500);
  }

  selectLaunchWave(): Cypress.Chainable<any> {
    return cy.get('button').contains('Launch').click().wait(1000); // wait necessary to wait the dialog
  }

  selectLaunchingTypeAndLaunch(type: 'SINGLE' | 'MULTI' | 'BATCH'): Cypress.Chainable<any> {
    return cy
      .get('body')
      .type(' ', { delay: 100 }) // open select

      .wait(500)
      .type(type, { delay: 100 }) // type to show mat-options

      .then(() => this.selectType(type))

      .get('select-tipo-lanzamiento-step .button-pull-right')
      .click() // next

      .get('#finishButton')
      .click();
  }

  /** select Launching type */
  selectType(type: 'SINGLE' | 'MULTI' | 'BATCH'): Cypress.Chainable<any> {
    switch (type) {
      case 'SINGLE':
        return cy.get('#optionLaunchingTypeSingleId').click();

      case 'MULTI':
        return cy.get('#optionLaunchingTypeMultiId').click();

      case 'BATCH':
        return cy.get('#optionLaunchingTypeBatchId').click();
    }
  }
}

export default DXCListWavesPage;
