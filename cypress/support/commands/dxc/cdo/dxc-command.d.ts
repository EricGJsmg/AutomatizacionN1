/// <reference types="cypress" />

/** ====== DXC-CDO ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** DXC: get orders and increment material. If prefix matches an existing order exactly, uses it; otherwise creates new orders */
      addPrepareOrders(options: { prefix?: string; quantity?: number; article?: string }): Cypress.Chainable<any>;
      /** DXC: validate current location with relative path */
      dxcValidateLocation(options: { relPath: string; haveFilters?: boolean }): Cypress.Chainable<any>;
      /** DXC: get open orders */
      getOrders(options: { prefix?: string; quantity?: number; localizacion?: number } = {}): Cypress.Chainable<any>;
      /** DXC: increment orders material */
      incrementMaterials(options: { orders: string[]; quantity?: number; localizacion?: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** DXC: visit packing page and insert picking container */
      startPacking(options: { container: string }): Cypress.Chainable<any>;
      /** DXC: generate {articulos:[string],container:string} to scan in packing */
      mergeMaterials(materials: any[]): Cypress.Chainable<any>;
      /** DXC: pack an order */
      packContainer(options?: { type: string; container: string; articulos: string[]; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: scan each picking item */
      packingScanItems(options: { pickingMaterials: string[] }): Cypress.Chainable<any>;
      /** DXC: insert container type on packing */
      packingInsertContainerType(options: { type: string }): Cypress.Chainable<any>;
      /** DXC: log generated packing container and finish packing */
      finishPacking(): Cypress.Chainable<any>;
      /** DXC: get order verification status (when interface was sended on packing) */
      getPackingStatus(options: { orderId: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get expedition status (when interface was sended on close expedition) */
      getExpeditionStatus(options: { id: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: create shipment, need printer (packing workstation name) and destination obtained when the pallet was opened */
      createShipment(options: { printer: string; openPaletDestinationL1: string }): Cypress.Chainable<any>;
      /** DXC: full close shipment (complete/print/close) and verify expedition interface status, should be EXP_CERRADA */
      closeShipment(options: { id: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: log order destination */
      getOrderDestination(options: { orderId: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: lauch wave as SINGLE | MULTI | BATCH */
      launchWave(options: { wave: string; type: 'SINGLE' | 'MULTI' | 'BATCH'; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: assign orders to wave (create, or specify the wave) */
      assignOrdersToWave(options: { orders: string[]; note?: string; wave?: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: validate stopped processes and log in DB */
      validateProcesses(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get available associated positions */
      getAssociateAvailablePositions(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get serie status  */
      getSerieStatus(options: { wave: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get stock  */
      getStock(options: { order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get salida  */
      getSalidas(options: { serie: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get batch order  */
      getBatchPedido(options: { pedido: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get num batch and batch subtype */
      getBatchSubtype(options: { batch: number; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Descarga de la serie  */
      generateContentString(options: { pedido: string; codigoSalida: number; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: Post Descarga de la serie  */
      postdescarga(options: { salida: number; order: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get pedido status  */
      getOrderStatus(options: { pedido: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get container status  */
      getContainerStatus(options: { container: string; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: get shipment status  */
      getShipmentStatus(options: { shipment: number; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: ensure stat of ORDER | WAVE | CONTAINER  */
      ensureStat(options: { expectedStatus?: string; code: string; type?: 'ORDER' | 'WAVE' | 'CONTAINER' | 'SHIPMENT'; localizacion?: number }): Chainable<any>;
      /** DXC: disconnect especific node in location */
      disconnectNode(options: { localizacion?: number; node: string; dispositivo?: number }): Cypress.Chainable<any>;
      /** DXC: edit pallet to simulate confirmation for sorter */
      confirmSorter(options: { localizacion?: number; containers: string[] }): Cypress.Chainable<any>;
      /** DXC: material adjust */
      adjustMaterials(options: { localizacion?: number; dispositivo?: number; artiExtCods: string[]; quantity: number }): Cypress.Chainable<any>;
      /** DXC: create palet with n same material */
      newPaletWithMaterial(options: { localizacion?: number; dispositivo?: number; article: string; quantity: number; warehouse: number | string; position: string }): Cypress.Chainable<any>;
      /** DXC: get available asn id (last asn + 1) */
      getAvailableAsnId(options: { localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: create ASN */
      createAsn(options: { site: string; dispositivo?: number; localizacion?: number }): Cypress.Chainable<any>;
      /** DXC: open ASN */
      openAsn(options: { localizacion?: number; dispositivo?: number; warehouse: string | number; entrada: number; elemento: string }): Cypress.Chainable<any>;
      /** DXC: launch ASN */
      launchAsn(options: { localizacion?: number; dispositivo?: number; entrada: number }): Cypress.Chainable<any>;
      /** DXC: get warehouses */
      getWarehouses(options: { localizacion?: number; warehouse: string | number }): Cypress.Chainable<any>;
      /** DXC: order item returns */
      itemReturn(options: { dispositivo?: number; localizacion?: number; container: string; order: string }): Cypress.Chainable<any>;
      /** DXC: order item returns */
      returnScannItems(options: { dispositivo?: number; localizacion?: number; order: string }): Cypress.Chainable<any>;
      /** DXC: connect to puesto only need loc and node (ex. PC_SILO) */
      puestoConnect(options: { localizacion?: number; node: string }): Cypress.Chainable<any>;
      /** DXC: get puesto connected */
      getPuesto(): Cypress.Chainable<any>;
      /** DXC: orders creation */
      createOrder(options: { article: string; ordersQty?: number; prefix?: string }): Cypress.Chainable<string[]>;
    }
  }
}

export {};
