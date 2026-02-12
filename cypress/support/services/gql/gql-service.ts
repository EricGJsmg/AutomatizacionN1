import {
  login,
  doCrearMatricula,
  doLanzarSerie,
  doDesconectarRadio,
  getBultos,
  doAjustarCantidadBulto,
  getPedidosArtiCodExt,
  getOrdersWithPrefix,
  getShPedidosCdo,
  getShExpedicionesCdo,
  getProcesos,
  getRelacionesPosiciones,
  getLineasPedido,
  getSeries,
  getStatPedido,
  getStatContainer,
  getStatShipment,
  updPalet,
  getOrdenMovimiento,
  delOrdenesMovimiento,
  getOrder,
  getPalets,
  doClearRadio,
  getRadios,
  doCrearContenedorConStock,
  getEntradas,
  doAbrirEntrada,
  doLanzarEntrada,
  getHsEnts,
  getAlmacenes,
  getSalidasQr,
  getBatchPed,
  getBatchSub,
  getPedidosDevolucionSap,
  getDispsAsignados,
  doConectarPuesto,
  getPedidos,
  getShExpediciones,
  getShPedidos,
  getLocalizaciones,
  doCrearPedido,
  getHsPeds,
  doMoverContenedor,
  doSimulateLabel,
} from './gql-mapper';
import {
  AjustarCantidadBultoResponse,
  CrearMatriculaResponse,
  DesconectarRadioResponse,
  GetBultosResponse,
  GetPedidosResponse,
  RadiosResponse,
  LanzarSerieResponse,
  LoginResponse,
  GetPedidosWithPrefixResponse,
  Order,
  GetShPedidosResponse,
  GetShExpedicionesResponse,
  GetProcesosResponse,
  GetPaletsResponse,
  Palet,
  Process,
  GetRelacionesPosicionesResponse,
  Posicion,
  GetContainerResponse,
  Container,
  GetOrderResponse,
  GetSerieResponse,
  Serie,
  GetShipmentResponse,
  Shipment,
  UpdatePaletResponse,
  GetOrdenesMovimientoResponse,
  OrderMovement,
  DelOrdenesMovimiento,
  ClearRadioResponse,
  GetSalidasResponse,
  GetBatchPedidoResponse,
  GetBatchSubResponse,
  Puesto,
  GetLocalizacionesResponse,
  GetHsPedidosResponse,
  moverContenedorResponse,
  simulateLabelResponse,
} from './gql-types';

class GqlService {
  private static cachedToken?: string;
  public static puesto: Puesto;

