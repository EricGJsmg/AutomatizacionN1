class DXCLoginPage {
  visit(): Cypress.Chainable<string> {
    return cy.visit('', { timeout: 180000 }).dxcValidateLocation({ relPath: '/auth/login' });
  }

  fillUsername(username: string): Cypress.Chainable<string> {
    return cy
      .get('input[formcontrolname="username"]')
      .type(username)

      .then(() => username);
  }

  fillPassword(password: string): Cypress.Chainable<any> {
    return cy.get('input[formcontrolname="password"]').type(password);
  }

  submit(): Cypress.Chainable<any> {
    return cy.get('button[type="submit"]').click();
  }

  selectSite(site: string): Cypress.Chainable<string> {
    return cy
      .dxcValidateLocation({ relPath: '/auth/site' })
      .wait(1000) // necessary due to unstable page loading, causing so much layout shift that even cypress fails to click

      .get('filtro-lista')
      .type(site) // select site

      .get('.silo-login-button')
      .click()

      .then(() => site);
  }

  selectConnectionNode(node: string): Cypress.Chainable<string> {
    return cy
      .dxcValidateLocation({ relPath: '/auth/workstation' })

      .getInput('Connection node *', { timeout: 20000 })
      .clear()
      .type(node, { delay: 50 })

      .get('button[type="submit"]')
      .click()

      .dxcValidateLocation({ relPath: '/home/transactions' }) // validate next location

      .then(() => node);
  }

  goHome(): Cypress.Chainable<any> {
    return cy.visit('/#/');
  }

  login(username: string, password: string): Cypress.Chainable<any> {
    return cy
      .then(() => this.visit())
      .then(() => this.fillUsername(username))
      .then(() => this.fillPassword(password))
      .then(() => this.submit());
  }

  setWorkspace(site: string, node: string): Cypress.Chainable<any> {
    return cy
      .then(() => this.selectSite(site))
      .then(() => this.selectConnectionNode(node))
      .then(() => this.goHome())
      .then(() => cy.dxcValidateLocation({ relPath: '/home/transactions' })); // validate next location
  }

  setWorkspaceLlica(node: string): Cypress.Chainable<any> {
    return cy
      .then(() => this.selectConnectionNode(node))
      .then(() => this.goHome())
      .then(() => cy.dxcValidateLocation({ relPath: '/home/transactions' })); // validate next location
  }
}

export default DXCLoginPage;
