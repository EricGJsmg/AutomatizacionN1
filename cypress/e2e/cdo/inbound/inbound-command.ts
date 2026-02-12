import RFInboundUnloadPage from '../../../pages/cdo/rf-inbound-unload-page';
import GqlService from '../../../support/services/gql/gql-service';
import MuleService from '../../../support/services/mule/cdo/mule-service';

Cypress.Commands.add('createAsn', ({ site, dispositivo, localizacion } = {}) => {
  return cy.newContainer({ dispositivo, localizacion }).then((container: string) => {
    return MuleService.getToken().then((token: string) => {
      return cy.getAvailableAsnId({ localizacion }).then((asnId: string) => {
        return MuleService.createAsn({ site, container, asnId, token }).then((success: boolean) => {
          const maxAttempts = 50;
          const interval = 10000;
          let attempts = 0;

          function checkEntries(): any {
            return GqlService.getEntradas({
              localizacion,
              query: `where: { ent_codigo_externo: "${asnId}" }`,
            }).then((asns: any[]) => {
              if (asns?.length) {
                const createAsnData = {
                  success,
                  container,
                  asnId,
                  status: asns[0].ent_estado.ei_desc_corta,
                  entrada: asns[0].ent_numero,
                };

                cy.bLog({
                  msg: {
                    message: `${createAsnData.success ? 'ASN creada con exito' : 'Error al intentar crear la ASN, revise que Mule este operativo.'}`,
                    createAsnData,
                  },
                });

                return cy.wrap(createAsnData);
              } else if (attempts >= maxAttempts) {
                cy.bLog({
                  msg: {
                    message: `Error: se espero demasiado al servicio de Mule, verifique que el mismo se encuentre operativo. `,
                  },
                });
                throw new Error('No se pudo procesar la asn.');
              } else {
                attempts++;
                cy.bLog({
                  msg: {
                    message: `Intento ${attempts}: Aun no se proceso la asn, esperando...`,
                  },
                });
                console.warn(`Intento ${attempts}: Aun no se proceso la asn...`);
                return cy.wait(interval).then(checkEntries);
              }
            });
          }

          return checkEntries();
        });
      });
    });
  });
});

Cypress.Commands.add('openAsn', ({ localizacion, dispositivo, warehouse, entrada, elemento } = {}) => {
  return cy.getWarehouses({ localizacion, warehouse }).then((warehouses: any[]) => {
    expect(warehouses, 'El almacen deberia existir').to.not.be.undefined.and.to.not.be.empty;
    return GqlService.abrirEntrada({
      localizacion,
      dispositivo,
      entrada,
      warehouse: warehouses![0].almi_numero,
      elemento,
    }).then((asn?: any) => {
      return GqlService.getEntradas({ localizacion, query: `where: { ent_numero: ${entrada} }` }).then((asns: any[]) => {
        const asnStatus: string = asns?.length ? asns[0].ent_estado.ei_desc_corta : 'ASN no encontrada.';

        cy.bLog({
          msg: {
            message: `${asnStatus === 'OPEN' ? 'ASN abierta con exito' : 'Error al intentar abrir la ASN.'}`,
            ...(asns[0].ent_estado as any),
          },
        });

        expect(asnStatus, 'El estado deberia ser OPEN').to.be.equal('OPEN');

        return cy.wrap(asn);
      });
    });
  });
});

Cypress.Commands.add('launchAsn', ({ localizacion, dispositivo, entrada } = {}) => {
  return GqlService.lanzarEntrada({
    localizacion,
    dispositivo,
    entrada,
  }).then((asn?: any) => {
    return GqlService.getEntradas({ localizacion, query: `where: { ent_numero: ${entrada} }` }).then((asns: any[]) => {
      const asnStatus = asns?.length ? asns[0].ent_estado.ei_desc_corta : 'ASN no encontrada.';

      cy.bLog({
        msg: {
          message: `${asnStatus === 'PROCES' ? 'ASN lanzada con exito' : 'Error al intentar lanzar la ASN.'}`,
          ...(asns[0].ent_estado as any),
        },
      });

      expect(asnStatus, 'El estado deberia ser PROCES').to.be.equal('PROCES');
      return cy.wrap(asn);
    });
  });
});

Cypress.Commands.add('unloadAsn', ({ localizacion, entrada, container } = {}) => {
  cy.disconnectAllRadios()
    .connectRadio({ localizacion, profile: '(Ubicación|Ubicado)' })
    .taskSelect(['Inbound', 'Descarga camión'])
    .then(() => {
      const unloadPage: RFInboundUnloadPage = new RFInboundUnloadPage();
      unloadPage.insertEntrada(entrada.toString());
      unloadPage.insertContainer(container);
      unloadPage.unload();
      unloadPage.confirm();
      unloadPage.exit();
      return GqlService.getEntradas({ localizacion, query: `where: { ent_numero: ${entrada} }` }).then((asns: any[]) => {
        const asnStatus: string = asns?.length ? asns[0].ent_estado.ei_desc_corta : 'ASN no encontrada.';

        cy.bLog({
          msg: {
            message: `${asnStatus === 'CLOSED' ? 'ASN cerrada con exito' : 'Error al intentar cerrar la ASN.'}`,
            ...(asns[0].ent_estado as any),
          },
        });

        expect(asnStatus, 'El estado deberia ser CLOSED').to.be.equal('CLOSED');
        if (!asns || asns.length === 0) return;

        return GqlService.inboundInterfaceReceiptsVerification({
          localizacion,
          query: `where:{ hsent_codigo_externo: "${asns[0].ent_codigo_externo}" }`,
        }).then((interfaces: any[]) => {
          const asnInterfaceStatus = interfaces?.length ? interfaces[0].hsent_estado.ei_desc_corta : 'Interface ASN no encontrada.';

          cy.bLog({
            msg: {
              ...interfaces[0],
              message: `${asnInterfaceStatus === 'ITFPRO' ? 'Interface con el estado ITFPRO, descarga realizada exitosamente' : 'Error al intentar comprobar el estado de la interface.'}`,
            },
          });

          expect(asnInterfaceStatus, 'El estado deberia ser ITFPRO').to.be.equal('ITFPRO');
        });
      });
    });
});
