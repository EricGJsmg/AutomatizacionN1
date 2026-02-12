export interface Test {
  uuid: string;
  site: string;
  description: string;
  startDate: string;
  endDate: string;
  elapsed: string;
  browser: string;
}

export interface It {
  id: string;
  testId: string;
  name: string;
  state: string;
  duration: string;
  memory: string;
}

export interface Order {
  id: string;
  testId: string;
  waveId: string;
}

export interface Wave {
  id: string;
  testId: string;
  type: string;
  radio: string;
  sTitle: string;
  output: string;
  pick: string;
  nrOfLines: string;
  nrOfGroupings: string;
  nrOfItems: string;
  totalUnits: string;
  nrOfOrders: string;
  note: string;
}

export interface Material {
  id: string;
  testId: string;
  waveId: string;
  container: string;
  pickfor: string;
  almacen: string;
  location: string;
  articulo: string;
  descripcion: string;
  quantity: string;
}

export interface Packing {
  id: string;
  testId: string;
  orderId: string;
  container: string;
  status: string;
  message: string;
  warehouse: string;
  position: string;
  totalWeight: string;
  totalVolume: string;
  totalUnits: string;
  type: string;
  destination: string;
  shipment: string;
  scanned: string;
}

export interface Consolidation {
  id: string;
  testId: string;
  orderId: string;
  radio: string;
  message: string;
  errorMessage: string;
  matricula: string;
  destination: string;
  destinationL1: string;
  destinationL2: string;
  putawayDestinationL1: string;
  putawayDestinationL2: string;
  station: string;
  warehouse: string;
  type: string;
}

export interface Shipment {
  id: string;
  testId: string;
  radio: string;
  message: string;
  warningMessage: string;
  status: string;
  printer: string;
  route: string;
  matriculas: string;
}

export interface Error {
  id: string;
  testId: string;
  title: string;
  message: string;
  stack: string;
  test: string;
  date: string;
}

export interface Associate {
  id: string;
  testId: string;
  orderId: string;
  radio: string;
  pos: string;
  container: string;
  oldContainer: string;
  position: string;
  articulo: string;
  quantity: string;
  destino: string;
}

export interface Report {
  tests: Array<Partial<Test>>;
  its: Array<Partial<It>>;
  orders: Array<Partial<Order>>;
  waves: Array<Partial<Wave>>;
  materials: Array<Partial<Material>>;
  packings: Array<Partial<Packing>>;
  consolidations: Array<Partial<Consolidation>>;
  shipments: Array<Partial<Shipment>>;
  associates: Array<Partial<Associate>>;
  errors: Array<Partial<Error>>;
}
