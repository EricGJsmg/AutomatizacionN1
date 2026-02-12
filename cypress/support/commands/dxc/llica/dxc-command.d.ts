/// <reference types="cypress" />

/** ====== DXC-LLICA ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** DXC: get orders and increment material Lliça */
      addPrepareOrdersLlica(options: { prefix?: string; quantity?: number; localizacion?: number; dispositivo?: number } = {}): Cypress.Chainable<any>;
      /** DXC: lauch wave PS Llica */
      launchWaveLlica(options: { wave: string; type: 'PS'; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: assign orders to wave (create, or specify the wave) Llica */
      assignOrdersToWaveLlica(options: { orders: string[]; note?: string; wave?: string; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: command to log in to DXC Lliça */
      loginDXCLlica(options?: { username: string; password: string; node: string }): Cypress.Chainable<any>;
      /** DXC: Pack Content orders Llica */
      packContent(options: { order: string; type: string; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: Packing Content orders befor report shortage Llica */
      packKanguro(options: { skus: anu[]; order: string; orderOrigin: string; type: string; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: Pack Content con Falta orders Llica */
      packContentFalta(options: { order: string; type: string; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: Pack Content con Falta parcial orders Llica */
      packContentFaltaParcial(options: { order: string; localizacion: number; kanguro: string }): Cypress.Chainable<any>;
      /** DXC: Pack Content multibulto orders Llica */
      packContentMultibulto(options: { order: string; type: string; localizacion: number }): Cypress.Chainable<any>;
      /** DXC: Confirm Automatic Movement Orders Llica */
      confirmAutomaticMovementOrders(options: { orderMvAut: string }): Cypress.Chainable<any>;
      /** DXC: edit pallet to simulate confirmation for sorter */
      confirmSorterLlica(options: { localizacion: number; containers: any[] }): Cypress.Chainable<any>;
      /** DXC: add materials  */
      addMaterialsLlica(options: { order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Move Containers to Warhouse position Llica */
      moveToWarhousePosition(options: { containers: any[]; warhouse: string; position: string }): Cypress.Chainable<any>;
      /** DXC: Move palet to Warhouse position Llica */
      moveToWarhousePalet(options: { container: any; warhouse: string; position: string }): Cypress.Chainable<any>;
      /** DXC: Move Containers to Incompleted Inbound Llica */
      moveToIncompletInbound(options: { container: any; position: string }): Cypress.Chainable<any>;
      /** DXC: Move Containers to Palet Llica */
      changeCajaToPalet(options: { warhouse?: string; prefix?: string; typePalet?: string; container: string; position: string; matricula: string }): Cypress.Chainable<any>;
      /** DXC: Move Containers to Palet Llica */
      changeToPalet(options: { warhouse?: string; prefix?: string; typePalet?: string; containers: any[]; position: string; matricula: string }): Cypress.Chainable<any>;
      /** DXC: get stock  */
      getStock(options: { order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get info order  */
      getPedidoInfo(options: { order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get transportista  */
      getTransportista(options: { order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get matricula pallets  */
      getMatriculasPalet(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get almacen container  */
      getAlmacenContainer(options: { localizacion?: number; container: string }): Cypress.Chainable<any>;
      /** DXC: get multibulto container  */
      getMultiBultoContainer(options: { localizacion?: number; order: string }): Cypress.Chainable<any>;
      /** DXC: get matricula Kanguros  */
      getMatriculasKanguro(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get matriculas Caja Grande  */
      getMatriculasCajaGrande(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: generate matricula pallets  */
      generarMatricula(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: generate matricula Kanguro  */
      generarMatriculaKanguro(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: generate matricula pallets  */
      generarMatriculaTienda(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: create shipment  */
      creatShipment(options: { order: string; localizacion?: number; palet: string }): Cypress.Chainable<any>;
      /** DXC: create shipment tienda */
      creatShipmentTienda(options: { order: string; localizacion?: number; palet: string }): Cypress.Chainable<any>;
      /** DXC: Assign Palet to expedition Llica */
      assignPaletToShipment(options: { shipment: string; palet: string }): Cypress.Chainable<any>;
      /** DXC: Complete close expedition Llica */
      closeShipmentPrint(options: { id: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Complete close expedition tienda Llica */
      closeShipmentPrintTienda(options: { id: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Complete expedition Llica */
      completShipment(): Cypress.Chainable<any>;
      /** DXC: Print expedition Llica */
      printShipment(): Cypress.Chainable<any>;
      /** DXC: Process o cose cells Llica */
      closeCellsLlica(): Cypress.Chainable<any>;
      /** DXC: log generated packing container and finish packing Llica */
      finishPackingLlica(): Cypress.Chainable<any>;
      /** DXC: log generated packing container and finish packing Llica */
      firstPackingMultibulto(): Cypress.Chainable<any>;
      /** DXC: get expedition status Llica (when interface was sended on close expedition) */
      getExpeditionStatusLlica(options: { id: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get packing status Llica (when interface was sended on close expedition) */
      getPackingStatusLlica(options: { orderId: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get packing status Llica Falta total (when interface was sended on close expedition) */
      getPackingStatusFaltaTotal(options: { orderId: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: disconnect especific node in location */
      disconnectNodeLlica(options: { localizacion?: number; node?: string; dispositivo: number }): Cypress.Chainable<any>;
      /** DXC: mover contenedor a entrada sorter B2C */
      moverContenedoEntSorterB2c(options: { localizacion?: number; contenedor: string }): Cypress.Chainable<any>;
      /** DXC: Simular etiquetas y albarán de pedido con falta parcial */
      simularEtiquetasAlbaran(options: { localizacion?: number; order: string }): Cypress.Chainable<any>;
      /** DXC: command to disconnect node and log in to DXC Lliça */
      disconnectLoginDXCLlica(options?: { username: string; password: string; node: string; dispositivo: number }): Cypress.Chainable<any>;
      /** DXC: Descargas de la serie  */
      descargasWave(options: { serie: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Accept shortage total */
      acceptShortageTotal(options: { orderId: string; serie: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Accept shortage parcial */
      acceptShortageParcial(options: { orderId: string; serie: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: log generated packing container and finish packing Llica */
      iterarOutputsLines(): Cypress.Chainable<any>;
      /** DXC: finish packing con falta Llica */
      finishFaltaLlica(): Cypress.Chainable<any>;
      /** DXC: finish packing con falta parcial Llica */
      finishFaltaParcialLlica(): Cypress.Chainable<any>;
      /** DXC: process associated con falta parcial Llica */
      associatedLlica(options: { materials: any[]; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get open orders */
      getOrdersLlica(options: { prefix?: string; quantity?: number; localizacion?: number } = {}): Cypress.Chainable<any>;
    }
  }
}

export {};
