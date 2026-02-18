import { Puesto } from '../../../support/services/gql/gql-types';

export namespace Inbound {
  export interface DataSet {
    description: string;
    localizacion: number;
    node: string;
    puesto: Puesto;
    warehouse: string;
    elemento: string;
    position: string;
  }

  export interface ASN {
    container: string;
    asnId: string;
    entrada: number;
  }
}

describe('Inbound', function () {
  let dataSet: Inbound.DataSet;
  let container: string;

  before(function () {
    return cy
      .then(() => {
        if (Cypress.env('testData')) {
          dataSet = Cypress.env('testData');
        } else {
          return cy.readFile(__dirname.concat('/data/inbound-data.json')).then((data: Inbound.DataSet[]) => {
            dataSet = data[0];
          });
        }
      })
      .then(() => {
        return cy.puestoConnect(dataSet).then((puestoConnected: Puesto) => {
          dataSet.puesto = puestoConnected;
          return cy.dbStartTest({ ...dataSet, ...dataSet.puesto, clear: true, force: true });
        });
      })
      .then(() => {
        return cy.createContainerWithStock(dataSet).then((createdContainer: string) => {
          container = createdContainer;
        });
      });
  });

  after(function () {
    return cy.dbExportReportToJson({ testName: 'inbound' })
      .then(() => cy.dbFinishTest({ report: true }))
      .then(() => cy.disconnectAllRadios());
  });

  afterEach(function () {
    return cy.dbStartTest(dataSet.puesto).dbLogIt(this);
  });

  /** locate stock */
  it('Ubicado', function () {
    return cy.guidedLocationPrendaAPrenda({ ...dataSet, container });
  });
});
