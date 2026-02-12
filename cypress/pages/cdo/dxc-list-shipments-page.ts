class DXCListShipmentsPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/shipment/list-shipments').dxcValidateLocation({ relPath: '/shipment/list-shipments' });
  }

  createShipmentConfirmType(): Cypress.Chainable<any> {
    return cy.get('#buttonTipoExpedicionNextId').click();
  }

  createShipmentConfirmPrintingWorkstation(printer: string): Cypress.Chainable<string> {
    return cy
      .wait(1000)

      .get('#selectPrintingWorkstationId')
      .should('be.visible')
      .and('not.be.disabled')
      .type(printer.concat('{esc}'), { delay: 50 })
      .wait(1000) // necessary to wait select

      .get('#buttonEditExpeditionNextId')
      .click()

      .then(() => printer);
  }

  createShipmentConfirmRoute(shipmentRoute: string): Cypress.Chainable<string> {
    return cy
      .get('enter-edit-criterios-asignacion-step filtro-lista #selectShipmentRouteId')
      .should('be.visible')
      .and('not.be.disabled')
      .focus()
      .wait(500) // necessary for focus
      .type(shipmentRoute.replace('_', ''))
      .wait(1000) // necessary to wait select

      .then(() => shipmentRoute);
  }

  createShipmentConfirmAssignmentCriteria(): Cypress.Chainable<any> {
    return cy.get('#buttonAssignationCriteriaNextId').click();
  }

  createShipmentConfirmTruckLoadingData(): Cypress.Chainable<any> {
    return cy.get('#buttonCargaCamionNextId').click();
  }

  createShipmentSubmit(): Cypress.Chainable<any> {
    const create: any = {};

    return cy
      .get('#buttonTransportCreateId')
      .click()

      .wait(2000) // necessary to wait messages if exists
      .get('body')
      .then(($body) => {
        if ($body.find('#MsgBoxBack')) {
          const $msg = $body.find('#Msg1 > div > span');
          create.warningMessage = $msg?.text().trim() || undefined;

          if ($msg && $msg?.text().includes('There is already an open shipment with the same citeria')) {
            return cy.wrap($body.find('#bot2-Msg1')).click(); // press YES button
          }
        }
      })
      .getText('done-step > .alert')
      .then((message) => {
        create.message = message;
        create.id = message.split(' ').pop()?.trim();
        console.warn({ create });
        return create;
      })
      .then(() => this.wizardFinish())

      .then(() => create);
  }

  filterInsertShipment(shipment: string): Cypress.Chainable<string> {
    return cy
      .get('#selectShipmentId')
      .click() // open shipment filter

      .get('#selectSearchShipmentId  > div > input')
      .type(shipment, { delay: 100 })

      .wait(500) // necessary to wait select

      .type('{esc}', { delay: 100 }) // collapse

      .wait(500) // necessary to wait select collapse

      .then(() => shipment);
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.get('button').contains('span', 'Set').parents('button').click(); // get list
  }

  wizardSubmitButton(task?: 'Print'): Cypress.Chainable<any> {
    if (task === 'Print') return cy.get('edit-puesto-impresion-step button[type="submit"]').click();
    else return cy.get('mat-horizontal-stepper button[type="submit"]').click();
  }

  actionButton(action: 'Create' | 'Complete' | 'Print' | 'Close'): Cypress.Chainable<any> {
    return cy.get('button').contains(action).click().wait(1000);
  }

  wizardFinish(): Cypress.Chainable<any> {
    return cy.get('#finishButton').click();
  }
}

export default DXCListShipmentsPage;
