import GqlService from '../../../services/gql/gql-service';
import { Order, OrderMovement, Palet, Posicion, Puesto, Radio } from '../../../services/gql/gql-types';

Cypress.Commands.add('dxcValidateLocation', ({ relPath, haveFilters = false } = {}) => {
  const expectedUrl = `${Cypress.config('baseUrl')}/#${relPath}`;
  return cy
    .log('dxcValidateLocation')
    .url()
    .should('equal', expectedUrl)

    .then(() => {
      if (haveFilters) return cy.get('filtros', { timeout: 60000 }).should('be.visible');
      else return cy.wrap(null);
    });
});

Cypress.Commands.add('incrementMaterials', ({ orders, quantity = 1, localizacion, dispositivo } = {}) => {
  expect(orders, 'Deberia haber pedidos para incrementar material').to.not.be.empty;
  const incrementMaterialInfo: any = {};
  incrementMaterialInfo.orders = orders;
  return cy.log('incrementMaterials').then(() => {
    return GqlService.getMaterialsByOrder({ orders, localizacion }).then((artiExtCods) => {
      if (artiExtCods)
        return cy.adjustMaterials({ artiExtCods, quantity, localizacion, dispositivo }).then((adjustMaterialsInfo) => {
          incrementMaterialInfo.adjustMaterialsInfo = adjustMaterialsInfo;
          return incrementMaterialInfo;
        });
      return incrementMaterialInfo;
    });
  });
});

Cypress.Commands.add('addPrepareOrders', ({ prefix = 'CY', quantity = 1, article = '110070343036' } = {}) => {
  return cy.log('addPrepareOrders').then(() => {
    return cy.dbGetAllFromTable('orders').then((orders: string[]) => {
      if (orders?.length) return cy.log('Los pedidos ya se encuentran generados.'); // por si ya lo teniamos en la bd local

      return cy.getOrders({ prefix, quantity: 1 }).then((existingOrders: string[]) => {
        const exactMatch = existingOrders?.find((order) => order.trim() === prefix.trim());
        if (exactMatch) {
          cy.log(`Usando pedido existente: ${prefix}`); // coincide con pedido existente
          return cy.dbAddOrders([prefix]);
        }

        return cy.createOrder({ article, prefix, ordersQty: quantity }).then((newOrders) => {
          return cy.dbAddOrders(newOrders);
        });
      });
    });
  });
});

Cypress.Commands.add('getOrders', ({ prefix = '', quantity = 1, localizacion } = {}) => {
  return cy.log('getOrders').then(() => {
    return GqlService.getOrdersWithPrefix({ prefix, quantity, localizacion }).then((orders) => {
      return cy.wrap(orders);
    });
  });
});

Cypress.Commands.add('getPackingStatus', ({ orderId, localizacion } = {}) => {
  const retryPackingStatus: any = (attempt = 1) => {
    console.warn(`Intento ${attempt} de obtener el estado de la interface luego del packing`);
    return cy.bLog({ msg: { message: `Intento ${attempt} de obtener el estado de la interface luego del packing` } }).then(() => {
      return GqlService.getVerificationStatus({ orderId, localizacion }).then((packing: any) => {
        return cy.bLog({ msg: { message: `Estado de la interface luego del packing.`, packing } }).then(() => {
          if (packing?.status != 'INTERFACE_NOT_FOUND' || attempt === 6) {
            return packing.status;
          } else {
            // wait 5 seconds
            return cy.wait(5000).then(() => {
              return retryPackingStatus(attempt + 1);
            });
          }
        });
      });
    });
  };

  return cy.log('getPackingStatus').then(() => {
    return retryPackingStatus();
  });
});

Cypress.Commands.add('getExpeditionStatus', ({ id, localizacion } = {}) => {
  const retryExpeditionStatus: any = (attempt = 1) => {
    console.warn(`Intento ${attempt} de obtener el estado de expedicion`);
    return cy.bLog({ msg: { message: `Intento ${attempt} de obtener el estado de expedicion` } }).then(() => {
      return GqlService.getExpeditionStatus({ shipment: id, localizacion }).then((expedition: any) => {
        return cy.bLog({ msg: { message: `Estado de la interface de expedicion.`, expedition } }).then(() => {
          if (expedition?.status != 'INTERFACE_NOT_FOUND' || attempt === 6) {
            return expedition.status;
          } else {
            // wait 5 seconds
            return cy.wait(5000).then(() => {
              return retryExpeditionStatus(attempt + 1);
            });
          }
        });
      });
    });
  };

  return cy.log('getExpeditionStatus').then(() => {
    return retryExpeditionStatus();
  });
});

