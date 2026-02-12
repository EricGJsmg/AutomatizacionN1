import RFLoginPage from '../../../../pages/cdo/rf-login-page';
import RFGuidedLocationPage from '../../../../pages/cdo/rf-guided-location-page';
import GqlService from '../../../services/gql/gql-service';
import { OrderLine, Puesto, Radio, Palet, Bulto } from '../../../services/gql/gql-types';

Cypress.Commands.add('disconnectAllRadios', ({ username = Cypress.env('username') } = {}) => {
  return cy
    .wrap([
      { localizacion: 4, dispositivo: 40001 },
      { localizacion: 5, dispositivo: 5100 },
      { localizacion: 6, dispositivo: 830747 },
      { localizacion: 9, dispositivo: 90001 },
    ])
    .each((site: { localizacion: number; dispositivo: number }) => {
      return GqlService.getRadios(site).then((radios: Radio[]) => {
        const connectedRadios = radios
          .filter((radio: Radio) => radio.rad_usuario?.usr_codigo === username) // filter the radios that match the user
          .map((radio: Radio) => radio.rad_codigo);
        console.log({ connectedRadios, localizacion: site.localizacion });
        if (connectedRadios?.length) {
          GqlService.disconnectAllRadios({ ...site, radios: connectedRadios }).then(() => {
            cy.wrap(connectedRadios).each((radio: number) => {
              GqlService.clearRadio({ ...site, radio });
            });
          });
        }
      });
    });
});

Cypress.Commands.add('newContainer', ({ code = null, type = 100, localizacion, dispositivo } = {}) => {
  return cy.then(() => GqlService.getNewContainer({ code, type, localizacion, dispositivo }));
});

Cypress.Commands.add('getAvailableRadios', ({ localizacion, warehouse } = {}) => {
  return cy.log('getAvailableRadios').then(() => {
    return GqlService.getRadios({ localizacion }).then((radios: Partial<Radio>[]) => {
      const availableRadios = radios.filter((radio) =>
        radio?.rad_libre === 1 && radio?.rad_usuario === null && radio?.rad_estado?.ei_codigo === 2001 && radio?.rad_tipo?.pvci_valor === 'R' && warehouse
          ? radio?.rad_elemento?.elei_almacen?.almi_numero === warehouse
          : undefined,
      );

      return cy.wrap(availableRadios.map((radio) => radio?.rad_codigo) as number[]);
    });
  });
});

Cypress.Commands.add('connectRadio', ({ localizacion, profile = 'Prep. Pedidos' } = {}) => {
  return cy.getPuesto().then((puesto: Puesto) => {
    puesto.localizacion = localizacion ?? puesto.localizacion;
    const rLogin = new RFLoginPage();

    return cy
      .log('connectRadio')
      .then(() => rLogin.login())
      .then(() => rLogin.selectSite(puesto.site))
      .taskSelect([profile])
      .wait(2000)

      .get('input[value="OK"]')
      .click()

      .get('body')
      .then(($body) => {
        // ensure that there is no open container
        const closePickButton: any = $body.find('#BOTON_PULSADO_FIN_PICKING') || undefined;
        if (closePickButton?.length) return cy.wrap(closePickButton).click();
      });
  });
});

Cypress.Commands.add('taskSelect', (tasks: string[]) => {
  const rLogin = new RFLoginPage();
  return cy
    .log('taskSelect')
    .wrap(tasks)
    .each((task: string) => rLogin.selectTask(task));
});

// fullRoute: full path from #MENU
Cypress.Commands.add('ensureStartRoute', ({ expectedMenu, fullRoute } = {}) => {
  return cy
    .log('ensureStartRoute')
    .wait(500)
    .get('body')
    .then(($body) => {
      const links = $body.find('a') ?? [];
      const menuVisible = Array.from(links).some((link) => link.innerText.includes(expectedMenu));

      if (menuVisible && links?.length) return cy.taskSelect([expectedMenu]);
      else return cy.get('#MENU').click().taskSelect(fullRoute);
    })

    .get('body')
    .then(($body) => {
      const $backButton = $body.find('[title="BACK"], [title="CHANGE WORKING STATION"]').first();
      if ($backButton?.length) {
        cy.wrap($backButton).as('backButton');
        return cy.get('@backButton').click();
      }
    });
});

Cypress.Commands.add('getOrderLinesMerged', ({ container, localizacion } = {}) => {
  const query: string = `
    where: {
      bultos_asignados_SOME: {
        ba_bulto: { bul_subpalet: { pal_matricula: "${container}" } }
      }
    }
    orderBy: [lped_pedido_ASC, lped_nlinea_ASC]
    `;
  return GqlService.getLineasPedido({ localizacion, query }).then((lines: Partial<OrderLine>[]) => {
    const orderLines: { id: string; articulo: string }[] = lines.map((line) => ({
      id: line.lped_pedido!.ped_num_host,
      articulo: line.lped_articulo!.arti_cod_ext,
    }));

    // merge articles in each order
    const mergedOrders = Object.values(
      orderLines.reduce(
        (acc, current) => {
          if (acc[current.id]) {
            acc[current.id].articulos.push(current.articulo);
          } else {
            acc[current.id] = { id: current.id, articulos: [current.articulo] };
          }
          return acc;
        },
        {} as { [key: string]: { id: string; articulos: string[] } },
      ),
    );
    return cy.wrap({ orders: mergedOrders, container });
  });
});

