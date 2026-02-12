class DXCListShipmentsPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/shipment/list-shipments').dxcValidateLocation({ relPath: '/shipment/list-shipments' });
  }

  createShipment(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'createShipment' })
      .get('#ListaExpediciones > div > div > div:nth-child(3) > article > acciones-contextuales-button-group > div > div > div > ul > li > button:nth-child(1)')
      .should('be.visible')
      .click(); // create shipment
  }

  createShipmentTwo(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'createShipmentTwo' })
      .get('#ListaExpediciones > div > div > div:nth-child(3) > article > acciones-contextuales-button-group > div > div > div > button')
      .should('be.visible')
      .click(); // create shipment
  }

  insertTypeShipment(type: string = 'Hom'): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'insertTypeShipment' })
      .get('select-plantilla-tipo-expedicion-step > form > div:nth-child(2) > filtro-lista > span > mat-form-field')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div > input')
      .should('be.visible')
      .clear()
      .type(type, { delay: 100 })

      .get('select-plantilla-tipo-expedicion-step > form > div:nth-child(4) > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .click();
  }

  insertShipmentdata(volMax: string = '60000'): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'insertShipmentdata' })
      .get('edit-datos-expedicion-step > form > div:nth-child(3) > filtro-input-number > mat-form-field')
      .should('be.visible')
      .click()

      .type(volMax, { delay: 100 })

      .get('edit-datos-expedicion-step > form > div:nth-child(6) > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .should('be.visible')
      .click();
  }

  insertShipmentRoute(route: string = ''): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'insertShipmentRoute-' })
      .get('enter-edit-criterio-expedicion-formulario > div:nth-child(8) > filtro-lista > span > mat-form-field')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div > input')
      .should('be.visible')
      .type(route, { delay: 100 })

      .wait(2000)

      .get('.cdk-overlay-backdrop')
      .invoke('css', 'display', 'none')

      .bLog({ msg: 'despues de invoke(...)' })

      .get('create-criterios-expedicion-step > form > div > button.button.button-default.button-primary-fondo-blanco')
      .should('be.visible', { timeout: 10000 })
      .click();
  }

  truckLoadingData(): Cypress.Chainable<any> {
    return cy.bLog({ msg: 'truckLoadingData' }).get('edit-datos-carga-camion-step > form > div > button.button.button-default.button-primary-fondo-blanco.button-pull-right').click();
  }

  transportData(carrier: string = ''): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'transportData' })
      .get('edit-datos-transporte-step > form > div:nth-child(1) > filtro-input-text')
      .should('be.visible')
      .click()

      .type('-', { delay: 100 })

      .get('.cdk-overlay-backdrop')
      .invoke('css', 'display', 'none')

      .bLog({ msg: 'despues de invoke1(...)' })

      .get('edit-datos-transporte-step > form > div:nth-child(3) > filtro-lista')
      .should('be.visible')
      .type(carrier, { delay: 100 })

      .get('edit-datos-transporte-step > form > div > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .click();
  }

  additionalData(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'additionalData' })
      .get('enter-edit-campos-adicionales-step > form > div.row > render-campos-adicionales > div:nth-child(1) > div > filtro-input-text')
      .should('be.visible')
      .click()

      .type('-', { delay: 100 })

      .get('enter-edit-campos-adicionales-step > form > div.row > render-campos-adicionales > div:nth-child(4) > div > filtro-input-text')
      .should('be.visible')
      .click()

      .type('-', { delay: 100 });
  }

  createShipmentSubmit(): Cypress.Chainable<any> {
    let shipment: any = {};

    return cy
      .bLog({ msg: 'createShipmentSubmit' })
      .get('enter-edit-campos-adicionales-step > form > div > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .click()

      .wait(2000) // necessary to wait messages if exists
      .get('body')
      .then(($body) => {
        if ($body.find('#MsgBoxBack')) {
          const $msg = $body.find('#Msg1 > div > span');
          shipment.message = $msg.text().trim() || undefined;

          if ($msg && $msg.text().includes('There is already an open shipment with the same citeria')) {
            return cy.wrap($body.find('#bot2-Msg1')).click(); // press YES button
          }
        }
      })

      .getText(' done-step > div.text-center.alert')
      .then((message) => {
        shipment = message.split(' ').pop()?.trim();
        return shipment;
      })

      .then(() => this.wizardFinish())

      .then(() => shipment);
  }

  filterInsertShipment(shipment: string): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'filterInsertShipment' })
      .get('div:nth-child(13) > div > filtro-lista > span > mat-form-field > div > div.mat-form-field-flex mat-select')
      .should('be.visible')

      .type(shipment, { delay: 100 }) // shipment 4525

      .get('span > ngx-mat-select-search > div > input')

      .wait(500) // necessary to wait select

      .type('{esc}', { delay: 100 }) // collapse

      .wait(500) // necessary to wait select collapse

      .then(() => shipment);
  }

  filterSet(): Cypress.Chainable<any> {
    return cy.bLog({ msg: 'filterSet' }).get('button').contains('span', 'Set').parents('button').click(); // get list
  }

  assignContainerButton(): Cypress.Chainable<any> {
    return cy.bLog({ msg: 'assignContainerButton' }).get('div:nth-child(3) > article > acciones-contextuales-button-group > div > div:nth-child(2) > button').click(); // get list
  }

  assignShipmentToContainer(palet: string): Cypress.Chainable<any> {
    return cy // assign shipment to container
      .bLog({ msg: 'assignShipmentToContainer' })
      .get('select-palet-step > form mat-select') // assign shipment to container
      .should('be.visible')
      .type(palet, { delay: 100 })

      .get('.cdk-overlay-backdrop')
      .invoke('css', 'display', 'none')

      .bLog({ msg: 'despues de invoke(...)' })

      .get('select-palet-step > form > div:nth-child(4) > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .should('be.visible')
      .click()

      .get('#finishButton')
      .should('be.visible')
      .click();
  }

  actionButton(action: 'Create' | 'Complete' | 'Print' | 'Close'): Cypress.Chainable<any> {
    return cy.wait(2000).get('button').contains(action).click().wait(1000);
  }

  wizardFinish(): Cypress.Chainable<string> {
    let message: string = '';
    return cy
      .bLog({ msg: 'wizardFinish' })
      .getText('done-step > .alert, done-step h1 span')
      .then((msg) => (message = msg))

      .get('#finishButton')
      .click()

      .then(() => message);
  }

  printFinish(): Cypress.Chainable<string> {
    let message: string = '';
    return cy
      .bLog({ msg: 'printFinish' })
      .getText('done-step > .alert')
      .then((msg) => (message = msg))

      .get('#finishButton')
      .click()

      .then(() => message);
  }

  closeFinish(): Cypress.Chainable<string> {
    let message: string = '';
    return cy
      .bLog({ msg: 'closeFinish' })
      .getText('expedicion-done-step > .alert')
      .then((msg) => (message = msg))

      .get('#finishButton')
      .click()

      .then(() => message);
  }

  checkButtonPrint(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'checkButtonPrint' })
      .get('body')
      .then(($body) => {
        console.log('saber si el boton print es visible: ' + $body.find('acciones-contextuales-button-group > div > div:nth-child(3) > button').length);
        cy.get('#refreshButton').should('be.visible').click();
        if ($body.find('acciones-contextuales-button-group > div > div:nth-child(3) > button').length === 1) {
          this.actionButton('Print'); // Click on the Print button
        } else {
          // Si el botón no está presente, recarga la página y vuelve a verificar
          cy.get('#refreshButton').should('be.visible').click(); // Recarga la página
          cy.wait(6000); // Espera un poco antes de volver a verificar
          this.checkButtonPrint(); // Llama a la función de nuevo para reintentar
        }
      });
  }

  checkButtonPrintTienda(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'checkButtonPrint' })
      .get('body')
      .then(($body) => {
        console.log('saber si el boton print es visible: ' + $body.find('acciones-contextuales-button-group > div > div:nth-child(4) > button').length);
        cy.get('#refreshButton').should('be.visible').click();
        if ($body.find('acciones-contextuales-button-group > div > div:nth-child(4) > button').length === 1) {
          // Si el botón está presente, verifica que sea visible
          // cy.get('acciones-contextuales-button-group > div > div:nth-child(3) > button').should('be.visible').click();
          this.actionButton('Print'); // Click on the Print button
        } else {
          // Si el botón no está presente, recarga la página y vuelve a verificar
          cy.get('#refreshButton').should('be.visible').click(); // Recarga la página
          cy.wait(6000); // Espera un poco antes de volver a verificar
          this.checkButtonPrint(); // Llama a la función de nuevo para reintentar
        }
      });
  }

  getShipmentPrinter(): Cypress.Chainable<any> {
    let shipmentPrinterSummary: any;
    return cy
      .bLog({ msg: 'getShipmentPrinter' })
      .getText('edit-puesto-impresion-step > form > div > filtro-lista > span > mat-form-field > div > div > div > mat-select > div > div > span > span')
      .then((printer) => {
        shipmentPrinterSummary = printer;
        return shipmentPrinterSummary;
      });
  }

  completeFinish(): Cypress.Chainable<string> {
    let message: string = '';
    return cy
      .bLog({ msg: 'CompleteFinish' })
      .getText('expedicion-done-step > .alert-success')
      .then((msg) => (message = msg))

      .get('#finishButton')
      .click()

      .wait(6000) // necessary to wait messages if exists

      .then(() => message);
  }

  validateMessages(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'validateMessages' })
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
}

export default DXCListShipmentsPage;