Cypress.Commands.add('getOrderDestination', ({ orderId, localizacion } = {}) => {
  return cy
    .log('getOrderDestination')
    .then(() => GqlService.getOrder({ localizacion, order: orderId }))
    .then((rOrder: Partial<Order> | undefined) => {
      if (rOrder) {
        return cy.wrap({ destination: rOrder!.ped_ruta_exped!.ruexpi_desc_corta, shipment: rOrder!.ped_destino_exp!.mdexi_desc_corta });
      } else {
        return cy.wrap({ destination: 'not found', shipment: 'not found' });
      }
    });
});

Cypress.Commands.add('getAssociateAvailablePositions', ({ localizacion } = {}) => {
  return cy.log('getAssociateAvailablePositions').then(() => {
    const query: string = `
      where:
      {
        AND: [
          { pal_pos_situ_CONTAINS: "AS_CTR" }
          { pal_pos_situ_NOT_CONTAINS: "AS_CTR_INC" }
          { pal_alm_situ: { almi_numero: 4015 } }
        ]
      }
      orderBy: pal_matricula_ASC
      `;
    return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
      return GqlService.getRelaciones({ localizacion }).then((positions: Partial<Posicion>[]) => {
        if (palets && positions) {
          const avalilablePositions: string[] = [];
          return cy
            .wrap(positions)
            .each((relation: Posicion) => {
              const coincide = palets.some((palet: Partial<Palet>) => palet.pal_pos_situ === relation.relpos_pos_principal);
              if (!coincide) avalilablePositions.push(relation.relpos_pos_principal);
            })
            .then(() => {
              return cy.wrap([...new Set(avalilablePositions)]);
            });
        } else return cy.wrap(undefined);
      });
    });
  });
});

Cypress.Commands.add('disconnectNode', ({ node, localizacion, dispositivo } = {}) => {
  return cy.log('disconnectNode').then(() => {
    return GqlService.getRadios({ localizacion }).then((radios: Radio[]) => {
      const connectedRadios = radios
        .filter((radio: Radio) => radio.rad_elemento?.elei_codigo === node && radio.rad_tipo?.pvci_valor === 'F') // filter the radios that match the node and be Desktop (F)
        .map((radio: Radio) => radio.rad_codigo);
      console.log({ connectedRadios, localizacion, node });
      if (connectedRadios?.length) return GqlService.disconnectAllRadios({ localizacion, dispositivo, radios: connectedRadios });
    });
  });
});

Cypress.Commands.add('confirmSorter', ({ localizacion, containers } = {}) => {
  if (localizacion != 5) return;
  return cy.log('confirmSorter').then(() => {
    return cy.wrap(containers).each((container: string) => {
      return GqlService.getOrderMovement({ localizacion, container }).then((orderMovement: Partial<OrderMovement> | undefined) => {
        if (!orderMovement) {
          console.warn({ method: 'confirmSorter', message: 'Orden de movimiento no encontrada.', container });
          return undefined;
        }
        console.warn({ orderMovement });
        const query: string = `where: { pal_matricula_CONTAINS_IC: "${container}" }`;
        return GqlService.getPalets({ localizacion, query }).then((palets: Partial<Palet>[]) => {
          if (palets.length <= 0) {
            console.warn({ method: 'confirmSorter', message: 'Palet no encontrado.', container });
            return undefined;
          }
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const editedPalet: Partial<Palet> = { pal_pos_situ: orderMovement.oma_posdes!.toString(), pal_est_mov: { ei_codigo: 1700 } };
          return GqlService.updatePalet({ localizacion, currentPalet: palets[0], editedPalet }).then((exito) => {
            console.warn({ method: 'confirmSorter', exito });
            if (!exito) return undefined;
            return GqlService.deleteOrderMovement({ localizacion, currentOma: orderMovement }).then((exito) => {
              console.warn({ method: 'confirmSorter', exito, container, omaCodigo: orderMovement.oma_codigo });
            });
          });
        });
      });
    });
  });
});

Cypress.Commands.add('getSerieStatus', ({ wave, localizacion } = {}) => {
  return cy.then(() => {
    return GqlService.getWaveStatus({ localizacion, wave });
  });
});

Cypress.Commands.add('getOrderStatus', ({ pedido, localizacion } = {}) => {
  return cy.then(() => {
    return GqlService.getOrderStatus({ localizacion, pedido });
  });
});

Cypress.Commands.add('getContainerStatus', ({ container, localizacion } = {}) => {
  return cy.then(() => {
    return GqlService.getContainerStatus({ localizacion, container });
  });
});

