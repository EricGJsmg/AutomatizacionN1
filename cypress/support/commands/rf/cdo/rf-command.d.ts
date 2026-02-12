/// <reference types="cypress" />
import { ExactLocation } from '../../../../support/services/gql/gql-types';

/** ====== RF-CDO ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** RF: returns new container, code: 1 (SSCC) | 2 (EAN128) | 20 (99) | null (SSCC) */
      newContainer(options: { code?: 1 | 2 | 20 | null; type?: number; localizacion?: number; dispositivo?: number } = {}): Cypress.Chainable<string>;
      /** RF: disconnect all radios in all sites */
      disconnectAllRadios(options?: { username?: string }): Cypress.Chainable<any>;
      /** RF: log in and connect to a radio (radio = undefined || 0 = new available radio) */
      connectRadio(options: { localizacion?: number; profile?: string } = {}): Cypress.Chainable<any>;
      /** RF: get available radio in location */
      getAvailableRadios(options: { localizacion?: number; warehouse?: number }): Cypress.Chainable<any>;
      /** RF: select radio links <a> with text */
      taskSelect(tasks: string[]): Cypress.Chainable<any>;
      /** RF: ensure start route */
      ensureStartRoute(options: { expectedMenu: string; fullRoute: string[] }): Cypress.Chainable<any>;
      /** RF: open new pallet */
      consolidationOpenPallet(options: { destination: string; matricula: string; warehouse: string; station: string; type: string; orderId: string }): Cypress.Chainable<any>;
      consolidate(options: { container: string; warehouse?: string; position?: string }): Cypress.Chainable<any>;
      /** RF: go to start page to consolidate pallet */
      startConsolidate(): Cypress.Chainable<any>;
      /** RF: confirm warehouse and position */
      consolidateConfirmWarehouse(options: { order: string; warehouse: string; position: string }): Cypress.Chainable<any>;
      /** RF: confirm destination container (generated container in packing) */
      consolidateConfirmContainer(options: { order: string; packingDestinationContainer: string }): Cypress.Chainable<any>;
      /** RF: close consolidation container */
      consolidationClosePallet(options: { matricula: string }): Cypress.Chainable<any>;
      /** RF: store the container */
      consolidationPutaway(options: { matricula: string }): Cypress.Chainable<any>;
      /** RF: get containers that match the shipping routes, container.route === shipment.route  */
      getAssignmentData(options: { orders: any[]; createdShipments: any[] }): Cypress.Chainable<any>;
      /** RF: assign container to shipment */
      assignToShipment(options: { id: string; matricula: string; route: string }): Cypress.Chainable<any>;
      /** RF: go through series and full picking */
      picking(options: { targetWave: string; type: 'SINGLE' | 'MULTI' | 'BATCH'; localizacion: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** RF: pick each material */
      pickMaterial(options: { wave: string; type: 'SINGLE' | 'MULTI' | 'BATCH'; localizacion: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** RF: associate material */
      associated(options: { container: string; orders: { id: string; articulos: string[] }[]; localizacion?: number; dispositivo?: number }): Cypress.Chainable<any>;
      /** RF: gets order lines, returns { orders: { id: string; articulos: string[] }, container } */
      getOrderLinesMerged(options: { container: string; localizacion?: number }): Cypress.Chainable<any>;
      /** RF: set header language */
      setAcceptLanguage(language: 'es' | 'en'): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Prenda a prenda */
      guidedLocationPrendaAPrenda(options: { localizacion?: number; warehouse: number | string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Artículo+Cantidad */
      guidedLocationArticuloCantidad(options: { localizacion?: number; warehouse: number | string; quantity: number; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Guiado-Caja/Palet */
      guidedLocationCajaPalet(options: { localizacion?: number; warehouse: number | string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Inbound-Unload */
      unloadAsn(options: { localizacion?: number; entrada: number; container: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Prenda a prenda */
      manualLocationPrendaAPrenda(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Artículo+Cantidad */
      manualLocationArticuloCantidad(options: { localizacion?: number; warehouse: number | string; position: string; quantity: number; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Caja/Palet */
      manualLocationCajaPalet(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: Ubicado-Manual-Bulto */
      manualLocationBulto(options: { localizacion?: number; warehouse: number | string; position: string; container?: string }): Cypress.Chainable<any>;
      /** RF: relocate stock */
      relocateStock(options: { article: string; origin: ExactLocation; destination: ExactLocation }): Cypress.Chainable<any>;
      /** RF: relocate stock */
      getPickingRadioRoute(options: { type: 'SINGLE' | 'MULTI' | 'BATCH' }): Cypress.Chainable<any>;
    }
  }
}

export {};
