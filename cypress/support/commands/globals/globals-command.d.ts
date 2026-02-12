/// <reference types="cypress" />

/** ====== Globals ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** Globals: ensure button be: exist, visible, clickable */
      validButton(selector: string): Cypress.Chainable<any>;
      /** Globals: return text of element */
      getText(selector: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable<string>;
      /** Globals: get input by placeholder */
      getInput(placeholder: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable<any>;
      /** Globals: get button by text */
      getButton(text: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable<any>;
      /** Globals: remove local storage key, exp. cy.removeKey('accessToken') */
      removeKey(key: string): Cypress.Chainable<any>;
      /** Globals: get memory usage info (current used/current limit - full limit assigned) */
      getMemoryInfo(label?: string): Cypress.Chainable<string>;
      /** Globals: generic get to get control whith many selectors, selectors:'#selector1, #selector2' */
      getControl(selectors: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable<any>;
      /** Globals: for backend logs (terminal, jenkins...)' */
      bLog(options: { msg: any; head?: boolean; saveInFile?: boolean }): Cypress.Chainable<any>;
    }
  }
}

export {};