Cypress.Commands.add('getShipmentStatus', ({ shipment, localizacion } = {}) => {
  return cy.then(() => {
    return GqlService.getShipmentStatus({ localizacion, shipment });
  });
});

Cypress.Commands.add('adjustMaterials', ({ localizacion, dispositivo, artiExtCods, quantity } = {}) => {
  return cy.log('adjustMaterials').then(() => {
    const adjustMaterialsInfo: any[] = [];
    artiExtCods.map((articuloExt) => {
      console.log(articuloExt);
      const query: string = `
              where:
              {
                    AND: [
                      { bul_articulo: { arti_cod_ext: "${articuloExt}" } }
                      { bul_est_stock: { ei_codigo_IN: [1900] } }
                      { bul_subpalet: { pal_estado: { ei_desc_corta: "OK" } } }
                      { bul_subpalet: { pal_est_mov: { ei_desc_corta: "IDLE" } } }
                    ]
              }
            `;
      return GqlService.getBultos({ localizacion, query }).then((bultos: any[]) => {
        bultos.filter((bulto: any) => (bulto.acciones ?? []).includes('AjustarCantBul')); // acciones:['AjustarCantBul'] bultos enabled to adjust
        console.log('bultos ajustables ', bultos?.length ?? 0, ' articulo ', articuloExt);
        if (bultos?.length) {
          const material: any = {};
          // get bultos for each material, only select the first (makes no difference)
          const bulto = bultos[0];
          if (!bulto.bul_numero) return;

          delete bulto.acciones;
          material.bulto = bulto;
          material.currentQuantity = bulto.bul_cantidad;
          material.quantityToIncrement = quantity;
          material.newQuantity = bulto.bul_cantidad ?? 0 + quantity;
          return GqlService.ajustarCantidadBulto({
            localizacion,
            dispositivo,
            ...bulto,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            bul_numero: bulto.bul_numero,
            materialQuantity: material.newQuantity,
          }) // adjust material quantity
            .then((materialQuantityChanged) => {
              material.changed = materialQuantityChanged;
              adjustMaterialsInfo.push(material);
            });
        } else {
          const material: any = {};
          material.articulo = articuloExt;
          material.localizacion = localizacion;
          material.error = 'No se encontraron bultos ajustables relacionados al articulo';

          adjustMaterialsInfo.push(material);
        }
      });
    });
    return cy.wrap(adjustMaterialsInfo);
  });
});

Cypress.Commands.add('getAvailableAsnId', ({ localizacion } = {}) => {
  return GqlService.getEntradas({
    localizacion,
    query: `where: { ent_codigo_externo_CONTAINS: "CYL${localizacion}" } orderBy: ent_codigo_externo_DESC`,
  }).then((asns?: any[]) => {
    const lastAsn: string = asns?.length ? asns[0].ent_codigo_externo : `CYL${localizacion}000001`;
    const prefix = lastAsn.slice(0, 4);
    const numericPart = lastAsn.slice(4);
    return cy.wrap(prefix + (parseInt(numericPart, 10) + 1).toString().padStart(numericPart.length, '0'));
  });
});

Cypress.Commands.add('getWarehouses', ({ localizacion, warehouse } = {}) => {
  let query: string =
    typeof warehouse === 'number' && !isNaN(warehouse)
      ? `where: { almi_numero: ${warehouse} }`
      : `
            where: {
                    OR: [
                      { almi_gln_extension_CONTAINS_IC: "${warehouse}" }
                      { almi_desc_corta_CONTAINS_IC: "${warehouse}" }
                      { almi_desc_CONTAINS_IC: "${warehouse}" }
                      { almi_entrada_equiv: { almi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_ubicacion_equiv: { almi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_area: { ai_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_1: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_10: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_2: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_3: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_4: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_5: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_6: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_7: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_8: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_caract_9: { dcapvi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_gln: { glni_id_CONTAINS_IC: "${warehouse}" } }
                      { almi_localizacion: { loci_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_pue_impresion: { puei_nombre_CONTAINS_IC: "${warehouse}" } }
                      { almi_tipo_consol: { tconi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_tipo_ent_mat_ifaz: { tei_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_tp_div: { tpi_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_tipotele_dejapalet: { tti_define_CONTAINS_IC: "${warehouse}" } }
                      { almi_min_uma_nopico: { umai_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_uma_entrada: { umai_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_uma_paletiz: { umai_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_uma_rotacion: { umai_desc_corta_CONTAINS_IC: "${warehouse}" } }
                      { almi_accion_llegada_alm: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_accion_verificacion: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_acepta_picos: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_critasig_autest: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_crit_desasigna_ubi: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_encadena_oma: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_informa_movim: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_iniciar_ubicacion: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_organiz_ubi: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_tipo: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                      { almi_tipo_ajuste: { pvci_valor_CONTAINS_IC: "${warehouse}" } }
                    ]
                  }
    `;

  query += '  orderBy: [almi_numero_ASC]';
  return GqlService.getAlmacenes({
    localizacion,
    query,
  }).then((warehouses?: any[]) => cy.wrap(warehouses));
});

