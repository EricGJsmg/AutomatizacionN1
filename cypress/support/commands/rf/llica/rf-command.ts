import RFLoginPage from '../../../../pages/llica/rf-login-page';
import GqlService from '../../../services/gql/gql-service';
import { OrderLine, Radio } from '../../../services/gql/gql-types';

Cypress.Commands.add('disconnectAllRadiosLLica', ({ username = Cypress.env('username') } = {}) => {
  return GqlService.getRadios({ localizacion: 1 }).then((radios: any) => {
    console.log('disconnectAllRadiosLLica', { radios });
    const connectedRadios = radios
      .filter((radio: any) => radio.rad_usuario?.usr_codigo === username) // filter the radios that match the user
      .map((radio: any) => radio.rad_codigo);
    console.log({ connectedRadios });
    if (connectedRadios?.length) {
      GqlService.disconnectAllRadios({ localizacion: 1, dispositivo: 99900, radios: connectedRadios }).then(() => {
        cy.wrap(connectedRadios).each((radio: number) => {
          GqlService.clearRadio({ localizacion: 1, radio });
        });
      });
    }
  });
});

Cypress.Commands.add('newContainerLlica', ({ code = null, type = 100, localizacion, dispositivo } = {}) => {
  return cy.then(() => GqlService.getNewContainer({ code, type, localizacion, dispositivo }));
});

Cypress.Commands.add('getAvailableRadiosLlica', ({ localizacion, warehouse } = {}) => {
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

Cypress.Commands.add('connectRadioAsociadoLlica', () => {
  const rLogin = new RFLoginPage();
  return cy
    .log('connectRadioAsociado')
    .then(() => rLogin.login())
    .then(() => rLogin.radioOk())
    .taskSelectLlica(['Associate'])
    .taskSelectLlica(['Associate']);
});

Cypress.Commands.add('taskSelectLlica', (tasks: string[]) => {
  const rLogin = new RFLoginPage();
  return cy
    .log('taskSelect')
    .wrap(tasks)
    .each((task: string) => rLogin.selectTask(task));
});

// fullRoute: full path from #MENU
Cypress.Commands.add('ensureStartRouteLlica', ({ expectedMenu, fullRoute } = {}) => {
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

Cypress.Commands.add('getOrderLinesMergedLlica', ({ container, localizacion } = {}) => {
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

Cypress.Commands.add('setAcceptLanguageLlica', (language) => {
  return cy
    .intercept(/103:.*ords|ords.*103:/, (req) => {
      req.headers['accept-language'] = language;
    })
    .as('language: ' + language);
});

Cypress.Commands.add('getPickingRadioRouteLlica', ({ type } = {}) => {
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
