import { Report } from '../db/db-types';

interface CreateOrder {
  id: string;
  type: 'ZOD2' | 'ZOD5' | 'ZRP1'; // mule order types
  site: string; // LLICA is 'D001'
  route: string;
  items: {
    ean: string;
    sku: string;
    quantity: number;
  }[];
  date: string;
}

interface Address {
  addressNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  countryDescription: string;
  regionType: string;
  regionDescription: string;
  district: string;
  drpNumber: string;
  drpName: string;
  drpclientnumber: string;
}

interface Partner {
  partnerType: string;
  partnerId: string;
  sort1: string;
  sort2: string;
  nif: string;
  name: string;
  name2: string;
  ExpressDeliveryCompany: string;
  surname: string;
  language: string;
  externalCode: string;
  scacd: string;
  tmsCode: string;
  tracking: string;
  labelType: string;
  returnLblNr: string;
  idBpAtCustomer: string;
  phones: { countryCode: string; phoneNumber: string }[];
  addresses: Address[];
  email: { email: string }[];
}

export const report = (report: Report): string => {
  const parseNumber = (value: any, defaultValue: number = 0): number => {
    return isNaN(Number(value)) ? defaultValue : Number(value);
  };
  const parseText = (value: any, defaultValue: any = ''): string => {
    return value || defaultValue;
  };
  return JSON.stringify([
    {
      uuid: parseText(report.tests[0]?.uuid),
      site: parseText(report.tests[0]?.site),
      startDate: parseText(report.tests[0]?.startDate),
      endDate: parseText(report.tests[0]?.endDate),
      elapsed: parseNumber(report.tests[0]?.elapsed),
      description: parseText(report.tests[0]?.description),
      browser: parseText(report.tests[0]?.browser),
      its: report.its.map((it) => ({
        name: parseText(it.name),
        state: parseText(it.state),
        duration: parseNumber(it.duration),
        memory: parseText(it.memory),
      })),
      orders: report.orders.map((order) => ({
        id: parseText(order.id),
        waveId: parseText(order.waveId),
        packings: report.packings
          .filter((packing) => packing.orderId === order.id)
          .map((packing) => ({
            container: parseText(packing.container),
            status: parseText(packing.status),
            message: parseText(packing.message),
            warehouse: parseText(packing.warehouse),
            position: parseText(packing.position),
            totalWeight: parseNumber(packing.totalWeight),
            totalVolume: parseNumber(packing.totalVolume),
            totalUnits: parseNumber(packing.totalUnits),
            type: parseText(packing.type),
            destination: parseText(packing.destination),
            shipment: parseText(packing.shipment),
            scanned: parseText(packing.scanned),
          })),
        consolidations: report.consolidations
          .filter((consolidation) => consolidation.orderId === order.id)
          .map((consolidation) => ({
            message: parseText(consolidation.message),
            radio: parseNumber(consolidation.radio),
            errorMessage: parseText(consolidation.errorMessage, null),
            matricula: parseText(consolidation.matricula),
            destination: parseText(consolidation.destination),
            destinationL1: parseText(consolidation.destinationL1),
            destinationL2: parseText(consolidation.destinationL2),
            putawayDestinationL1: parseText(consolidation.putawayDestinationL1),
            putawayDestinationL2: parseText(consolidation.putawayDestinationL2),
            station: parseText(consolidation.station),
            warehouse: parseText(consolidation.warehouse),
            type: parseText(consolidation.type),
          })),
      })),
      waves: report.waves.map((wave) => ({
        id: parseText(wave.id),
        type: parseText(wave.type),
        radio: parseText(wave.radio),
        sTitle: parseText(wave.sTitle),
        output: parseText(wave.output),
        pick: parseText(wave.pick),
        nrOfLines: parseNumber(wave.nrOfLines),
        nrOfGroupings: parseNumber(wave.nrOfGroupings),
        nrOfItems: parseNumber(wave.nrOfItems),
        totalUnits: parseNumber(wave.totalUnits),
        nrOfOrders: parseNumber(wave.nrOfOrders),
        note: parseText(wave.note),
      })),
      shipments: report.shipments.map((shipment) => ({
        id: parseText(shipment.id),
        radio: parseNumber(shipment.radio),
        message: parseText(shipment.message),
        warningMessage: parseText(shipment.warningMessage, null),
        status: parseText(shipment.status),
        printer: parseText(shipment.printer),
        route: parseText(shipment.route),
        matriculas: parseText(shipment.matriculas),
      })),
      errors: report.errors.map((error) => ({
        title: parseText(error.title),
        message: parseText(error.test) + ' ' + parseText(error.message),
        stack: parseText(error.stack),
        testReference: error.testId,
        date: parseText(error.date),
      })),
      associates: report.associates.map((associate) => ({
        pos: parseText(associate.pos),
        radio: parseNumber(associate.radio),
        container: parseText(associate.container),
        oldContainer: parseText(associate.oldContainer),
        position: parseText(associate.position),
        articulo: parseText(associate.articulo),
        quantity: parseNumber(associate.quantity),
        destino: parseText(associate.destino),
      })),
      materials: report.materials.map((material) => ({
        container: parseText(material.container),
        pickfor: parseText(material.pickfor),
        almacen: parseText(material.almacen),
        location: parseText(material.location),
        articulo: parseText(material.articulo),
        descripcion: parseText(material.descripcion),
        quantity: parseNumber(material.quantity),
      })),
    },
  ]);
};

