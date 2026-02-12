class DXCListContainersPage {
  visit(): Cypress.Chainable<any> {
    console.log('Visit de Packing');
    return cy.visit('/#/stock/list-containers').dxcValidateLocation({ relPath: '/stock/list-containers' });
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
      .get('articulos-encajado-step > div:nth-child(1) filtro-input-text > mat-form-field div > input')
      .clear()

      .wait(500) // necessary to wait input

      .type(item + '{enter}', { delay: 100 })

      .then(() => item);
  }

  ensureFiltersVisible(): Cypress.Chainable<any> {
    return cy
      .bLog({ msg: 'ensureFiltersVisible' })
      .get('#silo-filtro-lista-button')
      .then(($button) => {
        if ($button.find('span').text().includes('Show filters')) {
          cy.wrap($button).click();
        }
      });
  }

  filterInsertPalet(container: any): Cypress.Chainable<any> {
    console.log('filterInsertContainer');
    return cy
      .bLog({ msg: 'filterInsertContainer' })
      .get(':nth-child(19) > :nth-child(1) > filtro-lista')
      .should('be.visible')
      .click()
      .wait(5000)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .then(($selectOrder) => {
        return cy
          .wrap($selectOrder)
          .as('selectOrder')
          .then(() => {
            return cy
              .get('@selectOrder')
              .type(container + '{enter}', { delay: 100 }) // Asegúrate de que estás escribiendo el valor correcto
              .wait(6000)
              .then(() => {
                return cy.get('@selectOrder').clear().wait(200);
              });
          });
      })

      .get('body')
      .type('{esc}', { delay: 100 });
  }

  filterInsertType(type: any): Cypress.Chainable<any> {
    console.log('filterInsertContainer');
    return cy
      .bLog({ msg: 'filterInsertContainer' })
      .get(':nth-child(20) > :nth-child(1) > filtro-lista')
      .should('be.visible')
      .click()
      .wait(5000)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .then(($selectOrder) => {
        return cy
          .wrap($selectOrder)
          .as('selectOrder')
          .then(() => {
            return cy
              .get('@selectOrder')
              .type(type + '{esc}', { delay: 100 }) // Asegúrate de que estás escribiendo el valor correcto
              .wait(6000);
          });
      });
  }

  filterInsertContainer(container: any[], position: string): Cypress.Chainable<any> {
    console.log('filterInsertContainer');
    return cy
      .bLog({ msg: 'filterInsertContainer' })
      .get(':nth-child(19) > :nth-child(1) > filtro-lista')
      .should('be.visible')
      .click()
      .wait(5000)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .then(($selectOrder) => {
        return cy.wrap(container).each((container: any) => {
          console.log('container.container: ' + container.container + ' container.position: ' + container.position + ' position: ' + position);
          if (container.position === position || position === 'CON_RUEDO') {
            return cy
              .wrap($selectOrder)
              .as('selectOrder')
              .then(() => {
                return cy
                  .get('@selectOrder')
                  .type(container.container + '{enter}', { delay: 100 }) // Asegúrate de que estás escribiendo el valor correcto
                  .wait(6000)
                  .then(() => {
                    return cy.get('@selectOrder').clear().wait(200);
                  });
              });
          } else {
            return cy.log('No se ha encontrado el container');
          }
        });
      })

      .get('body')
      .type('{esc}', { delay: 100 });
  }

  selectPackContent(): Cypress.Chainable<any> {
    const create: any = {};
    console.log('selectPackContent');
    return (
      cy
        .get('button')
        .contains('Pack content')
        .click()
        // .wait(1000); // necessary wait to dialog open
        .wait(2000) // necessary to wait messages if exists
        .get('body')
        .then(($body) => {
          // &nbsp;This workstation is currently working with other containers, one of them is TE10000302.
          // <p class="pText">Do you want to cancel the previous container?</p>
          if ($body.find('#MsgBoxBack')) {
            const $msg = $body.find('#Msg1 > div > span');
            create.warningMessage = $msg.text().trim() || undefined;

            if ($msg && $msg.text().includes('This workstation is currently working with other containers')) {
              return cy.wrap($body.find('#bot2-Msg1')).click(); // press YES button
            }
          }
        })
    );
  }
  reportFullBox(): Cypress.Chainable<any> {
    console.log('reportFullBox');
    return cy.get('button').contains('Full box').click();
  }

  reportShortage(): Cypress.Chainable<any> {
    console.log('reportShortage');
    return cy.get('button').contains('Report shortage').click();
  }

  confirmShortage(): Cypress.Chainable<any> {
    console.log('confirmShortage');
    return cy.get('button').contains('Confirm shortage').click();
  }

  emptyContainer(): Cypress.Chainable<any> {
    console.log('emptyContainer');
    return cy.get('button').contains('Empty container').click();
  }

  finishButton(): Cypress.Chainable<any> {
    console.log('finishButton');
    return cy.get('button').contains('Finish').click();
  }

  emptyButton(): Cypress.Chainable<any> {
    console.log('emptyButton');
    return cy.get('button').contains('Empty container').click();
  }

  filterInsertContainerFalta(container: string): Cypress.Chainable<any> {
    // cy.get(':nth-child(19) > :nth-child(1) > filtro-lista > .mat-error-warning > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix')
    console.log('filterInsertContainer');
    return cy
      .get(':nth-child(19) > :nth-child(1) > filtro-lista')
      .should('be.visible')
      .click()
      .wait(100)

      .get('.mat-select-search-inner > .mat-select-search-input')
      .then(($selectContainer) => {
        return cy
          .wrap($selectContainer)
          .as('selectContainer')
          .then(() => {
            return cy
              .get('@selectContainer')
              .type(container, { delay: 100 })
              .wait(1000)
              .then(() => {
                return cy.get('@selectContainer').clear().wait(200);
              });
          });
      })

      .wait(500) // necessary to wait select

      .get('body')
      .type('{esc}', { delay: 100 }); // select collapse
  }

  setFilter(): Cypress.Chainable<any> {
    console.log('setFilter');
    return cy
      .bLog({ msg: 'setFilter' })
      .get('button')
      .contains('Set')
      .click()

      .wait(2000);
  }

  selectAll(): Cypress.Chainable<any> {
    return cy.bLog({ msg: 'selectAll' }).get('#paletsGrid input').first().check().wait(500);
  }

  moveContainer(): Cypress.Chainable<any> {
    console.log('moveContainer');
    return cy
      .bLog({ msg: 'moveContainer' })

      .wait(2000)

      .get('button')
      .contains('Move')
      .click()

      .wait(2000)

      .get('.dropup > .dropdown-menu > li > :nth-child(1)')
      .click()

      .wait(2000);
  }

  changeContainer(): Cypress.Chainable<any> {
    console.log('changeContainer');
    return cy.bLog({ msg: 'changeContainer' }).get('mat-radio-button').contains('New container').click(); // select new container
  }

  insertWarehouseExpedition(type: string = ''): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertWarehouseExpedition' })
      .get('select-almacen-posicion-step > form > div:nth-child(1) > filtro-lista > span > mat-form-field')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div')

      .type(type, { delay: 100 })
      .then(() => {
        if (type === 'CB2CR') {
          cy.get('span > span.DescLarga.ng-star-inserted').should('be.visible').contains('B2C Ruedo Consolidation').click();
        }
      })

      .then(() => type);
  }

  insertWarehouseIncompleted(type: string = 'II'): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertWarehouseExpedition' })
      .get('select-almacen-posicion-step > form > div:nth-child(1) > filtro-lista > span > mat-form-field')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div')

      .type(type, { delay: 100 })

      .then(() => type);
  }

  insertWarehousePalet(type: string = 'EXPED'): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertWarehousePalet' })
      .get('create-palet-step > form > div:nth-child(1) > filtro-lista > span > mat-form-field ')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div')

      .clear()

      .type(type + '{enter}', { delay: 100 })

      .then(() => type);
  }

  insertPosition(pos: string = ''): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertPosition' })
      .get('select-almacen-posicion-step > form > div:nth-child(2) mat-select')
      .should('be.visible')
      .type(pos, { delay: 100 })

      .wait(2000)

      .then(() => pos);
  }

  insertPositionPalet(pos: string = ''): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertPositionPalet' })

      .get('create-palet-step > form > div:nth-child(2) mat-select')
      .should('be.visible')

      .type(pos, { delay: 100 })
      .wait(2000)

      .then(() => pos);
  }

  insertTypePalet(type: string = 'STANDARD P'): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertTypePalet' })
      .get('create-palet-step > form > div:nth-child(3) > filtro-lista > span > mat-form-field ')
      .should('be.visible')
      .click()

      .get('span > ngx-mat-select-search > div')

      .clear()

      .type(type + '{esc}', { delay: 100 })

      .then(() => type);
  }

  insertPaletId(containerId: string = ''): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertPaletID' })
      .get('create-palet-step > form > div:nth-child(4) > filtro-input-text > mat-form-field div > input')
      .should('be.visible')
      .type(containerId + '{esc}', { delay: 100 })

      .get('create-palet-step > form > div:nth-child(6) > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .should('be.visible')
      .click()

      .wait(2000)

      .then(() => containerId);
  }

  insertKanguroId(containerId: string = ''): Cypress.Chainable<string> {
    return cy
      .bLog({ msg: 'insertKanguroID' })
      .get('finalizar-encajado-step > form > div.col-xs-12.col-sm-6.col-sm-offset-3.ng-star-inserted > filtro-input-text > mat-form-field > div > div > div > input')
      .should('be.visible')
      .type(containerId + '{esc}', { delay: 100 })

      .then(() => containerId);
  }

  finishMovePosition(): Cypress.Chainable<string> {
    let message: string = '';

    return cy
      .bLog({ msg: 'finishMovePosition' })
      .get('.cdk-overlay-backdrop')
      .invoke('css', 'display', 'none') // to avoid backdrop blocking the button
      .get('select-almacen-posicion-step > form > div:nth-child(4) > button.button.button-default.button-primary-fondo-blanco.button-pull-right')
      .should('be.visible')
      .click()

      .wait(2000)
      .get('#finishButton', { timeout: 120000 }) // if not have valid labels on the scanned material, it could be slow
      .should('be.visible') // Wait for the button to be visible

      .getText('done-step > .alert, done-step h1 span')
      .then((result) => {
        message = result.trim();
      }) // error if any message is displayed, should just be OK

      .get('#finishButton')
      .should('be.visible')
      .click()

      .then(() => message);
  }

  finishMoveExp(): Cypress.Chainable<string> {
    let message: string = '';

    return cy
      .bLog({ msg: 'finishMoveExp' })
      .get('#finishButton', { timeout: 120000 }) // if not have valid labels on the scanned material, it could be slow
      .should('be.visible') // Wait for the button to be visible

      .getText('done-step > .alert, done-step h1 span')
      .then((result) => {
        message = result.trim();
      }) // error if any message is displayed, should just be OK

      .get('#finishButton')
      .should('be.visible')
      .click()

      .then(() => message);
  }
}

export default DXCListContainersPage;
