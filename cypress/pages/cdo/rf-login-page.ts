class RFLoginPage {
  visit(): Cypress.Chainable<any> {
    return cy.visit(Cypress.env('radioUrl')).clearLocalStorage().reload(true).wait(500);
  }

  fillUsername(username: string): Cypress.Chainable<string> {
    return cy
      .get('#P101_USERNAME', { timeout: 60000 })
      .should('exist')
      .should('be.visible')

      .type(username, { delay: 50 })

      .then(() => username);
  }

  fillPassword(password: string): Cypress.Chainable<any> {
    return cy.get('#P101_PASSWORD').type(password, { delay: 50 });
  }

  submit(): Cypress.Chainable<any> {
    return cy
      .get('#P101_LOGIN')
      .click() // login button

      .url()
      .then((currentUrl) => {
        if (currentUrl.includes('wwv_flow.accept')) {
          return cy
            .contains('here')
            .click() // clic on tag a

            .then(() => this.login({ firstLogin: false })); // retry if log-in was failed
        }
        return cy.wait(1000); // necessary to wait new page
      });
  }

  login({ username = Cypress.env('username'), password = Cypress.env('password'), firstLogin = true } = {}): Cypress.Chainable<any> {
    return cy
      .then(() => (firstLogin ? this.visit() : cy.then(() => null)))
      .then(() => this.fillUsername(username))
      .then(() => this.fillPassword(password))
      .then(() => this.submit());
  }

  selectSite(site: string): Cypress.Chainable<string> {
    // radio should be disconnected
    return cy
      .get('a')
      .contains(site) // if radio connected the selector will not be found
      .click()
      .then(() => site);
  }

  assignTerminal(radio: string): Cypress.Chainable<boolean> {
    return cy
      .get('#P1_RADIO_SELEC')
      .wait(500)
      .type(radio, { delay: 50 })
      .wait(100)
      .type('{enter}')

      .wait(3000)
      .get('body')
      .then(($body) => {
        const notConnected = $body.find('.SILOMensajes').text().includes('no válida');
        if (notConnected) return cy.wrap(false);
        else return cy.wrap(true);
      });
  }

  selectTask(task: string): Cypress.Chainable<any> {
    return cy
      .wait(500)
      .get('body')
      .then(($body) => {
        if ($body.find('a').length === 0) return cy.get('#MENU').as('menu').click().wait(500).get('body'); // if not have options, go to menu
      })
      .contains('a', new RegExp(`^${task}$`))
      .as('task')
      .click();
  }
}

export default RFLoginPage;
