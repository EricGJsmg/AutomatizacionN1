/// <reference types="cypress" />

/** ====== RF-LLICA ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** RF: returns new container, code: 1 (SSCC) | 2 (EAN128) | 20 (99) | null (SSCC) */
      newContainerLlica(options: { code?: 1 | 2 | 20 | null; type?: number; localizacion?: number; dispositivo?: number } = {}): Cypress.Chainable<string>;
      /** RF: disconnect all radios in all sites */
      disconnectAllRadiosLLica(options?: { username?: string }): Cypress.Chainable<any>;
      /** RF: log in and connect to a radio (radio = undefined || 0 = new available radio) */
      connectRadioAsociadoLlica(options: { radio?: number; localizacion?: number; profile?: string } = {}): Cypress.Chainable<any>;
      /** RF: get available radio in location */
      getAvailableRadiosLlica(options: { localizacion?: number; warehouse?: number }): Cypress.Chainable<any>;
      /** RF: select radio links <a> with text */
      taskSelectLlica(tasks: string[]): Cypress.Chainable<any>;
      /** RF: ensure start route */
      ensureStartRouteLlica(options: { expectedMenu: string; fullRoute: string[] }): Cypress.Chainable<any>;
      /** RF: open new pallet */
      consolidationOpenPalletLlica(options: { destination: string; matricula: string; warehouse: string; station: string; type: string; orderId: string }): Cypress.Chainable<any>;
      consolidateLlica(options: { container: string; warehouse?: string; position?: string }): Cypress.Chainable<any>;
      /** RF: go to start page to consolidate pallet */
      startConsolidateLlica(): Cypress.Chainable<any>;
      /** RF: confirm warehouse and position */
      consolidateConfirmWarehouseLlica(options: { order: string; warehouse: string; position: string }): Cypress.Chainable<any>;
      /** RF: confirm destination container (generated container in packing) */
      consolidateConfirmContainerLlica(options: { order: string; packingDestinationContainer: string }): Cypress.Chainable<any>;
      /** RF: close consolidation container */
      consolidationClosePalletLlica(options: { matricula: string }): Cypress.Chainable<any>;
      /** RF: store the container */
      consolidationPutawayLlica(options: { matricula: string }): Cypress.Chainable<any>;
      /** RF: get containers that match the shipping routes, container.route === shipment.route  */
      getAssignmentDataLlica(options: { orders: any[]; createdShipments: any[] }): Cypress.Chainable<any>;
      /** RF: assign container to shipment */
      assignToShipmentLlica(options: { id: string; matricula: string; route: string }): Cypress.Chainable<any>;
      /** RF: go through series and full picking */
      pickingLlica(options: { targetWave: string; type: 'SINGLE' | 'MULTI' | 'BATCH'; localizacion: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** RF: pick each material */
      pickMaterialLlica(options: { wave: string; type: 'SINGLE' | 'MULTI' | 'BATCH'; localizacion: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** RF: gets order lines, returns { orders: { id: string; articulos: string[] }, container } */
      getOrderLinesMergedLlica(options: { container: string; localizacion?: number }): Cypress.Chainable<any>;
      /** RF: set header language */
      setAcceptLanguageLlica(language: 'es' | 'en'): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Prenda a prenda */
      guidedLocationPrendaAPrendaLlica(options: { localizacion?: number; warehouse: number | string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Artículo+Cantidad */
      guidedLocationArticuloCantidadLlica(options: { localizacion?: number; warehouse: number | string; quantity: number; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Caja/Palet */
      guidedLocationCajaPaletLlica(options: { localizacion?: number; warehouse: number | string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Inbound-Unload */
      unloadAsnLlica(options: { localizacion?: number; entrada: number; container: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Prenda a prenda */
      manualLocationPrendaAPrendaLlica(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Artículo+Cantidad */
      manualLocationArticuloCantidadLlica(options: { localizacion?: number; warehouse: number | string; position: string; quantity: number; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Caja/Palet */
      manualLocationCajaPaletLlica(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Bulto */
      manualLocationBultoLlica(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: relocate stock */
      relocateStockLlica(options: { article: string; origin: ExactLocation; destination: ExactLocation }): Cypress.Chainable<any>;
      /** RF: relocate stock */
      getPickingRadioRouteLlica(options: { type: 'SINGLE' | 'MULTI' | 'BATCH' }): Cypress.Chainable<any>;
    }
  }
}

export {};
