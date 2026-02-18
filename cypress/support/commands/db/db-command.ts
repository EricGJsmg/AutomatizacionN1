import { Test, It, Order, Wave, Material, Packing, Consolidation, Shipment, Associate, Error, Report } from '../../services/db/db-types';
import UUIDService from '../../services/uuid/uuid-service';
import VulcanService from '../../services/vulcan/vulcan-service';

Cypress.Commands.add('dbStartTest', ({ clear = false, description = '-', site, force = false } = {}) => {
  if (clear) cy.dbClear();
  if (force) cy.dbFinishTest();

  cy.then(() => new UUIDService().getUUID()).then((uuid) => {
    let query = `SELECT * FROM tests WHERE uuid = ?`;
    let params = [uuid];
    return cy.task('select', { query, params }).then((test: any) => {
      let startDate;
      let endDate;
      let elapsed;

      if (test?.length === 1) {
        // to log elapsed
        const start = new Date(test[0].startDate).getTime();
        const end = new Date(test[0].endDate).getTime();
        const elapsedMs = end - start;

        endDate = new Date().toISOString();
        elapsed = elapsedMs.toString();

        query = `
        INSERT INTO tests (uuid, endDate, elapsed)
        VALUES (?, ?, ?)
        ON CONFLICT(uuid) DO UPDATE SET
          endDate = excluded.endDate,
          elapsed = excluded.elapsed;
      `;
        params = [uuid, endDate, elapsed];

        cy.log(`dbStartTest:  ${params}`);
        return cy.task('mutate', { query, params });
      } else {
        // create
        cy.bLog({ msg: { testUuid: uuid }, head: false });
        startDate = new Date().toISOString();
        endDate = new Date().toISOString();
        elapsed = '0';
        const browser = [
          `${Cypress.browser.name} (${Cypress.browser.family}, ${Cypress.browser.version}, ${Cypress.browser.channel})`,
          `isHeaded: ${Cypress.browser.isHeaded}`,
          `isHeadless: ${Cypress.browser.isHeadless}`,
        ].join(', ');

        query = `
        INSERT INTO tests (uuid, site, description, startDate, endDate, elapsed, browser)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
        params = [uuid, site, description, startDate, endDate, elapsed, browser];
        return cy.log(`dbStartTest:  ${params}`).task('mutate', { query, params });
      }
    });
  });
});

Cypress.Commands.add('dbFinishTest', ({ report = false } = {}) => {
  if (report) cy.dbReportTest();
  const uuidService = new UUIDService();
  return uuidService.deleteUUID().then(() => cy.dbClearDataOnError());
});

Cypress.Commands.add('dbLogIt', (context: Mocha.Context) => {
  return new UUIDService().getUUID().then((testId) => {
    return cy.getMemoryInfo().then((memory) => {
      const name = context.currentTest?.title ?? 'unknown'; // test title (it)
      const state = (context.currentTest?.state ?? 'unknown').toUpperCase(); // status (passed o failed)
      const duration = context.currentTest?.duration?.toString(); // duration test (it)

      const query = `
        INSERT INTO its (testId, name, state, duration, memory)
        VALUES (?, ?, ?, ?, ?);
      `;
      const params = [testId, name, state, duration, memory];

      return cy.log(`dbLogIt:  ${params}`).task('mutate', { query, params });
    });
  });
});

Cypress.Commands.add('dbGetAllFromTable', (table) => {
  return new UUIDService().getUUID().then((testId) => {
    const field = table === 'tests' ? 'uuid' : 'testId';
    const query = `SELECT * FROM ${table} WHERE ${field} = ?`;
    const params = [testId];
    return cy.log(`dbGetAllFromTable:  ${[params]}`).task('select', { query, params });
  });
});

Cypress.Commands.add('dbAddOrders', (orders: string[]) => {
  return new UUIDService().getUUID().then((testId) => {
    if (!orders || orders.length === 0) {
      // Avoid running empty VALUES query
      return cy.log('dbAddOrders: no orders to insert');
    }
    const query = `
      INSERT OR IGNORE INTO orders (testId, id)
      VALUES ${orders.map(() => '(?, ?)').join(', ')};
    `;
    const params = orders.flatMap((id) => [testId, id]);
    return cy.log(`dbAddOrders: ${params}`).task('mutate', { query, params });
  });
});

Cypress.Commands.add('dbClearDataOnError', () => {
  return cy.then(() => {
    const query = `
      DELETE FROM orders WHERE waveId IS NULL;
    `;
    return cy.log(`dbClearDataOnError`).task('mutate', { query, params: [] });
  });
});

Cypress.Commands.add('dbClear', () => {
  return cy.task('mutate', { query: 'DELETE FROM tests' }).then(() => {
    return cy.log('dbClear: all truncated.');
  });
});

Cypress.Commands.add('dbAssignOrdersToWave', ({ orders, wave } = {}) => {
  return new UUIDService().getUUID().then((testId) => {
    const queries: any[] = [];

    // create wave
    queries.push({
      query: `
        INSERT INTO waves (id, testId)
        VALUES (?, ?);
      `,
      params: [wave, testId],
    });

    // update orders with waveId
    orders.forEach((order) => {
      queries.push({
        query: `
          UPDATE orders
          SET waveId = ?
          WHERE id = ?;
        `,
        params: [wave, order],
      });
    });

    return cy.wrap(null).then(() => {
      return queries.reduce((promise, { query, params }) => {
        return promise.then(() => {
          return cy.log(`dbAssignOrdersToWave`).task('mutate', { query, params });
        });
      }, Promise.resolve());
    });
  });
});

Cypress.Commands.add('dbInsert', ({ table, data } = {}) => {
  return new UUIDService().getUUID().then((testId) => {
    data.testId = testId;
    let query = `INSERT INTO ${table} (`;
    const fields: any[] = [];
    const placeholders: any[] = [];
    const params: any[] = [];

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(key); // field name
        placeholders.push('?'); // placeholder for value
        params.push(data[key]); // value
      }
    });
    query += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ');';
    return cy.log(`dbInsert`).task('mutate', { query, params });
  });
});

Cypress.Commands.add('dbValueExist', ({ table, whereQuery, whereParams = [] } = {}) => {
  cy.log(`dbValueExist`);
  const query = `SELECT COUNT(*) as count FROM ${table} ${whereQuery};`;
  return cy.task('select', { query, params: whereParams }).then((result: any) => {
    return result[0].count > 0;
  });
});

Cypress.Commands.add('dbUpdate', ({ table, data, whereQuery, whereParams = [] } = {}) => {
  let query = `UPDATE ${table} SET `;
  const updates: any[] = [];
  const params: any[] = [];

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(data[key]);
    }
  });

  if (updates.length === 0) return cy.log(`dbUpdate: no fields to update for table ${table}`).then(() => null);
  query += updates.join(', ') + ' ' + whereQuery + ';';
  params.push(...whereParams);
  return cy.log(`dbUpdate`).task('mutate', { query, params });
});

Cypress.Commands.add('dbGet', ({ table, whereQuery, whereParams = [] } = {}) => {
  return cy.log(`dbGet`).task('select', { query: `SELECT * FROM ${table} ${whereQuery};`, params: whereParams });
});

Cypress.Commands.add('dbAddText', ({ table, text, field, whereQuery, whereParams = [] } = {}) => {
  const query = `UPDATE ${table} SET ${field} = IFNULL(${field}, '') || ? ${whereQuery};`;
  const params = [text, ...whereParams];
  return cy.log(`dbAddText`).task('mutate', { query, params });
});

Cypress.Commands.add('dbGetUniqueColumnValues', ({ table, column } = {}) => {
  return new UUIDService().getUUID().then((testId) => {
    const query = `SELECT DISTINCT ${column} FROM ${table} WHERE testId = ?;`;
    const params = [testId];
    return cy
      .log(`dbGetUniqueColumnValues`)
      .task('select', { query, params })
      .then((rows: any) => {
        return cy.wrap(rows.map((row: any) => row[column]));
      });
  });
});

Cypress.Commands.add('dbGetReport', () => {
  return cy.log(`dbGetReport`).then(() => {
    return cy.dbGetAllFromTable('tests').then((tests: Partial<Test>[]) => {
      return cy.dbGetAllFromTable('its').then((its: Partial<It>[]) => {
        return cy.dbGetAllFromTable('orders').then((orders: Partial<Order>[]) => {
          return cy.dbGetAllFromTable('waves').then((waves: Partial<Wave>[]) => {
            return cy.dbGetAllFromTable('materials').then((materials: Partial<Material>[]) => {
              return cy.dbGetAllFromTable('packings').then((packings: Partial<Packing>[]) => {
                return cy.dbGetAllFromTable('consolidations').then((consolidations: Partial<Consolidation>[]) => {
                  return cy.dbGetAllFromTable('shipments').then((shipments: Partial<Shipment>[]) => {
                    return cy.dbGetAllFromTable('errors').then((errors: Partial<Error>[]) => {
                      return cy.dbGetAllFromTable('associates').then((associates: Partial<Associate>[]) => {
                        const report: Report = {
                          tests,
                          its,
                          orders,
                          waves,
                          materials,
                          packings,
                          consolidations,
                          shipments,
                          errors,
                          associates,
                        };
                        return cy.wrap(report);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

Cypress.Commands.add('dbReportTest', () => {
  return cy.log(`dbReportTest`).then(() => {
    return cy.dbGetReport().then((report: Report) => {
      return VulcanService.reportTests({ report });
    });
  });
});
