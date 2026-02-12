import { postDescargaQr, postStockQr } from './mule-mapper';
import { DescargaResponse } from './mule-types';

class MuleService {
  static request<T>(query: string, token?: string, url?: string): Cypress.Chainable<any> {
    return cy
      .request({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Basic ${token}` : undefined,
        },
        body: query,
      })
      .then((response) => {
        if (![200, 201].includes(response.status)) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.body.data as T;
      });
  }

  static postStock(params: { token: string; skus: string }): Cypress.Chainable<any> {
    console.log('env-Mule: ' + Cypress.env('mule') + ' ' + params.token);
    const muleUrl = Cypress.env('mule');
    console.log(muleUrl);

    console.log({
      a: postStockQr(params.skus),
      b: params.token,
      c: (Cypress.env('mule') as string).concat('/uat-s-wms-llica/psorter/carrier/stored'),
    });
    return MuleService.request(postStockQr(params.skus), params.token, (Cypress.env('mule') as string).concat('/uat-s-wms-llica/psorter/carrier/stored')).then((response) => {
      // Aquí puede validar la respuesta y realizar transformaciones si es necesario
      // Verificar la respuesta
      expect([200, 201]).to.include(response.status);

      // Verificar que la respuesta contiene ciertos datos
      // expect(response.body).to.have.property('mensaje', 'Success');
      console.log('postStock(body): ' + response.status);
      return response.body as any;
    });
  }

  static postDescarga(params: {
    token: string;
    content: string;
    messageId: string;
    generationDate: string;
    trackId: string;
    batchType: string;
    batchSubType: string;
  }): Cypress.Chainable<DescargaResponse> {
    console.log('postDescargaQr: ' + postDescargaQr(params));
    return MuleService.request(postDescargaQr(params), params.token, (Cypress.env('mule') as string).concat('/uat-s-wms-llica/psorter/order/tote/unloaded')).then((response) => {
      // Aquí puede validar la respuesta y realizar transformaciones si es necesario
      // Verificar la respuesta
      expect([200, 201]).to.include(response.status);

      // Verificar que la respuesta contiene ciertos datos
      // expect(response.body).to.have.property('mensaje', 'Success');
      console.log('postDescarga(body): ' + response.status);
      return response.body as DescargaResponse;
    });
  }
}

export default MuleService;
