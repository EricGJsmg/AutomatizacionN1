class DXCProcessReturnsPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit('/#/receiving/process-returns').dxcValidateLocation({ relPath: '/receiving/process-returns' });
  }

  insertContainer(container: string): Cypress.Chainable<any> {
    return cy.get('#inputContainerId').clear().wait(500).type(container.concat('{enter}'), { delay: 100 });
  }

  insertOrder(order: string): Cypress.Chainable<any> {
    return cy.get('#inputOrderId').clear().wait(500).type(order.concat('{enter}'), { delay: 100 });
  }

  scannItem(item: string): Cypress.Chainable<any> {
    return cy
      .get('#cdk-step-content-0-2 #inputItemId')
      .wait(500)

      .type(item.concat('{enter}'), { delay: 100 })
      .wait(1000)

      .get('body')
      .then(($body: JQuery<HTMLBodyElement>) => {
        const $yesBtn = $body.find('#bot2-Msg1'); // button yes of msg 'Do you want to create a new return line?'
        if ($yesBtn?.length) cy.wrap($yesBtn).click({ force: true }).wait(1000);
      });
  }

  returnConfirm(): Cypress.Chainable<any> {
    return cy
      .getControl('.btnOkDevoluciones') // OK
      .click()
      .wait(200)

      .get('body')
      .then(($body: JQuery<HTMLBodyElement>) => {
        const $nextBtn = $body.find('div:nth-child(2) > form > div:nth-child(4) > button.button.button-default.button-primary-fondo-blanco.button-pull-right');
        if ($nextBtn?.length) cy.wrap($nextBtn).click({ force: true }).wait(200);
      })

      .getControl('#selectReturnReasonId') // Return reason
      .click()
      .wait(200)

      .getControl('#selectSearchReturnReasonId > div > input') // Return reason > input  // CONFIRM
      .type('03{enter}')
      .wait(1000);
  }

  processReturns(): Cypress.Chainable<any> {
    return cy.getControl(':nth-child(2) > :nth-child(2) > .button').click().wait(3000);
  }

  closeContainer(): Cypress.Chainable<any> {
    return cy.get('#paletsSegmentacionGrid render-navegacion > a > b').then(($eleContainers: JQuery<HTMLElement>) => {
      const codigosSet = new Set<string>();
      $eleContainers.each((_, el) => {
        const codigo = el.innerText.trim();
        if (codigo) codigosSet.add(codigo);
      });

      cy.wrap([...codigosSet] as string[]).each((container: string) => {
        return cy
          .getControl('mat-horizontal-stepper div:nth-child(2) > div > div > button')
          .click()
          .wait(500)

          .getControl('mat-dialog-container #inputContainerId')
          .type(container.concat('{enter}'))
          .wait(500);
      });
    });
  }
}

export default DXCProcessReturnsPage;
