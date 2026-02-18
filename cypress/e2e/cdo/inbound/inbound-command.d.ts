declare namespace Cypress {
  interface Chainable {
    createContainerWithStock(options?: {
      localizacion?: number;
      dispositivo?: number;
      warehouse?: string | number;
      position?: string;
    }): Cypress.Chainable<string>;
  }
}