  static request<T>(params: { query: string; url?: string }): Cypress.Chainable<any> {
    const url = params.url ?? (Cypress.env('graphUrl') as string);
    return GqlService.getToken(params).then((token: string) => {
      return cy
        .request({
          url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ query: params.query }),
          timeout: 180000,
          failOnStatusCode: false,
        })
        .then((response: Cypress.Response<any>) => {
          const sErrors: number[] = [500, 501, 502, 503, 504, 505];
          const cErrors: number[] = [400, 401, 403, 404, 405, 406, 409];

          cy.then(() => {
            if ([...sErrors, ...cErrors].includes(response.status)) {
              cy.bLog({
                msg: {
                  error: `GraphQL status ${response.status} - ${response.statusText}`,
                  request: { url, query: params.query, token },
                  response,
                },
              });
            }
          });

          cy.then(() => {
            expect(response.status, `Disponibilidad de GraphQL: ${response.statusText}`).not.to.be.oneOf(sErrors);
            expect(response.status, `Estado de la consulta: ${response.statusText}`).not.to.be.oneOf(cErrors);
            return response.body?.data as T;
          });
        });
    });
  }

  static getToken({
    username = Cypress.env('username'),
    password = Cypress.env('password'),
    url,
    tokenOnly,
  }: {
    username?: string;
    password?: string;
    url?: string;
    tokenOnly?: boolean;
  }): Cypress.Chainable<string> {
    if (tokenOnly) {
      return cy
        .request({
          url,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: login({ username, password }) }),
        })
        .then((response: Cypress.Response<any>) => {
          const data = response.body?.data as LoginResponse;
          return data?.doLogin?.token;
        });
    } else {
      if (GqlService.cachedToken) return cy.wrap(GqlService.cachedToken);
      return cy
        .request({
          url: url ?? (Cypress.env('graphUrl') as string),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: login({ username, password }) }),
        })
        .then((response: Cypress.Response<any>) => {
          const data = response.body?.data as LoginResponse;
          if (data?.doLogin?.token) {
            console.warn({ GqlServiceToken: data.doLogin.token });
            GqlService.cachedToken = data.doLogin.token;
            return GqlService.cachedToken;
          }
          throw new Error('No se estableció el token.');
        });
    }
  }

  static getNewContainer(
    params: {
      localizacion?: number;
      dispositivo?: number;
      type?: number;
      code?: 1 | 2 | 20 | null;
    } = {},
  ): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<CrearMatriculaResponse>({
        query: doCrearMatricula({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: CrearMatriculaResponse) => {
        if (data?.doCrearMatricula) {
          return cy.wrap(data.doCrearMatricula.pal_matricula as string);
        } else return cy.wrap(undefined);
      });
    });
  }

  static launchWave(params: { localizacion?: number; dispositivo?: number; serCodigo: string }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<LanzarSerieResponse>({
        query: doLanzarSerie({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: LanzarSerieResponse) => {
        if (data?.doLanzarSaerie) {
          return cy.wrap(data.doLanzarSaerie.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static getRadios(params: { localizacion?: number } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<RadiosResponse>({
        query: getRadios({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: RadiosResponse) => {
        if (data?.getRadios.length) {
          return cy.wrap(data.getRadios as []);
        } else return cy.wrap([]);
      });
    });
  }

  static disconnectAllRadios(params: { localizacion?: number; dispositivo?: number; radios: number[] }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<DesconectarRadioResponse>({
        query: doDesconectarRadio({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: DesconectarRadioResponse) => {
        if (data?.doDesconectarRadio) {
          return cy.wrap(data.doDesconectarRadio.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static clearRadio(params: { localizacion?: number; radio: number }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<ClearRadioResponse>({
        query: doClearRadio({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: ClearRadioResponse) => {
        if (data?.doClearRadio) {
          return cy.wrap(data.doClearRadio.success === true);
        } else return cy.wrap(false);
      });
    });
  }

  static moverContenedor(params: { localizacion?: number; contenedor: string }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<moverContenedorResponse>({
        query: doMoverContenedor({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: moverContenedorResponse) => {
        if (data?.doEjecutarAccion) {
          return cy.wrap(data.doEjecutarAccion.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static simularEtiAlbaran(params: { localizacion?: number; order: string }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<simulateLabelResponse>({
        query: doSimulateLabel({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: simulateLabelResponse) => {
        if (data?.doEjecutarAccion) {
          return cy.wrap(data.doEjecutarAccion.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static getBultos(params: { localizacion?: number; query: string }): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetBultosResponse>({
        query: getBultos({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetBultosResponse) => {
        if (data?.getBultos.length) {
          return cy.wrap(data.getBultos as []);
        } else return cy.wrap([]);
      });
    });
  }

  static ajustarCantidadBulto(params: { localizacion?: number; dispositivo?: number; bul_numero: number; materialQuantity: number }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<AjustarCantidadBultoResponse>({
        query: doAjustarCantidadBulto({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
          bulNumero: params.bul_numero,
        }),
      }).then((data: any) => {
        if (data?.doAjustarCantidadBulto) {
          return cy.wrap(data.doAjustarCantidadBulto.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  /** get materials of orders (material external code) */
  static getMaterialsByOrder(params: { localizacion?: number; orders: string[] }): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetPedidosResponse>({
        query: getPedidosArtiCodExt({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetPedidosResponse) => {
        if (data?.getPedidos.length === params.orders.length) {
          const artiExtCods: string[] = data.getPedidos.map((pedido: any) => pedido.lineas_pedido.map((articulo: any) => articulo.lped_articulo.arti_cod_ext)).flat();
          if (artiExtCods?.length) {
            return cy.wrap(artiExtCods);
          } else console.warn(`No se encontraron articulos en ${params.orders}`);
        } else console.warn(`No se encontraron todos los pedidos, pedidos: ${params.orders}`);
        return cy.wrap([]);
      });
    });
  }

  static getOrdersWithPrefix(params: { localizacion?: number; prefix: string; quantity: number }): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetPedidosWithPrefixResponse>({
        query: getOrdersWithPrefix({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getPedidos.length) {
          return cy.wrap(data.getPedidos.map((pedido: Order) => pedido.ped_num_host) as string[]);
        } else return cy.wrap([]);
      });
    });
  }

  static getVerificationStatus(params: { localizacion?: number; orderId: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetShPedidosResponse>({
        query: getShPedidosCdo({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetShPedidosResponse) => {
        if (data?.getShPedidos.length) {
          return cy.wrap({ status: data.getShPedidos[0].shped_evento.evifazi_define });
        } else return cy.wrap({ status: 'INTERFACE_NOT_FOUND' });
      });
    });
  }

  static getExpeditionStatus(params: { localizacion?: number; shipment: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetShExpedicionesResponse>({
        query: getShExpedicionesCdo({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetShExpedicionesResponse) => {
        if (data?.getShExpediciones.length) {
          return cy.wrap({ status: data.getShExpediciones[0].shexp_evento.evifazi_define });
        } else return cy.wrap({ status: 'INTERFACE_NOT_FOUND' });
      });
    });
  }

  static getProcesses(params: { localizacion?: number } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetProcesosResponse>({
        query: getProcesos({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetProcesosResponse) => {
        if (data?.getProcesos.length) {
          return cy.wrap(data.getProcesos as Array<Process>);
        } else return cy.wrap([]);
      });
    });
  }

  static getPalets(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetPaletsResponse>({
        query: getPalets({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetPaletsResponse) => {
        if (data?.getPalets.length) {
          return cy.wrap(data.getPalets as Array<Partial<Palet>>);
        } else return cy.wrap([]);
      });
    });
  }

  static getRelaciones(params: { localizacion?: number } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetRelacionesPosicionesResponse>({
        query: getRelacionesPosiciones({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetRelacionesPosicionesResponse) => {
        if (data?.getRelacionesPosiciones.length) {
          return cy.wrap(data.getRelacionesPosiciones as Array<Posicion>);
        } else return cy.wrap([]);
      });
    });
  }

  static getWaveStatus(params: { localizacion?: number; wave: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetSerieResponse>({
        query: getSeries({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetSerieResponse) => {
        if (data && data.getSeries.length) {
          return cy.wrap((data.getSeries[0] as Serie).ser_estado.ei_desc_corta || undefined);
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getOrderStatus(params: { localizacion?: number; pedido: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetOrderResponse>({
        query: getStatPedido({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetOrderResponse) => {
        if (data && data.getPedidos.length) {
          return cy.wrap((data.getPedidos[0] as Order).ped_estado.ei_desc_corta || undefined);
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getContainerStatus(params: { localizacion?: number; container: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetContainerResponse>({
        query: getStatContainer({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetContainerResponse) => {
        if (data && data.getPalets.length) {
          return cy.wrap((data.getPalets[0] as Container).pal_estado.ei_desc_corta || undefined);
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getShipmentStatus(params: { localizacion?: number; shipment: number }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetShipmentResponse>({
        query: getStatShipment({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetShipmentResponse) => {
        if (data && data.getExpediciones.length) {
          return cy.wrap((data.getExpediciones[0] as Shipment).exp_estado.ei_desc_corta || undefined);
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static updatePalet(params: { localizacion?: number; currentPalet: Partial<Palet>; editedPalet: Partial<Palet> }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<UpdatePaletResponse>({
        query: updPalet({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: UpdatePaletResponse) => {
        if (data?.updPalets.length) {
          return cy.wrap(data.updPalets[0].exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static getOrderMovement(params: { localizacion?: number; container: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetOrdenesMovimientoResponse>({
        query: getOrdenMovimiento({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetOrdenesMovimientoResponse) => {
        if (data.getOrdenesMovimiento.length) {
          return cy.wrap(data.getOrdenesMovimiento[0] as Partial<OrderMovement>);
        } else return cy.wrap(undefined);
      });
    });
  }

  static deleteOrderMovement(params: { localizacion?: number; currentOma: Partial<OrderMovement> }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<DelOrdenesMovimiento>({
        query: delOrdenesMovimiento({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: DelOrdenesMovimiento) => {
        if (data?.delOrdenesMovimiento.length) {
          return cy.wrap(data.delOrdenesMovimiento[0].exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static getOrder(params: { localizacion?: number; order: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetPedidosResponse>({
        query: getOrder({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getPedidos.length) {
          return cy.wrap(data.getPedidos[0] as Partial<Order>);
        } else return cy.wrap(undefined);
      });
    });
  }

  static getLineasPedido(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getLineasPedido({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getLineasPedido.length) {
          return cy.wrap(data.getLineasPedido as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getShExpediciones(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getShExpediciones({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        console.log(data);
        if (data?.getShExpediciones.length) {
          return cy.wrap(data.getShExpediciones as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getShPedidos(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getShPedidos({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getShPedidos.length) {
          return cy.wrap(data.getShPedidos as []);
        } else return cy.wrap([]);
      });
    });
  }

  static createContainerWithMaterial(params: {
    localizacion?: number;
    dispositivo?: number;
    container: string;
    article: string;
    quantity: number;
    warehouse: number;
    position: string;
  }): Cypress.Chainable<boolean> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: doCrearContenedorConStock({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.doCrearContenedorConStock) {
          return cy.wrap(data.doCrearContenedorConStock.exito === true);
        } else return cy.wrap(false);
      });
    });
  }

  static getEntradas(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getEntradas({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getEntradas.length) {
          return cy.wrap(data.getEntradas as []);
        } else return cy.wrap([]);
      });
    });
  }

  static abrirEntrada(params: { localizacion?: number; dispositivo?: number; entrada: number; warehouse: number; elemento: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: doAbrirEntrada({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.doAbrirEntrada) {
          return cy.wrap(data.doAbrirEntrada);
        } else return cy.wrap(undefined);
      });
    });
  }

  static lanzarEntrada(params: { localizacion?: number; dispositivo?: number; entrada: number }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: doLanzarEntrada({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.doLanzarEntrada) {
          return cy.wrap(data.doLanzarEntrada);
        } else return cy.wrap(undefined);
      });
    });
  }

  static inboundInterfaceReceiptsVerification(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getHsEnts({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getHsEnts.length) {
          return cy.wrap(data.getHsEnts as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getAlmacenes(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getAlmacenes({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getAlmacenes.length) {
          return cy.wrap(data.getAlmacenes as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getSalidas(params: { localizacion?: number; serie: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetSalidasResponse>({
        query: getSalidasQr({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetSalidasResponse) => {
        console.log({ data });
        if (data && data.getSalidas.length) {
          return cy.wrap(
            data.getSalidas.map((sal: any) => ({
              codigoSalida: sal.sal_codigo,
              pedido: sal.sal_pedido.ped_num_host,
            })),
          );
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getBatchPedido(params: { localizacion?: number; pedido: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetBatchPedidoResponse>({
        query: getBatchPed({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetBatchPedidoResponse) => {
        console.log({ data });
        if (data && data.getPedidos.length) {
          return cy.wrap(
            data.getPedidos.map((bat) => ({
              batchPedido: bat.ped_numaux5,
            })),
          );
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getBatchsub(params: { localizacion?: number; batch: number }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetBatchSubResponse>({
        query: getBatchSub({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: GetBatchSubResponse) => {
        console.log({ data });
        if (data && data.getMaestrosTiposBatch.length) {
          return cy.wrap(
            data.getMaestrosTiposBatch.map((bat) => ({
              batchNum: bat.mtbi_host1,
              subType: bat.mtbi_host2,
            })),
          );
        } else {
          return cy.wrap(undefined);
        }
      });
    });
  }

  static getPedidosDevolucionSap(params: { localizacion?: number; dispositivo?: number; order: string }): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getPedidosDevolucionSap({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.getPedidosDevolucionSap?.exito === true && data.getPedidosDevolucionSap.pedidosDevolucionSap.length) {
          return cy.wrap(data.getPedidosDevolucionSap.pedidosDevolucionSap as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getDispsAsignados(params: { localizacion?: number; query?: string } = {}): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: getDispsAsignados({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
        }),
      }).then((data: any) => {
        if (data?.getDispsAsignados.length) {
          return cy.wrap(data.getDispsAsignados as []);
        } else return cy.wrap([]);
      });
    });
  }

  static doConectarPuesto(params: { localizacion?: number; dispositivo?: number; node: string }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: doConectarPuesto({
          ...puesto,
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.doConectarPuesto) {
          return cy.wrap(data.doConectarPuesto as any);
        } else return cy.wrap(undefined);
      });
    });
  }

  static getPedidos(params: { localizacion?: number | null; query: string }): Cypress.Chainable<[]> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<GetPedidosResponse>({
        query: getPedidos({
          ...puesto,
          ...params,
          localizacion: params.localizacion === null ? null : (params.localizacion ?? puesto.localizacion),
        }),
      }).then((data: GetPedidosResponse) => {
        if (data?.getPedidos.length) {
          return cy.wrap(data.getPedidos as []);
        } else return cy.wrap([]);
      });
    });
  }

  static getLocalizaciones(): Cypress.Chainable<[]> {
    return GqlService.request<GetLocalizacionesResponse>({ query: getLocalizaciones() }).then((data: GetLocalizacionesResponse) => {
      if (data?.getLocalizaciones.length) {
        return cy.wrap(data.getLocalizaciones as []);
      } else return cy.wrap([]);
    });
  }

  static crearPedido(params: { localizacion?: number; dispositivo?: number; order: string; type: number; date: string; article: string; quantity: number }): Cypress.Chainable<any> {
    return cy.getPuesto().then((puesto: Puesto) => {
      return GqlService.request<any>({
        query: doCrearPedido({
          ...params,
          localizacion: params.localizacion ?? puesto.localizacion,
          dispositivo: params.dispositivo ?? puesto.dispositivo!,
        }),
      }).then((data: any) => {
        if (data?.doCrearPedido) {
          return cy.wrap(data.doCrearPedido as any);
        } else return cy.wrap(undefined);
      });
    });
  }

  static getHsPedidos(params: { query: string }): Cypress.Chainable<[]> {
    return GqlService.request<GetHsPedidosResponse>({
      query: getHsPeds(params),
    }).then((data: GetHsPedidosResponse) => {
      if (data?.getHsPeds.length) {
        return cy.wrap(data.getHsPeds as []);
      } else return cy.wrap([]);
    });
  }
}

export default GqlService;
