import moment from 'moment';

Cypress.Commands.add('validButton', (selector) => cy.get(selector).should('exist').should('be.visible').should('have.css', 'cursor', 'pointer'));
Cypress.Commands.add('getText', (selector, options) =>
  cy
    .get(selector, options)
    .first()
    .should('exist')
    .then(($txtEle) => cy.wrap($txtEle.text().replace('\n', '').trim())),
);
Cypress.Commands.add('getInput', (placeholder, options) => cy.contains('mat-form-field', placeholder, options).find('input'));
Cypress.Commands.add('getButton', (text, options) => cy.contains('button', text, options));
Cypress.Commands.add('removeKey', (key: string) => cy.window().then((win) => win.localStorage.removeItem(key)));
Cypress.Commands.add('getMemoryInfo', (label?: string) => {
  const memory = (performance as any)?.memory;
  if (memory) {
    const { totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit } = memory;
    const totalHeapMB = (totalJSHeapSize / (1024 * 1024)).toFixed(2);
    const usedHeapMB = (usedJSHeapSize / (1024 * 1024)).toFixed(2);
    const heapLimitMB = (jsHeapSizeLimit / (1024 * 1024)).toFixed(2);
    const porcentajeUsado = ((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2);

    return cy.wrap(`${label ? label + ' - ' : ''}${usedHeapMB}/${totalHeapMB} MB of ${heapLimitMB} MB | (${porcentajeUsado}% used)`);
  } else {
    return cy.wrap('Performance.memory no está disponible en este navegador.');
  }
});
Cypress.Commands.add('getControl', (selector, options) => cy.get(selector, options).first());

Cypress.Commands.add('bLog', ({ msg, head = true, saveInFile = false } = {}) => {
  const title: string = Cypress.currentTest.title;
  const headStr: string = `[${title}] - ${moment().format('DD-MM-YYYY HH:mm:ss')}`;

  if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);

  msg = (msg as string)
    .split('\n')
    .map((line: string) => `[${title}] - ${line}`)
    .join('\n');

  msg = head ? `${headStr}\n${msg}` : msg;

  return cy.task('log', { msg, saveToFile: saveInFile });
});
