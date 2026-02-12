export const loginMuleAnypoint = (): string => `
{
    "username": "anypoint-monitoring",
    "password": "Mango123"
}
`;

export const createASN = (params: { asnId: string; container: string; site: string }): string => `
{
    "asnBasicInfo": {
        "asnId": "${params.asnId}",
        "actionDateTime": "2025-01-21 14:52:32",
        "externalReference": "${params.asnId}",
        "creationDateTime": "2025-01-21T14:52:27Z",
        "purchaseOrder": "${params.asnId}",
        "purchaseType": "ZRP1",
        "totalPackages": "00001",
        "billOfLading": ""
    },
    "asnShipInfo": {
        "destination": "${params.site}",
        "shippingType": "ZEL",
        "incoterm": "",
        "shipLocation": "",
        "shipCountry": "",
        "transportType": "Air Standard",
        "transportConditions": [
            {
                "container": "",
                "plate": "",
                "truckNumber": "",
                "truckPlate": ""
            }
        ],
        "deliveryDates": {
            "deliveryDate": "2025-01-27",
            "arrivalExpected": ""
        }
    },
    "asnPartners": [
        {
            "partnerType": "LF",
            "partnerId": "D001",
            "name": "LLIÇÀ"
        },
        {
            "partnerType": "OSP",
            "partnerId": "${params.site}",
            "name": "Mango 3PL - CDO USA"
        }
    ],
    "asnItems": [
        {
            "asnItem": "900001",
            "SKU": "21100092HP20242",
            "EAN": "8447144920467",
            "UOM": "EA",
            "purchaseOrder": "${params.asnId}",
            "purchaseItem": "000010",
            "transportationGroup": "0001",
            "loadingGroup": "0001",
            "storageLocation": "P001",
            "storageLocationOrigin": "P001",
            "expectedQuantity": 7.000,
            "stockType": "S"
        },
        {
            "asnItem": "900002",
            "SKU": "21100092HP31440",
            "EAN": "8447144071176",
            "UOM": "EA",
            "purchaseOrder": "${params.asnId}",
            "purchaseItem": "000020",
            "transportationGroup": "0001",
            "loadingGroup": "0001",
            "storageLocation": "P001",
            "storageLocationOrigin": "P001",
            "expectedQuantity": 1.000,
            "stockType": "S"
        }
    ],
    "asnPackaging": [
        {
            "boxNumber": "${params.container}",
            "confirmationType": "",
            "packagingMaterials": "1A",
            "weight": 4.589,
            "tareWeight": 0.900,
            "UOMWeight": "KGM",
            "volume": 0.098,
            "netVolume": 0.012,
            "UOMVolume": "MTQ",
            "packagingDetail": [
                {
                    "asnItem": "900001",
                    "EAN": "8447144920467",
                    "SKU": "21100092HP20242",
                    "dataMatrix": null,
                    "expectedQuantity": 7.000,
                    "stockType": "S"
                },
                {
                    "asnItem": "900002",
                    "EAN": "8447144071176",
                    "SKU": "21100092HP31440",
                    "dataMatrix": null,
                    "expectedQuantity": 1.000,
                    "stockType": "S"
                }
            ]
        }
    ]
}
`;

export const createAsnUrl = (params: { site: string; uuid: string }): string =>
  `https://mq-eu-west-1.anypoint.mulesoft.com/api/v1/organizations/8cc3c35b-b952-4c8b-ba8a-fe0dbe73c325/environments/3912f7f1-e711-40ee-8af3-60586a5547c6/destinations/wms-asn-3pl-${params.site}-queue/messages/${params.uuid}`;
