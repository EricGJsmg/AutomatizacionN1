class RFPickingPage {
  pressStart(): Cypress.Chainable<any> {
    return cy.get('#BOTON_INI').click().wait(500);
  }

  confirm(): Cypress.Chainable<any> {
    return cy.get('#RECOGER').click();
  }

  soFillLocation(material: { location: string }): Cypress.Chainable<any> {
    return cy.getControl('#RFPICKUNI_LEC_LECUBI_CONF').type(material.location, { delay: 100 });
  }

  soFillArticulo(material: { articulo: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECART, #RFPICKUNI_LEC_LECART').type(material.articulo, { delay: 100 });
  }

  soFillQuantity(material: { quantity: string }): Cypress.Chainable<any> {
    return cy.getControl('#RFPICKUNI_LEC_LECCANTIDAD').type(material.quantity, { delay: 100 });
  }

  getStartPickingInfo(): Cypress.Chainable<any> {
    const info: any = {};
    return cy
      .getText('.t15NavBarItem')
      .then((radio) => (info.radio = (radio as string).split(' ').pop()?.trim()))

      .getText('#P10_TARI_DESC')
      .then((sTitle) => (info.sTitle = sTitle))

      .getText('#P10_SERIE')
      .then((id) => (info.id = id))

      .getText('#P10_SALIDA')
      .then((output) => (info.output = output))

      .getText('#P10_UNIDAD_RECOGIDA')
      .then((pick) => (info.pick = pick))

      .getText('#P10_NUMLINEAS')
      .then((nrOfLines) => (info.nrOfLines = nrOfLines))

      .getText('#P10_NUMAGRUPACIONES')
      .then((nrOfGroupings) => (info.nrOfGroupings = nrOfGroupings))

      .getText('#P10_NUM_ARTICULO')
      .then((nrOfItems) => (info.nrOfItems = nrOfItems))

      .getText('#P10_TOTAL_UDS_SALIDA')
      .then((totalUnits) => (info.totalUnits = totalUnits))

      .getText('#P10_NUM_PED_SALIDA')
      .then((nrOfOrders) => (info.nrOfOrders = nrOfOrders))

      .getText('#P10_COMENTARIO_DISPLAY')
      .then((note) => (info.note = note))

      .then(() => info);
  }

  getReport(): Cypress.Chainable<any> {
    const report: any = {};
    return cy
      .getText('#report_CONTENEDORES_FIN_PICKING > tbody > tr:nth-child(2) > td:nth-child(1)')
      .then((container) => (report.container = container))

      .getText('#report_CONTENEDORES_FIN_PICKING > tbody > tr:nth-child(2) > td:nth-child(2)')
      .then((orderId) => (report.orderId = orderId))

      .getText('#report_CONTENEDORES_FIN_PICKING > tbody > tr:nth-child(2) > td:nth-child(3)')
      .then((code) => (report.pickCode = code))

      .then(() => report);
  }

  pressClose(): Cypress.Chainable<any> {
    return cy.get('#BOTON_PULSADO_FIN_PICKING').click();
  }

  moFillLocation(material: { location: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECUBI_CONF, #RFPICKUNI_LEC_LECUBI_CONF').type(material.location, { delay: 100 });
  }

  moFillArticulo(material: { articulo: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECART, #RFPICKUNI_LEC_LECART').type(material.articulo, { delay: 100 }).wait(100);
  }

  moFillQuantity(material: { quantity: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECCANTIDAD, #RFPICKUNI_LEC_LECCANTIDAD').type(material.quantity, { delay: 100 }).wait(100);
  }

  bFillLocation(material: { location: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECUBI_CONF, #RFPICKUNI_LEC_LECUBI_CONF').type(material.location, { delay: 100 });
  }

  bFillArticulo(material: { articulo: string }): Cypress.Chainable<any> {
    return cy.getControl('#45_RFPICKUNI_LEC_LECART, #RFPICKUNI_LEC_LECART').type(material.articulo, { delay: 100 });
  }

  bFillQuantity(material: { quantity: string }): Cypress.Chainable<any> {
    return cy.getControl('#RFPICKUNI_LEC_LECCANTIDAD2, #RFPICKUNI_LEC_LECCANTIDAD, #45_RFPICKUNI_LEC_LECCANTIDAD').type(material.quantity, { delay: 100 });
  }

  moFillArticuloQuantity(material: { articulo: string; quantity: string }): Cypress.Chainable<any> {
    return cy
      .getControl('#45_RFPICKUNI_LEC_LECCANTIDAD, #RFPICKUNI_LEC_LECCANTIDAD')
      .as('qtyInput')

      .getControl('#45_RFPICKUNI_LEC_LECART, #RFPICKUNI_LEC_LECART')
      .as('artInput')

      .get('@qtyInput')
      .invoke('val', material.quantity)
      .wait(1000)

      .get('@artInput')
      .type(material.articulo, { delay: 100 })
      .wait(1000)

      .get('@artInput')
      .type('{enter}')

      .get('@qtyInput')
      .invoke('val', material.quantity)
      .wait(1000);
  }

  getMaterialInfo(type: 'SINGLE' | 'MULTI' | 'BATCH', localizacion: number): Cypress.Chainable<any> {
    const material: any = {};
    switch (type) {
      case 'SINGLE':
        return cy
          .getText('#RFPICKUNI_LEC_DESC_ALM_ORI')
          .then((almacen) => (material.almacen = almacen))

          .getText('#RFPICKUNI_LEC_POS_ORI_PET')
          .then((location) => (material.location = location))

          .getText('#RFPICKUNI_LEC_ART_COD_EXT')
          .then((articulo) => (material.articulo = articulo))

          .getText('#RFPICKUNI_LEC_DESC_ARTICULO_DISPLAY')
          .then((descripcion) => (material.descripcion = descripcion))

          .getText('#RFPICKUNI_LEC_CANT')
          .then((quantity) => (material.quantity = quantity))

          .then(() => material);
      case 'MULTI':
        if (localizacion === 5)
          return cy
            .getText('#45_RFPICKUNI_LEC_DESC_ALM_ORI, #RFPICKUNI_LEC_DESC_ALM_ORI')
            .then((almacen) => {
              material.almacen = almacen;
            })

            .getText('#45_RFPICKUNI_LEC_CODUSU_POSORI')
            .then((locationC1) => {
              material.location = locationC1;
              return cy.getText('#45_RFPICKUNI_LEC_POS_ORI_PET_AUX').then((locationC2) => (material.location += ' ' + locationC2));
            })

            .getText('#45_RFPICKUNI_LEC_ART_CABECERA')
            .then((articulo1) => {
              material.articulo = articulo1;
              return cy.getText('#45_RFPICKUNI_LEC_ART_COD_EXT_AUX');
            })
            .then((articulo2) => (material.articulo += articulo2))

            .getText('#45_RFPICKUNI_LEC_DESC_ARTICULO_DISPLAY')
            .then((descripcion) => (material.descripcion = descripcion))

            .getText('#45_RFPICKUNI_LEC_CANT_AUX')
            .then((quantity) => {
              material.quantity = quantity;
            })
            .then(() => material);
        else
          return cy
            .getText('#45_RFPICKUNI_LEC_DESC_ALM_ORI, #RFPICKUNI_LEC_DESC_ALM_ORI')
            .then((almacen) => {
              material.almacen = almacen;
            })

            .getText('#45_RFPICKUNI_LEC_CODUSU_POSORI')
            .then((locationC1) => {
              material.location = locationC1;
              return cy.getText('#45_RFPICKUNI_LEC_POS_ORI_PET_AUX').then((locationC2) => (material.location += ' ' + locationC2));
            })

            .getText('#45_RFPICKUNI_LEC_ART_CABECERA')
            .then((articulo1) => {
              material.articulo = articulo1;
              return cy.getText('#45_RFPICKUNI_LEC_ART_COD_EXT_AUX');
            })
            .then((articulo2) => (material.articulo += articulo2))

            .getText('#45_RFPICKUNI_LEC_DESC_ARTICULO_DISPLAY, #RFPICKUNI_LEC_DESC_ARTICULO_DISPLAY')
            .then((descripcion) => {
              material.descripcion = descripcion;
            })

            .getText('#45_RFPICKUNI_LEC_CANT_AUX, #RFPICKUNI_LEC_CANT')
            .then((quantity) => {
              material.quantity = quantity;
            })
            .then(() => material);
      case 'BATCH':
        return cy
          .getText('#RFPICKUNI_LEC_DESC_ALM_ORI, #45_RFPICKUNI_LEC_DESC_ALM_ORI')
          .then((almacen) => (material.almacen = almacen))

          .getText('#RFPICKUNI_LEC_POS_ORI_PET')
          .then((location) => (material.location = location))

          .getText('#RFPICKUNI_LEC_ART_COD_EXT')
          .then((articulo) => (material.articulo = articulo))

          .getText('#RFPICKUNI_LEC_DESC_ARTICULO_DISPLAY')
          .then((descripcion) => (material.descripcion = descripcion))

          .getText('#RFPICKUNI_LEC_CANT')
          .then((quantity) => (material.quantity = quantity))

          .then(() => material);
    }
  }

  // fill Location/Article/Quantity
  fillMaterial(material: { location: string; articulo: string; quantity: string }, type: 'SINGLE' | 'MULTI' | 'BATCH'): Cypress.Chainable<any> {
    switch (type) {
      case 'SINGLE':
        return cy
          .then(() => {
            return this.soFillLocation(material);
          })
          .then(() => {
            return this.soFillArticulo(material);
          })
          .then(() => {
            return this.soFillQuantity(material);
          });
      case 'MULTI':
        return cy
          .then(() => {
            return this.moFillLocation(material);
          })
          .then(() => {
            return this.moFillArticuloQuantity(material);
          });
      case 'BATCH':
        return cy
          .then(() => {
            return this.bFillLocation(material);
          })
          .then(() => {
            return this.bFillArticulo(material);
          })
          .then(() => {
            return this.bFillQuantity(material);
          });
    }
  }

  getPickfor(): Cypress.Chainable<string> {
    return cy.getText('#45_PALET_DESTINO_AGRDEP_DISPLAY, #PALET_DESTINO_AGRDEP_DISPLAY');
  }

  getPaletDestino(): Cypress.Chainable<string> {
    return cy.get('body').then(($body) => {
      return cy.wrap($body.find('#45_PALET_DESTINO_AGRDEP_MATRICULA, #PALET_DESTINO_AGRDEP_MATRICULA').first().text().trim());
    });
  }

  insertContainerDestination(container: string): Cypress.Chainable<any> {
    cy.getControl('#45_RFPICKUNI_PALD_MATPAL_DESTINO, #RFPICKUNI_PALD_MATPAL_DESTINO').type(container, { delay: 100 });
    return cy.get('#RECOGER_PALETS_DESTINO').click(); // press PIC button
  }
}

export default RFPickingPage;
