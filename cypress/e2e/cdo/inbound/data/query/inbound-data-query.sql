insert into e2e_scenario_params (
   name,
   test,
   site,
   fields
) values ( 'CDO - Test Inbound',
           'cdo-inbound',
           'CDO',
           to_clob('
[
  {
    "name" : "localizacion",
    "label" : "Location",
    "detail" : "Localizacion de la prueba",
    "placeholder" : "ex. 4",
    "type" : "number",
    "multiple" : false,
    "required" : true
  },
  {
    "name" : "node",
    "label" : "Node",
    "detail" : "Estacion de la prueba",
    "placeholder" : "ex. PC_SILO",
    "type" : "text",
    "multiple" : false,
    "required" : true
  },
  {
    "name" : "warehouse",
    "label" : "Warehouse",
    "detail" : "Almacen para abrir y ubicar la ASN",
    "placeholder" : "ex. IB2B",
    "type" : "text",
    "multiple" : false,
    "required" : true
  },
  {
    "name" : "elemento",
    "label" : "Elemento",
    "detail" : "",
    "placeholder" : "ex. BAY001",
    "type" : "text",
    "multiple" : false,
    "required" : true
  }
]') );
