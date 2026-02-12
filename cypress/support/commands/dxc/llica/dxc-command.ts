import GqlService from '../../../services/gql/gql-service';

Cypress.Commands.add('getOrdersLlica', ({ prefix = '', quantity = 1, localizacion } = {}) => {
  return cy.log('getOrders').then(() => {
    return GqlService.getOrdersWithPrefix({ prefix, quantity, localizacion }).then((orders) => {
      expect(orders, 'Deberian haber pedidos disponibles').to.not.be.empty;
      return cy.wrap(orders);
    });
  });
});
