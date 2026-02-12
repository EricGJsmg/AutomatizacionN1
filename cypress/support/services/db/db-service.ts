import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export class DBService {
  private db: Database.Database;
  private dbPath: string;

  constructor() {
    this.dbPath = path.resolve(__dirname, '../../../fixtures/tmp/db.sqlite');
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    this.db = new Database(this.dbPath); // open or create database
    this.initializeDatabase(); // create tables if not exists
  }

  private initializeDatabase(): void {
    const createTestsTable = `
    CREATE TABLE IF NOT EXISTS tests (
      uuid TEXT PRIMARY KEY,    -- cada iteracion de describe tiene una UUID única
      site TEXT,
      description TEXT,
      startDate TEXT,
      endDate TEXT,
      elapsed TEXT,
      browser TEXT
    );
    `;

    const createItsTable = `
      CREATE TABLE IF NOT EXISTS its (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId TEXT,
        name TEXT,
        state TEXT,
        duration TEXT,
        memory TEXT,
        FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
      );
    `;

    const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      testId TEXT,
      waveId TEXT NULL,
      FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE,
      FOREIGN KEY (waveId) REFERENCES waves(id) ON DELETE SET NULL   -- relación con waves (puede ser NULL ya que primero se obtienen los pedidos)
    );
    `;

    const createWaveTable = `
    CREATE TABLE IF NOT EXISTS waves (
      id TEXT PRIMARY KEY,
      testId TEXT,
      type TEXT,
      radio TEXT,
      sTitle TEXT,
      output TEXT,
      pick TEXT,
      nrOfLines TEXT,
      nrOfGroupings TEXT,
      nrOfItems TEXT,
      totalUnits TEXT,
      nrOfOrders TEXT,
      note TEXT,
      FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
    );
    `;

    const createMaterialsTable = `
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      testId TEXT,
      waveId TEXT,
      container TEXT,
      pickfor TEXT NULL,
      almacen TEXT,
      location TEXT,
      articulo TEXT,
      descripcion TEXT,
      quantity TEXT,
      FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
    );
  `;

    const createPackingTable = `
      CREATE TABLE IF NOT EXISTS packings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId TEXT,
        orderId TEXT,
        container TEXT,
        status TEXT,
        message TEXT,
        warehouse TEXT,
        position TEXT,
        totalWeight TEXT,
        totalVolume TEXT,
        totalUnits TEXT,
        type TEXT,
        destination TEXT,
        shipment TEXT,
        scanned TEXT,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      );
    `;

    const createConsolidationsTable = `
      CREATE TABLE IF NOT EXISTS consolidations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId TEXT,
        orderId TEXT,
        radio TEXT,
        message TEXT,
        errorMessage TEXT,
        matricula TEXT,
        destination TEXT,
        destinationL1 TEXT,
        destinationL2 TEXT,
        putawayDestinationL1 TEXT,
        putawayDestinationL2 TEXT,
        station TEXT,
        warehouse TEXT,
        type TEXT,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      );
    `;

    const createShipmentsTable = `
      CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY,
        testId TEXT,
        radio TEXT,
        message TEXT,
        warningMessage TEXT,
        status TEXT,
        printer TEXT,
        route TEXT,
        matriculas TEXT,
        FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
      );
    `;

    const createErrorsTable = `
      CREATE TABLE IF NOT EXISTS errors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId TEXT,
        title TEXT,
        message TEXT,
        stack TEXT,
        test TEXT,
        date TEXT,
        FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
      );
    `;

    const createAssociatesTable = `
    CREATE TABLE IF NOT EXISTS associates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      testId TEXT,
      orderId TEXT NULL,
      radio TEXT,
      pos TEXT,
      container TEXT,
      oldContainer TEXT,
      position TEXT,
      articulo TEXT,
      quantity TEXT,
      destino TEXT,
      FOREIGN KEY (testId) REFERENCES tests(uuid) ON DELETE CASCADE
    );
  `;

    this.db.exec(createTestsTable);
    this.db.exec(createItsTable);
    this.db.exec(createOrdersTable);
    this.db.exec(createWaveTable);
    this.db.exec(createMaterialsTable);
    this.db.exec(createPackingTable);
    this.db.exec(createConsolidationsTable);
    this.db.exec(createShipmentsTable);
    this.db.exec(createErrorsTable);
    this.db.exec(createAssociatesTable);
  }

  public close(): void {
    this.db.close();
  }

  public select(query: string, params: any[] = []): any[] {
    try {
      const stmt = this.db.prepare(query);
      if (process.env.E2E_DEBUG === 'true') console.info(`Executing select || Query: ${query} | Params: ${params}`);
      return stmt.all(...params);
    } catch (error) {
      console.error(`Error during select || Query: ${query} | Params: ${params} | ${error}`);
      return [];
    }
  }

  public mutate(query: string, params: any[] = []): any {
    try {
      const stmt = this.db.prepare(query);
      if (process.env.E2E_DEBUG === 'true') console.info(`Executing mutate || Query: ${query} | Params: ${params}`);
      console.info(`[DB] changes: ${stmt.run(...params).changes}`);
      return 'OK';
    } catch (error) {
      console.error(`Error during mutate || Query: ${query} | Params: ${params} | ${error}`);
      return 'ERROR';
    }
  }
}
