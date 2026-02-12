class RFConsolidationPage {
  insertWarehouse(warehouse: string): Cypress.Chainable<string> {
    return cy
      .get('#P18_ALM_DESC_CORTA')
      .clear()
      .type(warehouse, { delay: 100 })
      .then(() => warehouse);
  }

  insertStation(station: string): Cypress.Chainable<string> {
    return cy
      .get('#P18_ELE_CODIGO')
      .clear()
      .type(station, { delay: 100 })
      .then(() => station);
  }

  confirmWarehouse(): Cypress.Chainable<any> {
    return cy.get('#P18_OK').click();
  }

  insertDestination(destination: string): Cypress.Chainable<string> {
    return cy
      .get('#P18_CODIGO')
      .type(destination, { delay: 100 })
      .then(() => destination);
  }

  confirmDestination(): Cypress.Chainable<any> {
    const info: any = {};
    return cy
      .get('#P18_OK_DESTINO')
      .click()

      .getText('.t15NavBarItem')
      .then((radio) => (info.radio = (radio as string).split(' ').pop()?.trim()))

      .getText('.SILOMensajes')
      .then((errorMessage) => (info.errorMessage = errorMessage?.trim() || undefined))

      .then(() => info);
  }

  insertMatricula(matricula: string): Cypress.Chainable<string> {
    return cy
      .get('#P18_MATRICULA')
      .type(matricula, { delay: 100 })

      .then(() => matricula);
  }

  confirmMatricula(): Cypress.Chainable<any> {
    return cy.get('#P18_OK_PALET').click();
  }

  getConfirmationInfo(): Cypress.Chainable<any> {
    const confirmation: any = {};
    return cy
      .getText('#P18_DES_CODIGO_MOSTRADO')
      .then((destinationL1) => (confirmation.destinationL1 = destinationL1))

      .getText('#P18_DES_DESC')
      .then((destinationL2) => (confirmation.destinationL2 = destinationL2))

      .then(() => confirmation);
  }

  confirmContainerType(): Cypress.Chainable<any> {
    return cy.get('#P18_OK_TIPOPAL').click();
  }

  confirmOpenPaletOK(): Cypress.Chainable<string> {
    return cy
      .get('#P18_CREAR_PALET')
      .click()

      .getText('.SILOMensajes')
      .then((message) => message);
  }

  insertShipmentDestination(shipmentDestination: string): Cypress.Chainable<string> {
    return cy
      .get('#P18_ELEM')
      .type(shipmentDestination, { delay: 100 })

      .then(() => shipmentDestination);
  }

  confirmContainer(): Cypress.Chainable<any> {
    return cy.get('#P18_CREAR_PALET').click();
  }

  insertPackingContainer(container: string): Cypress.Chainable<string> {
    return cy
      .get('#P20_CODIGO')
      .type(container, { delay: 100 })

      .then(() => container);
  }

  confirmContainerToConsolidateOK(): Cypress.Chainable<string> {
    return cy
      .get('#P20_CONFIRMAR_PAL')
      .click()

      .getText('.SILOMensajes')
      .then((message) => message);
  }

  insertContainerToClose(container: string): Cypress.Chainable<any> {
    return cy.get('#P19_MAT_MATRICULA').type(container, { delay: 100 });
  }

  confirmContainerToClose(): Cypress.Chainable<any> {
    return cy.get('#P19_CONFIRMAR_PALET').click();
  }

  getClosePaletInfo(): Cypress.Chainable<any> {
    const closePalet: any = {};
    return cy
      .getText('#P19_PCON_DESC_ALM_MUESTRA_DISPLAY')
      .then((warehouse) => (closePalet.warehouse = warehouse))

      .getText('#P19_PCON_ELE_MUESTRA_DISPLAY')
      .then((element) => (closePalet.element = element))

      .getText('#P19_MAT_MAT_MUESTRA_DISPLAY')
      .then((matricula) => (closePalet.matricula = matricula))

      .then(() => closePalet);
  }

  confirmCloseContainerOK(): Cypress.Chainable<any> {
    return cy.get('#P19_CONFIRMAR_PEX').click();
  }

  getPutawayData(): Cypress.Chainable<any> {
    const putaway: any = {};
    return cy
      .getText('#CONFIRMACION_DESC_ALM_DISPLAY') // get destination (line 1)
      .then((destinationL1) => (putaway.putawayDestinationL1 = destinationL1))

      .getText('#CONFIRMACION_UBI_MOSTRAR_DISPLAY') // get destination (line 2)
      .then((destinationL2) => (putaway.putawayDestinationL2 = destinationL2))

      .then(() => putaway);
  }

  putawayConfirmLocation(): Cypress.Chainable<any> {
    return cy
      .getText('#CONFIRMACION_UBI_MOSTRAR_DISPLAY')
      .then((destination) => cy.get('#CONFIRMACION_UBI_CAPTURAR').type(destination, { delay: 100 }))

      .get('#RFUBICA_CONFIRMAR')
      .click()

      .wait(500);
  }

  putawayConfirmMatricula(matricula: string): Cypress.Chainable<any> {
    return cy
      .get('#LEC_MATRICULA')
      .type(matricula, { delay: 100 })

      .get('#CONFIRMA_LECTURA')
      .click()

      .wait(500);
  }

  consolidateInsertWarehouse(warehouse: string): Cypress.Chainable<string> {
    return cy
      .get('#P20_ALM_DESC_CORTA')
      .clear()
      .type(warehouse, { delay: 100 })
      .then(() => warehouse);
  }

  consolidateInsertElement(position: string): Cypress.Chainable<string> {
    return cy
      .get('#P20_CODUSU_CODIGO')
      .clear()
      .type(position, { delay: 100 })
      .then(() => position);
  }

  consolidateConfirmWarehouseCNT(): Cypress.Chainable<any> {
    return cy.get('#P20_CONSOL_POR_PALET').click();
  }
}

export default RFConsolidationPage;