Cypress.Commands.add('setAcceptLanguage', (language) => {
  return cy
    .intercept(/103:.*ords|ords.*103:/, (req) => {
      req.headers['accept-language'] = language;
    })
    .as('language: ' + language);
});

Cypress.Commands.add('getPickingRadioRoute', ({ type } = {}) => {
  return cy.then(() => {
    switch (type) {
      case 'SINGLE':
        return ['Outbound', 'B2C', 'B2C Single Order'];

      case 'MULTI':
        return ['Outbound', 'B2C', 'B2C Multi Order'];

      case 'BATCH':
        return ['Outbound', 'B2C', 'B2C Batch', 'B2C Batch Doblado No Unitario'];

      default:
        return undefined;
    }
  });
});

Cypress.Commands.add('guidedLocationPrendaAPrenda', ({ localizacion, warehouse, container } = {}) => {
  let query: string = `
      ${container
      ? `where: { pal_matricula: "${container}" }`
      : `where: {
                      AND: [
                        { pal_alm_situ: { almi_desc_corta: "${warehouse}" } }
                        { pal_numbultos_GTE: 0 }
                      ]
                    }
        `
    }
  `; // ALMACEN IB2B + BULTOS > 0

  query += '  orderBy: pal_matricula_ASC';
  return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
    const containers: string[] = palets.map((p) => p.pal_matricula);
    console.log(`Contenedores encontrados: ${containers}`);
    expect(containers, 'Deberian haber contenedores').not.to.be.empty;

    const containerSelected: string = containers[0];
    query = `
              where: { bul_palet: { pal_matricula: "${containerSelected}" } }
            `;
    GqlService.getBultos({ localizacion, query }).then((bultos: any[]) => {
      console.log(`Bultos encontrados: ${bultos}`);
      if (bultos) {
        const articles: string[] = bultos.map((b) => b.bul_articulo.arti_cod_ext);
        console.log(`Articulos encontrados: ${articles}`);

        const bultoSelected: any = bultos[0];
        const bultoNumber: number = bultoSelected.bul_numero;
        const articleSelected: string = bultoSelected.bul_articulo?.arti_cod_ext;
        const articleStock: number = bultoSelected.bul_cantidad;

        cy.disconnectAllRadios().connectRadio({ localizacion, profile: '(Ubicación|Ubicado)' }).taskSelect(['Ubicación', 'Guiada', 'Prenda a prenda']);

        const rFGuidedLocationPage: RFGuidedLocationPage = new RFGuidedLocationPage();
        rFGuidedLocationPage.insertContainer(containerSelected);
        rFGuidedLocationPage.insertArticle(articleSelected);
        rFGuidedLocationPage.confirmDestination();

        query = `
                where: { bul_numero: ${bultoNumber} }
                `;
        GqlService.getBultos({ localizacion, query }).then((bultos: any[]) => {
          let newQtity: string = '[eliminado por no quedar stock]';
          if (bultos?.length && (bultos[0] as Bulto).bul_articulo.arti_cod_ext === articleSelected) {
            newQtity = (bultos[0] as Bulto).bul_cantidad.toString();
          }

          cy.bLog({
            msg: {
              message:
                articleStock.toString() != newQtity
                  ? `La cantidad cambio exitosamente. Antes: ${articleStock.toString()}, ahora: ${newQtity}`
                  : `Fail: la cantidad no cambio. Ahora: ${newQtity}`,
            },
          });

          assert.notEqual(articleStock.toString(), newQtity, `La cantidad de stock del bulto deberia haber cambiado.\n Antes: ${articleStock.toString()}, ahora: ${newQtity}`);
        });

        rFGuidedLocationPage.deleteBox();
        rFGuidedLocationPage.exit();
      }
    });
  });
});

