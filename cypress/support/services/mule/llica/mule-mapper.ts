/* eslint-disable @typescript-eslint/naming-convention */
export const postStockQr = (skus: string): string => `{
  "basicInfo": {
    "messageId": "2023-12-24T10:02:39.891Z-FD-6126257",
    "messageType": "CARRIERS_STORED_IN_PS",
    "generationDate": "2023-12-24T10:02:39.8910207Z",
    "retries": 0,
    "version": "v1",
    "OMI": "N"
  },
  "SKUs": [
    ${skus}
  ]
}`;

export const postDescargaQr = (params: { content: string; messageId: string; generationDate: string; trackId: string; batchType: string; batchSubType: string }): string => `{
    "basicInfo": {
        "messageId": "${params.messageId}",
        "messageType": "TOTE_UNLOADED",
        "generationDate": "${params.generationDate}",
        "retries": 0,
        "version": "v1",
        "OMI": "N"
        },
        "containerType": "Tote",
        "trackId": "${params.trackId}",
        "position": "PSTOTEUNL04",
        "batchType": "${params.batchType}",
        "batchSubType": "${params.batchSubType}",
        "status": "OK",
        "blocked": "",
        "containerDestination": "PSTOTEEXIT",
        "content": [
          ${params.content}
        ]
}`;