export const buildOrderPayload = (order: CreateOrder) => {
  const date = order.date.split('.')[0] + 'Z';
  const isLLICA = order.site === 'D001';

  const getDateOnly = () => date.split('T')[0];
  const getIdocNumber = () => '0000000313567103';
  const getCommercialReference = () => '87004787';
  const getCurrency = () => 'EUR';

  const deliveryBasicInfo = {
    action: 'NEW',
    actionSourceId: '',
    actionSource: order.type === 'ZOD5' ? 'B2CTIENDA' : '',
    actionDateTime: date,
    deliveryNumber: order.id,
    creationDateTime: date,
    deliveryNoteIdentification: order.id,
    deliveryTypeId: order.type,
    deliveryPriority: '00',
    originOrder: 'DRP',
    totalPackages: 0,
    organizationSalesCode: 'ES01',
    organizationSales: 'M0003 PUNTO FA (ES)',
    distributionChannel: 'IT',
    division: 'FA',
    route: order.route,
    exportCode: '',
    packOperator: '',
    deliveryBlockCode: '',
    deliveryBlock: '',
    billingBlockCode: '',
    billingBlock: '',
    typeNeed: 'REPO',
    kindNeed: 'SH',
    idRoute: 'MNG USA - HU',
    prioModColor: '',
    mots: '',
    shipmentPlanRequired: 'N',
    specialProcessingId: 'RRAT',
    combinationCriteria: '',
    combinationCriteriaDes: '',
    idocNumber: getIdocNumber(),
  };

  const deliveryShipInfo = {
    shippingPoint: order.site,
    unloadingPoint: '',
    shippingType: '01',
    shipConditionsCode: '00',
    shipConditions: 'Standard',
    incoterm1: 'DDP',
    incoterm2: 'Nohra',
    deliveryNoteRequested: '(1)-Optional',
    deliveryNoteResponse: '',
  };

  const documentData = [
    {
      documentType: '',
      document: 'dGVzdA==',
    },
  ];

  const deliveryDates = {
    plannedDate: date,
    loadingDate: date,
    transportPlanningDate: date,
    deliveryDate: getDateOnly(),
    packingDate: date,
  };

  const customerData = {
    customerNumber: order.site,
    cifValueTotalEUR: 0,
    freightCost: 0,
    totalInsuranceAmount: 0,
    customerReference: order.id,
    customerReferenceDate: getDateOnly(),
    referenceCode: '',
    netPrice: 40.48,
    grossPrice: 0.01,
    dateTimeCreation: date,
    documentSDCurrency: getCurrency(),
    cifValueTotalItem: 0,
    freightCifValue: 0,
    documentCIFCurrency: getCurrency(),
    idocNumber: getIdocNumber(),
    idRuleCustom: '',
    department: '',
    departmentExternal: '',
  };

  const buildAddress = (overrides: Partial<Address>): Address => ({
    addressNumber: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    countryDescription: '',
    regionType: '',
    regionDescription: '',
    district: '',
    drpNumber: '',
    drpName: '',
    drpclientnumber: '',
    ...overrides,
  });

  const buildPartner = (overrides: Partial<Partner>): Partner => ({
    partnerType: '',
    partnerId: '',
    sort1: '',
    sort2: '',
    nif: '',
    name: '',
    name2: '',
    ExpressDeliveryCompany: '',
    surname: '',
    language: '',
    externalCode: '',
    scacd: '',
    tmsCode: '0001',
    tracking: '0001',
    labelType: '0001',
    returnLblNr: '',
    idBpAtCustomer: '',
    phones: [],
    addresses: [],
    email: [],
    ...overrides,
  });

  const buildNewYorkAddress = () =>
    buildAddress({
      addressNumber: '0000024657',
      address: '561 Broadway',
      postalCode: '10012',
      city: 'New York',
      country: 'US',
      countryDescription: 'USA',
      regionType: 'NY',
      regionDescription: 'New York',
    });

  const buildCommonPartnerFields = (phoneNumber: string, email: string) => ({
    tmsCode: '0001',
    tracking: '0001',
    phones: [{ countryCode: '', phoneNumber }],
    email: [{ email }],
  });

  const deliveryPartners = [
    buildPartner({
      partnerType: 'soldTo',
      partnerId: '0000000398',
      sort1: 'MNG # 398',
      sort2: 'MNG # 10398',
      name: 'NEW YORK Broadway 561 ST MANGO # OS ST # 398',
      surname: 'Simpson',
      language: 'EN',
      ...buildCommonPartnerFields('555111222', 'abraham.simpson@springfield.com'),
      addresses: [buildNewYorkAddress()],
    }),
    buildPartner({
      partnerType: 'forwarder',
      partnerId: isLLICA ? '0001002495' : '0001000000',
      sort1: 'MNG # 1000000',
      sort2: 'MNG # FWA DUMMY',
      name: 'MANGO ONLINE  # FWA DUMMY Return Management by the Customer',
      surname: 'Van Houten',
      language: 'ES',
      ExpressDeliveryCompany: '1000000',
      externalCode: isLLICA ? '3009' : '3212',
      ...buildCommonPartnerFields('555333444', 'milhouse.vanhouten@springfield.com'),
      addresses: [
        buildAddress({
          addressNumber: '0000044951',
          address: 'Mango Central',
          postalCode: '08184',
          city: 'Palau Solità i Plegamans',
          country: 'ES',
          regionType: '08',
          regionDescription: 'Barcelona',
        }),
      ],
    }),
    buildPartner({
      partnerType: 'shipTo',
      partnerId: '0000000398',
      sort1: 'MNG # 398',
      sort2: 'MNG # 10398',
      name: 'NEW YORK Broadway 561 ST MANGO # OS ST # 398',
      language: 'EN',
      externalCode: '0000010398',
      ...buildCommonPartnerFields('2123437012', 'ned.flanders@springfield.com'),
      addresses: [buildNewYorkAddress()],
    }),
    buildPartner({
      partnerType: 'onlineSalesCustomer',
      partnerId: 'OL00011592',
      name: 'Moe',
      surname: 'Szyslak',
      language: 'EN',
      ...buildCommonPartnerFields('555777888', 'moe.szyslak@springfield.com'),
      addresses: [
        buildAddress({
          addressNumber: '9173617020',
          address: "Moe's Tavern",
          postalCode: '61-772',
          city: 'Poznań',
          country: 'PL',
          regionType: 'WP',
          regionDescription: 'Wielkopolskie',
        }),
      ],
    }),
    buildPartner({
      partnerType: 'returnTo',
      partnerId: '0064100019',
      name: 'Krusty',
      surname: 'The Clown',
      language: 'ES',
      ...buildCommonPartnerFields('555999000', 'krusty.theclown@springfield.com'),
      addresses: [
        buildAddress({
          addressNumber: '0000164435',
          address: 'Krusty Burger',
          postalCode: '1099',
          city: 'Bruselas X',
          country: 'BE',
          countryDescription: 'Bélgica',
          regionType: 'WHT',
          regionDescription: 'Hainaut',
        }),
      ],
    }),
    buildPartner({
      partnerType: 'returnForwarder',
      partnerId: '0001012814',
      name: 'Chief',
      surname: 'Wiggum',
      language: 'ES',
      ExpressDeliveryCompany: '1012814',
      externalCode: '3212',
      returnLblNr: '323202381100000000419050',
      ...buildCommonPartnerFields('555444555', 'chief.wiggum@springfield.com'),
      addresses: [
        buildAddress({
          addressNumber: '0000042681',
          address: 'Springfield Police Station',
          postalCode: '15179',
          city: 'LA CORUÑA',
          country: 'ES',
          regionType: '15',
          regionDescription: 'La Coruña',
        }),
      ],
    }),
  ];

  const aditionalText = {
    pickingInstructions: '',
    packingInstructions: '',
    handlingUnitInstructions: '',
  };

  const padNumber = (num: number, length: number) => num.toString().padStart(length, '0');

  const deliveryDetail = (() => {
    let globalCount = 0;

    return order.items.flatMap((item) => {
      const details: any[] = [];
      for (let i = 0; i < item.quantity; i++) {
        globalCount++;
        details.push({
          deliveryData: {
            deliveryNumber: order.id,
            deliveryItem: `9${padNumber(globalCount, 5)}`,
            plant: order.site,
            storageLocation: 'P001',
            qtyDelivered: 1,
            salesUnit: 'EA',
            stockOutReason: '',
          },
          customerOrderData: {
            documentNumber: order.id,
            itemNumber: `${padNumber(globalCount, 6)}`,
            documentSDcurrency: getCurrency(),
            documentCIFCurrency: getCurrency(),
            customerReference: order.id,
            customerReferenceDate: getDateOnly(),
            referenceCode: '',
            netUnitPrice: 75.62,
            netTotalPrice: 75.62,
            grossUnitPrice: 0.01,
            grossTotalPrice: 0.01,
            cifValueUnitItem: 0,
            cifValueTotalItem: 0,
            cifValueTotalItemEUR: 0,
          },
          material: {
            SKU: item.sku ?? '',
            ean: item.ean,
            requirementSegment: 'XXXXXXXXXXP',
            stockSegment: 'IN 0MNGMOL',
            batchNumber: '',
            commercialReferenceOrig: getCommercialReference(),
            commercialReferenceDest: getCommercialReference(),
            color: '99',
            size: '20',
            netWeight: 577,
            grossWeight: 660,
            countryOfOrigin: 'IN',
            description: '',
            harmonizedSystemCode: '6204430000',
            compositions: [],
            characteristics: {
              gender: 'MANGO SHE',
              beauty: '',
              dangerousGoodsIndicator: '',
            },
            unitPrice: '0',
            eCommerce_EAN: item.ean,
            eCommerceItemDetail: '870047872099',
          },
        });
      }
      return details;
    });
  })();

  const handlingUnit: any[] = [];

  const payload = {
    deliveryBasicInfo,
    deliveryShipInfo,
    documentData,
    deliveryDates,
    customerData,
    deliveryPartners,
    aditionalText,
    deliveryDetail,
    handlingUnit,
  };

  return JSON.stringify(payload);
};
