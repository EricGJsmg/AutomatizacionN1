/// <reference types="cypress" />

/** ====== DB ====== */
declare global {
  namespace Cypress {
    interface Chainable {
      /** DB: insert new tests row, clear: previus DB, force: clear test uuid */
      dbStartTest(options?: { clear?: boolean; description?: string; site: string; force?: boolean }): Cypress.Chainable<any>;
      /** DB: delete current uuid to finalize test */
      dbFinishTest(options?: { report?: boolean }): Cypress.Chainable<any>;
      /** DB: log test (it) data */
      dbLogIt(context: Mocha.Context): Cypress.Chainable<any>;
      /** DB: truncate all tables */
      dbClear(): Cypress.Chainable<any>;
      /** DB: get all rows from table */
      dbGetAllFromTable(table: string): Cypress.Chainable<any>;
      /** DB: select from table */
      dbGet(options: { table: string; whereQuery: string; whereParams: any[] }): Cypress.Chainable<any>;
      /** DB: add order rows */
      dbAddOrders(orders: string[]): Cypress.Chainable<any>;
      /** DB: assign orders to wave */
      dbAssignOrdersToWave(options: { orders: string[]; wave: string }): Cypress.Chainable<any>;
      /** DB: returns true if value exists */
      dbValueExist(options: { table: string; whereQuery: string; whereParams: any[] }): Cypress.Chainable<any>;
      /** DB: insert new row */
      dbInsert(options: { table: string; data: any }): Cypress.Chainable<any>;
      /** DB: update existing row */
      dbUpdate(options: { table: string; data: any; whereQuery: string; whereParams: any[] }): Cypress.Chainable<any>;
      /** DB: append text in field */
      dbAddText(options: { table: string; text: any; field: any; whereQuery: string; whereParams: any[] }): Cypress.Chainable<any>;
      /** DB: get all values in column (unique) */
      dbGetUniqueColumnValues(options: { table: string; column: string }): Cypress.Chainable<any>;
      /** DB: get Report object */
      dbGetReport(): Cypress.Chainable<any>;
      /** DB: report test tables */
      dbReportTest(): Cypress.Chainable<any>;
      /** DB: delete garbage if it exists (of incomplete testing) */
      dbClearDataOnError(): Cypress.Chainable<any>;
    }
  }
}

export {};
