class UUIDService {
  private uuidPath: string = 'cypress/fixtures/tmp/uuid.json';

  constructor() {
    this.ensureUuid();
  }

  private ensureUuid(): Cypress.Chainable<any> {
    return cy
      .task('exists', this.uuidPath)
      .then((exists) => !exists && this.setUUID(null, true))
      .then(() => {
        return this.getUUID(true).then((newUuid) => {
          return this.setUUID(newUuid);
        });
      });
  }

  private setUUID(uuid: string | null, force = false): Cypress.Chainable<any> {
    if (force) {
      return cy.writeFile(this.uuidPath, { uuid });
    } else {
      return this.getUUID().then((existingUuid) => {
        if (existingUuid) {
          return cy.wrap(null); // should not be replaceable
        } else {
          return cy.writeFile(this.uuidPath, { uuid }); // only write in the first time when uuid is null
        }
      });
    }
  }

  public getUUID(create: boolean = false): Cypress.Chainable<string | null> {
    if (create) {
      return UUIDService.createUUID().then((uuid) => {
        return cy.wrap(uuid || null);
      });
    } else {
      return cy.task('exists', this.uuidPath).then((exists): any => {
        if (!exists) return null;
        return cy.readFile(this.uuidPath, { log: false, timeout: 5000 }).then((data) => data?.uuid || null);
      });
    }
  }

  static createUUID(): Cypress.Chainable<string> {
    return cy.wrap(
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
    );
  }

  public deleteUUID(): Cypress.Chainable<any> {
    return cy.writeFile(this.uuidPath, { uuid: null });
  }
}

export default UUIDService;
