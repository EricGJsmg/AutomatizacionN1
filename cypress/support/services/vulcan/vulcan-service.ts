import { buildOrderPayload, report } from './vulcan-mapper';
import { VulcanResponse } from './vulcan-model';
import { Report } from '../db/db-types';
import GqlService from '../gql/gql-service';
import UUIDService from '../uuid/uuid-service';

class VulcanService {
  static request<T>(options: { body: any; endpoint: string; method: string; token: string }): Cypress.Chainable<any> {
    const requestInfo = {
      endpoint: options.endpoint,
      method: options.method,
      body: options.body,
      url: `${Cypress.env('vulcanUrl') as string}${options.endpoint}`,
    };

    return cy
      .bLog({
        msg: {
          message: `Request to Vulcan Service`,
          request: requestInfo,
        },
      })
      .request({
        ...options,
        url: requestInfo.url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: options.token ? `Bearer ${options.token}` : undefined,
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        const responseBody = response.body as VulcanResponse<T>;
        const isError = response.status >= 400 || responseBody.isError;

        return cy
          .bLog({
            msg: {
              message: isError ? 'Error in Vulcan Service Response' : 'Response from Vulcan Service',
              ...(isError
                ? {
                    status: response.status,
                    statusText: response.statusText,
                    errorCode: responseBody.errorCode,
                    errorDetails: responseBody.errorDetails,
                    errorParams: responseBody.errorParams,
                  }
                : {}),
              response: responseBody,
            },
          })
          .then(() => responseBody);
      });
  }

  static reportTests(options: { report: Report }): Cypress.Chainable<any> {
    return GqlService.getToken({
      url: Cypress.env('vulcanAuthUrl'),
      username: atob('ZGVzYQ=='),
      password: atob('cnJvbGxv'),
      tokenOnly: true,
    }).then((token: string) => {
      return VulcanService.request<VulcanResponse>({
        body: report(options.report),
        token,
        endpoint: '/persistTestsFromJson',
        method: 'POST',
      }).then((data) => data.isError === false);
    });
  }

  static createOrder(order: { id: string; site: string }): Cypress.Chainable<any> {
    return UUIDService.createUUID().then((uuid) => {
      return GqlService.getToken({
        url: Cypress.env('vulcanAuthUrl'),
        username: atob('ZGVzYQ=='),
        password: atob('cnJvbGxv'),
        tokenOnly: true,
      }).then((token: string) => {
        return VulcanService.request<VulcanResponse<{ status: string }>>({
          body: {
            uuid,
            site: order.site,
            body: buildOrderPayload({
              id: order.id,
              type: 'ZOD2',
              route: 'CY',
              items: [
                {
                  ean: '8445661904113',
                  sku: '22303165MJ00138',
                  quantity: 1,
                },
              ],
              date: new Date().toISOString(),
              site: order.site,
            }),
          },
          token,
          endpoint: '/createOrder',
          method: 'POST',
        }).then((resp) => resp?.result?.status === 'successful');
      });
    });
  }
}

export default VulcanService;