Cypress.Commands.add('newPaletWithMaterial', ({ localizacion, dispositivo, article, quantity, warehouse, position } = {}) => {
  return cy.getWarehouses({ localizacion, warehouse }).then((warehouses: { almi_numero: number }[]) => {
    expect(warehouses, 'El almacen deberia existir').to.not.be.undefined.and.to.not.be.empty;
    return cy.newContainer({ localizacion, dispositivo }).then((container) => {
      expect(container).not.to.be.empty;
      return GqlService.createContainerWithMaterial({
        localizacion,
        dispositivo,
        article,
        quantity,
        container,
        warehouse: warehouses![0].almi_numero,
        position,
      }).then((success: boolean) => {
        expect(success).to.be.true;
        return container;
      });
    });
  });
});

Cypress.Commands.add('puestoConnect', ({ localizacion, node } = {}) => {
  const query: string = `
      where: { dia_dispositivo: { disi_nodo: "${node}" } }
      orderBy: dia_dispositivo_ASC
  `;
  return GqlService.getDispsAsignados({
    localizacion,
    query,
  }).then((dispositivos: any[]) => {
    console.warn({ dispositivos: dispositivos.map((d) => d.dia_dispositivo.disi_codigo) });
    expect(dispositivos, 'Deberian haber dispositivos.').not.to.be.empty;

    node = dispositivos[0].dia_puesto.puei_nombre;
    const dispositivo: number = dispositivos[0].dia_dispositivo.disi_codigo;

    return GqlService.doConectarPuesto({
      localizacion,
      dispositivo,
      node,
    }).then((doConectarPuesto: any) => {
      console.warn({ doConectarPuesto });
      expect(doConectarPuesto?.exito === true, `Se deberia haber conectado el puesto ${node} loc: ${localizacion} disp: ${dispositivo}.`).to.be.true;

      GqlService.puesto = {
        idioma: 2,
        localizacion,
        node,
        dispositivo,
        site: dispositivos[0].dia_puesto.puei_localizacion.loci_desc_corta,
        locationDescription: dispositivos[0].dia_puesto.puei_localizacion.loci_desc,
        connected: doConectarPuesto?.exito === true,
      } as Puesto;

      console.warn({ puestoConectado: GqlService.puesto });

      return cy.wrap(GqlService.puesto);
    });
  });
});

Cypress.Commands.add('ensureStat', ({ expectedStatus, code, type, localizacion } = {}) => {
  let attempts = 0;

  function checkStatus(): any {
    let getStatus;

    switch (type) {
      case 'ORDER':
        getStatus = cy.getOrderStatus({ pedido: code, localizacion });
        break;
      case 'WAVE':
        getStatus = cy.getSerieStatus({ wave: code, localizacion });
        break;
      case 'CONTAINER':
        getStatus = cy.getContainerStatus({ container: code, localizacion });
        break;
      case 'SHIPMENT':
        getStatus = cy.getShipmentStatus({ shipment: Number(code), localizacion });
        break;
      default:
        throw new Error(`Invalid type: ${type}. Must be 'ORDER', 'WAVE', 'CONTAINER', or 'SHIPMENT'.`);
    }
    return getStatus.then((currentState) => {
      if (currentState === expectedStatus || attempts > 120) {
        const message: string =
          currentState === expectedStatus
            ? `El estado del ${type} (${code}) es el esperado en este momento (${expectedStatus}).`
            : `Fail: el estado de ${code} (${type}) debería ser ${expectedStatus}, actual: ${currentState}`;
        cy.bLog({ msg: { message } });

        return cy.then(() => {
          expect(currentState).to.equal(expectedStatus, `El estado de ${code} (${type}) debería ser ${expectedStatus}, actual: ${currentState}`);
        });
      } else {
        console.warn(`Intento ${attempts} de comprobar el estado de [${code}] [${type}], debería ser [${expectedStatus}], actual: [${currentState}]`);
        attempts++;
        cy.wait(1000);
        return checkStatus();
      }
    });
  }

  return checkStatus();
});

Cypress.Commands.add('getPuesto', () => cy.wrap(GqlService.puesto || undefined));
