// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import moment from 'moment';
import './commands/index';
import 'cypress-fail-fast';

Cypress.on('log:added', (attrs: Cypress.ObjectLike) => {
  if (`${attrs?.displayName}${attrs?.message}`.toLowerCase().includes('alsa')) return false;
  attrs.message = attrs?.message?.replace(/\beyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g, '[REDACTED]'); // like jwt
});

Cypress.on('fail', (error, runnable) => {
  const errorDetails = {
    title: runnable.title,
    message: error.message,
    stack: error.stack?.split('\n').join('\n'),
    test: runnable.titlePath().join(' > '),
    date: new Date().toISOString(),
  };

  const errName: string = 'E-'.concat(errorDetails.title, '-', errorDetails.date).replace(' ', '-');
  cy.screenshot(errName);

  cy.dbInsert({
    table: 'errors',
    data: errorDetails,
  });

  cy.dbFinishTest({ report: true }); // report tests on error
  cy.disconnectAllRadios();

  // Return the error so that Cypress continues to display the failure
  throw error;
});

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

beforeEach(function () {
  cy.task('log', { msg: `[TEST_START] ${Cypress.currentTest.title} - ${moment().format('DD-MM-YYYY HH:mm:ss')}` });
});

afterEach(function () {
  cy.task('log', { msg: `[TEST_END] ${Cypress.currentTest.title} - ${moment().format('DD-MM-YYYY HH:mm:ss')}` });
});
