class RFShipmentsPage {
  addRemoveContainerConfirmContainer(matricula: string): Cypress.Chainable<string> {
    return cy
      .get('#P27_PALET')
      .type(matricula, { delay: 100 })

      .get('#P27_ASIGNAR_PALET')
      .click()

      .getText('.SILOMensajes');
  }

  selectShipmentConfirm(shipment: string): Cypress.Chainable<any> {
    cy.get('#P27_EXPEDICION').as('shipmentInput').should('be.visible').type(shipment, { delay: 100 });

    cy.get('#P27_SELECCIONAR').as('selBtn').should('be.visible').click();

    return cy.getText('.t15NavBarItem').then((radio: string) => radio.split(' ').pop()?.trim());
  }
}

export default RFShipmentsPage;
