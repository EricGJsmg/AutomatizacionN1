class DXCPackingPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/stock/container-actions/pack-content').dxcValidateLocation({ relPath: '/stock/container-actions/pack-content' });
  }

  insertPickingContainer(container: string): Cypress.Chainable<any> {
    return cy
      .get('#inputContainerId')
      .clear()
      .wait(500)
      .type(container, { delay: 100 }) // insert picking container

      .get('enter-palet-encajado-step > form button[type="submit"]')
      .click();
  }

  validateMessages(): Cypress.Chainable<any> {
    return cy
      .wait(1000) // necessary to wait for messages or errors

      .get('.textoFoto > :nth-child(1) > .text-danger > strong') // error messages
      .should('not.exist')

      .wait(2000) // necessary wait to load msg (This node is currently working with pallet...)
      .get('body')
      .then(($body) => {
        const $msgButton = $body.find('#bot2-Msg1');
        if ($msgButton?.length === 1) {
          cy.wrap($msgButton).click();
        }
      });
  }

  scanItem(item: string): Cypress.Chainable<string> {
    // Step 5 - Pack items
    return cy
      .get('articulos-encajado-step filtro-input-text > mat-form-field div > #inputItemId')
      .clear()

      .wait(500) // necessary to wait input

      .type(item + '{enter}', { delay: 100 })

      .then(() => item);
  }

  getOperationSummary(): Cypress.Chainable<any> {
    // Step 6 - Finish packing
    const operationSummary: any = {};

    return cy
      .get('h3.ng-star-inserted')
      .contains('Close box')
      .should('be.visible')

      .getText('#strongEncajadoOrderId')
      .then((orderId) => (operationSummary.orderId = orderId))

      .getText('#strongEncajadoDestinationWarehouseId')
      .then((warehouse) => (operationSummary.warehouse = warehouse))

      .getText('#strongEncajadoDestinationPositionId')
      .then((position) => (operationSummary.position = position))

      .getText('#strongEncajadoTotalWeightId')
      .then((totalWeigh) => (operationSummary.totalWeight = totalWeigh))

      .getText('#strongEncajadoTotalVolumeId')
      .then((totalVolume) => (operationSummary.totalVolume = totalVolume))

      .getText('#strongEncajadoTotalUnitsId')
      .then((totalUnits) => (operationSummary.totalUnits = totalUnits))

      .then(() => operationSummary);
  }

  insertContainerType(type: string = 'WWW10018'): Cypress.Chainable<string> {
    // Step 6 - Finish packing
    return cy
      .get('finalizar-encajado-step #inputContainerTypeId')
      .clear()

      .type(type + '{enter}', { delay: 100 })

      .then(() => type);
  }

  getPackingContainer(): Cypress.Chainable<string> {
    // Step 6 - Close box
    return cy.get('#inputContainerIdId').invoke('val');
  }

  finishPacking(): Cypress.Chainable<string> {
    let message: string = '';

    return cy
      .get('#finishButton', { timeout: 120000 }) // if not have valid labels on the scanned material, it could be slow
      .should('be.visible') // Wait for the button to be visible

      .getText('done-step > .alert, done-step h1 span div')
      .then((result) => {
        message = result.trim();
      })

      .get('#finishButton')
      .click()

      .then(() => message);
  }
}

export default DXCPackingPage;
