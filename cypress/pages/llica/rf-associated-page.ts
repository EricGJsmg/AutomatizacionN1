class RFAssociatedPage {
  // insert material container and then, confirm
  ubicacionDeContenedoresConfirmMatricula(matricula: string): Cypress.Chainable<any> {
    return cy
      .get('#LEC_MATRICULA')
      .type(matricula, { delay: 100 })

      .get('#CONFIRMA_LECTURA')
      .click();
  }

  // insert ubicacion and then, confirm
  ubicacionDeContenedoresConfirmUbicacion(ubicacion: string): Cypress.Chainable<any> {
    return cy
      .get('#CONFIRMACION_UBI_CAPTURAR')
      .type(ubicacion, { delay: 100 })

      .get('#RFUBICA_CONFIRMAR')
      .click();
  }

  // insert material container and then, confirm
  repartoContenedorAPosicionesConfirmContainer(container: string): Cypress.Chainable<any> {
    return cy
      .get('#P40_MATREPARTO_LEER')
      .type(container, { delay: 100 })

      .get('#P40_CONFIRMAR_PAL')
      .click();
  }

  // inserte material external code and then, confim
  lecturaDeEtiquetasConfirmReference(refMaterial: string): Cypress.Chainable<any> {
    console.log('lecturaDeEtiquetasConfirmReference: ', refMaterial);
    return cy
      .get('#P40_CODIGO_ETIQUETA')
      .type(refMaterial, { delay: 100 })

      .get('#P40_CONFIRMAR_ETIQUETA')
      .click();
  }

  // copy, insert and confirm position
  lecturaDestinoConfirmPosition(): Cypress.Chainable<string> {
    console.log('lecturaDestinoConfirmPosition');
    const destination: any = {};
    return cy
      .getText('#P40_POS_DES_DISPLAY')
      .then((position) => {
        destination.pos = position;
        return cy.get('#P40_DESTINO_LEER').type(position, { delay: 100 });
      })

      .getText('#P40_CANTIDAD_DISPLAY')
      .then((qty) => {
        return (destination.quantity = qty);
      })

      .getText('#P40_ALM_DES_DESC')
      .then((desL1) => {
        return (destination.destino = desL1);
      })

      .getText('#P40_POS_DES_DISPLAY')
      .then((desL2) => {
        return (destination.destino += '-' + desL2);
      })

      .get('#P40_CONFIRMAR_DESTINO')
      .click()

      .then(() => destination);
  }

  lecturaDestinoConfirmContainer(newContainer: string): Cypress.Chainable<any> {
    return cy
      .get('#P40_PALET_DESTINO_LEER')
      .type(newContainer, { delay: 100 })

      .get('#P40_CONFIRMAR_DESTINO')
      .click();
  }

  cierreDeCeldasAsociadoConfirmUbicacion(pos: string): Cypress.Chainable<any> {
    return cy
      .get('#P38_UBICACION_LEIDA')
      .type(pos, { delay: 100 })

      .get('#PIDE_MATRICULA')
      .click();
  }

  cierreDeCeldasAsociadoOK(): Cypress.Chainable<any> {
    const cierre: any = {};

    console.log('cierreDeCeldasAsociadoOK');
    return cy
      .getText('#P38_DESC_ALMDES_DISPLAY')
      .then((des1) => {
        return (cierre.destino = des1);
      })

      .getText('#P38_POSDES_DISPLAY')
      .then((des2) => {
        return (cierre.destino += '-' + des2);
      })

      .getText('#P38_PEDIDO_CONFIRMACION_DISPLAY')
      .then((order) => {
        console.log('cierre.destino: ', cierre.destino);
        return (cierre.orderId = order);
      })

      .get('#CIERRA_CASILLERO')
      .click()

      .then(() => cierre);
  }
}

export default RFAssociatedPage;