Cypress.Commands.add('guidedLocationArticuloCantidad', ({ localizacion, warehouse, quantity, container } = {}) => {
  let query: string = `
      ${container
      ? `where: { pal_matricula: "${container}" }`
      : `where: {
                      AND: [
                        { pal_alm_situ: { almi_desc_corta: "${warehouse}" } }
                        { pal_numbultos_GTE: 0 }
                      ]
                    }
        `
    }
  `; // ALMACEN IB2B + BULTOS > 0

  query += '  orderBy: pal_matricula_ASC';
  return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
    const containers: string[] = palets.map((p) => p.pal_matricula);
    console.log(`Contenedores encontrados: ${containers}`);
    expect(containers, 'Deberian haber contenedores').not.to.be.empty;

    const containerSelected: string = containers[0];
    query = `
            where: { bul_palet: { pal_matricula: "${containerSelected}" } }
            `;
    GqlService.getBultos({ localizacion, query }).then((bultos: any[]) => {
      console.log(`Bultos encontrados: ${bultos}`);
      if (bultos) {
        const articles: string[] = bultos.map((b) => b.bul_articulo.arti_cod_ext);
        console.log(`Articulos encontrados: ${articles}`);

        const bultoSelected: Partial<Bulto> = bultos[0];
        const bultoNumber: number = bultoSelected.bul_numero!;
        const articleSelected: string = bultoSelected.bul_articulo!.arti_cod_ext!;
        const articleStock: number = bultoSelected.bul_cantidad!;

        cy.disconnectAllRadios().connectRadio({ localizacion, profile: 'Ubicado' }).taskSelect(['Ubicación', 'Guiada', 'Artículo\\+Cantidad']);

        const rFGuidedLocationPage: RFGuidedLocationPage = new RFGuidedLocationPage();
        rFGuidedLocationPage.insertContainer(containerSelected);
        rFGuidedLocationPage.insertArticle(articleSelected, quantity.toString());
        rFGuidedLocationPage.confirmDestination();

        query = `
                where: { bul_numero: ${bultoNumber} }
              `;
        GqlService.getBultos({ localizacion, query }).then((bultos: any[]) => {
          if (bultos?.length && (bultos[0] as Bulto).bul_articulo.arti_cod_ext === articleSelected) {
            const currentQty: number = (bultos[0] as Bulto).bul_cantidad!;
            const expectedQty = articleStock - Number(quantity);

            if (expectedQty === 0) {
              query = `where: { pal_matricula: "${containerSelected}" }  orderBy: pal_matricula_ASC`;
              return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
                if (palets[0].pal_alm_situ!.almi_desc_corta != warehouse) {
                  cy.bLog({
                    msg: {
                      message: 'Se cambio el almacen con exito por haber tomado todos los articulos',
                    },
                  });

                  expect(palets[0].pal_alm_situ!.almi_desc_corta, 'Se cambio el almacen con exito por haber tomado todos los articulos').not.to.be.equal(warehouse);
                }
              });
            } else {
              cy.bLog({
                msg: {
                  message: expectedQty === currentQty ? `Se cambio la cantidad con exito.` : 'Fail: no se pudo cambiar la cantidad.',
                  esperado: expectedQty,
                  actual: currentQty,
                },
              });

              expect(expectedQty, `La nueva cantidad deberia ser ${expectedQty}, actual: ${currentQty}`).to.be.equal(currentQty);
            }
          }
        });

        rFGuidedLocationPage.deleteBox();
        rFGuidedLocationPage.exit();
      }
    });
  });
});

Cypress.Commands.add('guidedLocationCajaPalet', ({ localizacion, warehouse, container } = {}) => {
  let query: string = `
      ${container
      ? `where: { pal_matricula: "${container}" }`
      : `where: {
                      AND: [
                        { pal_alm_situ: { almi_desc_corta: "${warehouse}" } }
                        { pal_numbultos_GTE: 0 }
                      ]
                    }
        `
    }
  `; // ALMACEN IB2B + BULTOS > 0

  query += '  orderBy: pal_matricula_ASC';
  return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
    const containers: string[] = palets.map((p) => p.pal_matricula);
    console.log(`Contenedores encontrados: ${containers}`);
    expect(containers, 'Deberian haber contenedores').not.to.be.empty;
    const containerSelected: string = containers[0];

    cy.disconnectAllRadios().connectRadio({ localizacion, profile: 'Ubicado' }).taskSelect(['Ubicación', 'Guiada', 'Caja/Palet']);

    const rFGuidedLocationPage: RFGuidedLocationPage = new RFGuidedLocationPage();
    rFGuidedLocationPage.insertContainer(containerSelected);
    rFGuidedLocationPage.confirmDestination();

    query = `where: { pal_matricula: "${containerSelected}" }  orderBy: pal_matricula_ASC`;
    return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
      const beforeWarehouse = warehouse.toString();
      const afterWarehouse = palets[0].pal_alm_situ!.almi_desc_corta.toString();

      cy.bLog({
        msg: {
          message: beforeWarehouse !== afterWarehouse ? `Se cambio el almacen de la caja/palet con exito.` : 'Fail: no se cambio el almacen de la caja/palet.',
          antes: beforeWarehouse,
          despues: afterWarehouse,
        },
      });

      expect(beforeWarehouse, 'Se deberia haber cambiado el almacen de la caja/palet').to.be.not.equal(afterWarehouse);
      rFGuidedLocationPage.exit();
    });
  });
});
