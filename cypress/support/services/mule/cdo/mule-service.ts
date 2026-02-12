import { createASN, createAsnUrl, loginMuleAnypoint } from './mule-mapper';
import UUIDService from '../../uuid/uuid-service';

class MuleService {
  private static cachedToken: string | undefined;

  static request<T>(params: { body: any; token?: string; url: string; method: string }): Cypress.Chainable<any> {
    return cy
      .request({
        ...params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: params.token ? `Bearer ${params.token}` : undefined,
        },
      })
      .then((response) => response.body as T);
  }

  static getToken(): Cypress.Chainable<string> {
    if (MuleService.cachedToken) {
      return cy.wrap(MuleService.cachedToken);
    }
    return MuleService.request<{ data: { access_token: string } }>({
      url: (Cypress.env('mule') as string).concat('/accounts/login'),
      method: 'POST',
      body: loginMuleAnypoint(),
    }).then((data: { access_token: string }) => {
      if (data?.access_token) {
        console.warn({ MuleServiceToken: data?.access_token });
        MuleService.cachedToken = data?.access_token as string;
        if (!MuleService.cachedToken) throw new Error('No se establecio el token.');
        return MuleService.cachedToken;
      }
    });
  }

  static createAsn(params: { token: string; container: string; site: string; asnId: string }): Cypress.Chainable<boolean> {
    return UUIDService.createUUID().then((uuid) => {
      return MuleService.request<any>({
        ...params,
        method: 'PUT',
        url: createAsnUrl({ ...params, uuid }),
        body: JSON.stringify({
          properties: {
            contentType: 'application/json; charset=UTF-8',
          },
          body: createASN(params),
        }),
      }).then((data?: { status: string }) => data?.status === 'successful');
    });
  }
}

export default MuleService;
