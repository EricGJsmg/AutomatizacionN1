import { OrderMovement, Palet } from './gql-types';

export const login = (params: { username: string; password: string }): string => `
  mutation login {
      doLogin(idioma: 2, usuarioAut: "${params.username}", clave: "${params.password}") {
          token
      }
  }
`;

/** code: 1 (SSCC) | 2 (EAN128) | 20 (99) | null (EAN128) */
export const doCrearMatricula = (params: { localizacion: number; dispositivo: number; type?: number; code?: 1 | 2 | 20 | null }): string => `
  mutation doCrearMatricula {
      doCrearMatricula(
          idioma: 2
          localizacion: ${params.localizacion}
          dispositivo: ${params.dispositivo}
          cia_codigo: "MANGO"
          omr_codigo: null
          ent_numero: null
          alm_numero: 5017
          tp_tipo: ${params.type ?? 100}
          tm_codigo: ${params.code ?? null}
          proceso: "E"
      ) {
          exito
          pal_matricula
          texto_error
      }
  }
`;

export const doLanzarSerie = (params: { serCodigo: string; localizacion: number; dispositivo: number }): string => `
  mutation doLanzarSerie {
      doLanzarSerie(
          idioma: 2
          localizacion: ${params.localizacion}
          dispositivo: ${params.dispositivo}
          ser_codigo: "${params.serCodigo}"
          crea_borrador_sn: false
          tipo_lanza: 510
          num_ped: 1
          num_agr: 1
          ser_estado: 1410
      ) {
          exito
          ser_codigo
      }
  }
`;

export const getRadios = (params: { localizacion: number }): string => `
  query getRadios {
    getRadios(
    idioma: 2
    localizacion: ${params.localizacion}
    orderBy: rad_codigo_DESC
    limit: 1001
    ) {
    rad_codigo
    rad_tipo {
      pvci_valor
    }
    rad_libre
    rad_elemento {
      elei_almacen {
        almi_numero
        __typename
      }
      elei_codigo
      __typename
    }
    rad_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    rad_usuario {
      usr_codigo
      usr_nombre
      usr_nivel_mensaje {
        pvci_tabla
        pvci_atributo
        pvci_valor
        pvci_json_render
        pvci_desc
        __typename
      }
      usr_json_render
      __typename
    }
    acciones
    __typename
  }
}
`;

export const doDesconectarRadio = (params: { localizacion: number; dispositivo: number; radios: number[] }): string => `
  mutation doDesconectarRadio {
    doDesconectarRadio(
      idioma: 2
      localizacion: ${params.localizacion}
      dispositivo: ${params.dispositivo}
      rad_codigo: [${params.radios.join(',')}]
    ) {
      exito
    }
  }
`;

export const doMoverContenedor = (params: { localizacion: number; contenedor: string }): string => `
  mutation doEjecutarAccion {
  doEjecutarAccion(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: 99933
    frmp_codigo: 19
    argEjecutarAccion: [
      {
        t_argumento: "v_Contenedor"
        t_tipo_argumento: "STRING"
        t_valor_argumento: "${params.contenedor}"
        t_formato_argumento: null
      }
    ]
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    __typename
  }
}
`;

export const doSimulateLabel = (params: { localizacion: number; order: string }): string => `
  mutation doEjecutarAccion {
  doEjecutarAccion(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: 99933
    frmp_codigo: 23
    argEjecutarAccion: [
      {
        t_argumento: "var_order"
        t_tipo_argumento: "STRING"
        t_valor_argumento: "${params.order}"
        t_formato_argumento: null
      }
    ]
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    __typename
  }
}
`;

export const doClearRadio = (params: { localizacion: number; radio: number }): string => `
  mutation doClearRadio($radioId: Int! = ${params.radio}) {
    doClearRadio(radioId: $radioId, location: ${params.localizacion}) {
      count
      status
      success
      __typename
    }
  }
`;

export const getBultos = (params: { localizacion: number; query?: string }): string => `
  query getBultos {
  getBultos(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    orderBy: bul_cantidad_DESC
    limit: 10000
  ) {
    bul_numero
    bul_fecha_creado
    bul_fecha_entrada
    bul_palet {
      pal_numero
      pal_matricula
      __typename
    }
    bul_subpalet {
      pal_numero
      pal_matricula
      pal_padre {
        pal_numero
        pal_matricula
        __typename
      }
      pal_tipo {
        tpi_tipo
        tpi_desc_corta
        tpi_desc
        tpi_json_render
        __typename
      }
      pal_alm_situ {
        almi_numero
        almi_desc_corta
        almi_desc
        __typename
      }
      pal_pos_situ
      pal_fecha_movim
      pal_estado {
        ei_codigo
        ei_define
        ei_desc_corta
        ei_desc
        ei_atributo
        __typename
      }
      pal_est_mov {
        ei_codigo
        ei_define
        ei_desc_corta
        ei_desc
        ei_atributo
        __typename
      }
      pal_numsubpal
      pal_numbultos
      pal_altura
      pal_comentado_sn
      pal_volumen
      pal_peso
      pal_sscc
      pal_num_sscc
      pal_alm_des {
        almi_numero
        almi_desc_corta
        almi_desc
        __typename
      }
      pal_pos_des
      pal_salida {
        sal_codigo
        __typename
      }
      pal_agrdep
      pal_destino {
        mdpi_codigo
        mdpi_desc_corta
        mdpi_desc
        __typename
      }
      pal_agrupacion {
        agr_numero
        agr_serie {
          ser_codigo
          __typename
        }
        __typename
      }
      pal_expedicion {
        exp_codigo
        __typename
      }
      pal_numetiq_transp
      pal_impreso_exp_sn
      pal_numetiq_alb
      pal_localizacion_origen {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_json_render
        __typename
      }
      pal_cia {
        ciai_codigo
        ciai_desc
        ciai_json_render
        __typename
      }
      pal_mat_camion
      pal_ctexp {
        ctexpi_codigo
        ctexpi_desc_corta
        ctexpi_desc
        __typename
      }
      pal_matricula_asn
      pal_ccr
      pal_numaux1
      pal_numaux2
      pal_numaux3
      pal_numaux4
      pal_numaux5
      pal_charaux1
      pal_charaux2
      pal_charaux3
      pal_charaux4
      pal_charaux5
      pal_dateaux1
      pal_dateaux2
      pal_dateaux3
      pal_dateaux4
      pal_dateaux5
      pal_caract_1 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_2 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_3 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_4 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_5 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_6 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_7 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_8 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_9 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_10 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      __typename
    }
    bul_est_stock {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    bul_cantidad
    bul_articulo {
      arti_cod_int
      arti_cia {
        ciai_codigo
        ciai_desc
        ciai_json_render
        __typename
      }
      arti_cod_ext
      arti_desc
      arti_json_render
      __typename
    }
    bul_estado_reserva {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    bul_comentado_sn
    bul_lote
    bul_mot_bloq
    bul_caducidad
    bul_linea_entrada {
      lent_entrada {
        ent_numero
        __typename
      }
      lent_linea
      __typename
    }
    bul_tipo_entrada {
      tei_tipo
      tei_desc_corta
      tei_desc
      tei_json_render
      __typename
    }
    bul_proveedor {
      proi_cod_int
      proi_cod_ext
      proi_desc
      __typename
    }
    bul_original
    bul_reserva {
      resi_codigo
      resi_desc_corta
      resi_desc
      __typename
    }
    bul_cant_paralela
    bul_fecha_fab
    bul_cant_verificada
    bloqueos {
      cbsi_codigo
      cbsi_desc_corta
      cbsi_desc
      __typename
    }
    acciones
    __typename
  }
}
`;

export const doAjustarCantidadBulto = (params: { localizacion: number; dispositivo: number; bulNumero: number; materialQuantity: number }): string => `
  mutation doAjustarCantidadBulto {
    doAjustarCantidadBulto(
      idioma: 2
      localizacion: ${params.localizacion}
      dispositivo: ${params.dispositivo}
      bul_numero: ${params.bulNumero}
      maju_codigo: 20
      bul_cantidad: ${params.materialQuantity}
    ) {
      exito
      bul_numero
    }
  }
`;

export const getPedidosArtiCodExt = (params: { localizacion: number; orders: string[] }): string => `
  query getPedidos {
    getPedidos(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        OR: [${params.orders.map((order) => `{ AND: [{ ped_num_host: "${order}" }] }`).join(', ')}]
      }
      orderBy: ped_num_host_ASC
    ) {
      ped_num_host
      lineas_pedido {
        lped_articulo {
          arti_cod_ext
        }
      }
    }
  }
`;

export const getOrdersWithPrefix = (params: { localizacion: number; prefix: string; quantity: number }): string => `
  query getPedidos {
    getPedidos(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        AND: [
          { ped_estado: { ei_codigo_IN: [1005] } }
          { ped_num_host_CONTAINS: "${params.prefix}" }
        ]
      }
      orderBy: ped_num_host_ASC
      limit: ${params.quantity}
    ) {
      ped_num_host
    }
  }
`;

export const getShPedidosCdo = (params: { localizacion: number; orderId: string }): string => `
  query getShPedidos {
    getShPedidos(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        AND: [
          { OR: [{ shped_ped_num_host_CONTAINS_IC: "${params.orderId}" }] }
          { shped_error: { cepi_define_NOT: "SEGMENTO_ERRONEO" } }
        ]
      }
      limit: 1
    ) {
      shped_ped_num_host
      shped_estado {
        ei_codigo
        ei_define
        ei_desc_corta
        ei_desc
        ei_atributo
        __typename
      }
      shped_evento {
        evifazi_codigo
        evifazi_desc
        evifazi_define
        __typename
      }
    }
  }
`;

export const getShExpedicionesCdo = (params: { localizacion: number; shipment: string }): string => `
  query getShExpediciones {
    getShExpediciones(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        AND: [
          { OR: [{ shexp_codigo: ${params.shipment} }] }
          { shexp_error: { cepi_define_NOT: "SEGMENTO_ERRONEO" } }
        ]
      }
      limit: 1
    ) {
      shexp_id
      shexp_codigo
      shexp_conjunto
      shexp_evento {
        evifazi_define
      }
    }
  }
`;

export const getShPedidos = (params: { localizacion: number; query?: string }): string => `
  query getShPedidos {
  getShPedidos(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
  ) {
    shped_id
    shped_dispositivo
    shped_localizacion
    shped_ped_num
    shped_ped_entrega
    shped_ped_tipo
    shped_ped_estado
    shped_ped_prioridad
    shped_ped_loc_destino
    shped_ped_destino
    shped_ped_alm_exped
    shped_ped_alm_consol
    shped_ped_tiempo_entrega
    shped_ped_pe_asociado
    shped_ped_secuencia
    shped_exp_codigo
    shped_alb_codigo
    shped_localizacion_destino
    shped_destino_exp
    shped_ruta_exped
    shped_transportista
    shped_zona_reparto
    shped_ped_peso_teorico
    shped_ped_vol_teorico
    shped_numaux1
    shped_numaux2
    shped_numaux3
    shped_numaux4
    shped_numaux5
    shped_usuario
    shped_loc_host
    shped_cia
    shped_ped_num_host
    shped_ped_tipo_host
    shped_ped_loc_destino_host
    shped_ped_cod_recep
    shped_ped_nombre_recep
    shped_ped_nif_recep
    shped_ped_direccion_recep
    shped_ped_poblacion_recep
    shped_ped_codpostal_recep
    shped_ped_provincia_recep
    shped_ped_pais_recep
    shped_ped_email_recep
    shped_ped_tlf_recep
    shped_ped_gln_recep
    shped_ped_gln_ext_recep
    shped_ped_cod_solic
    shped_ped_nombre_solic
    shped_ped_nif_solic
    shped_ped_direccion_solic
    shped_ped_poblacion_solic
    shped_ped_codpostal_solic
    shped_ped_provincia_solic
    shped_ped_pais_solic
    shped_ped_email_solic
    shped_ped_tlf_solic
    shped_ped_gln_solic
    shped_ped_gln_ext_solic
    shped_ped_ped_cliente
    shped_ped_texto_distr
    shped_ped_texto_clien
    shped_ped_ruta_host
    shped_ped_serie
    shped_ped_agrupacion
    shped_tipo_exp_host
    shped_carga
    shped_ped_pe_host_origen
    shped_ped_ele_exped
    shped_ped_ele_consol
    shped_charaux1
    shped_charaux2
    shped_charaux3
    shped_charaux4
    shped_charaux5
    shped_charaux6
    shped_charaux7
    shped_charaux8
    shped_charaux9
    shped_charaux10
    shped_charaux11
    shped_charaux12
    shped_charaux13
    shped_charaux14
    shped_charaux15
    shped_charaux16
    shped_charaux17
    shped_charaux18
    shped_charaux19
    shped_charaux20
    shped_caract_1
    shped_caract_2
    shped_caract_3
    shped_caract_4
    shped_caract_5
    shped_caract_6
    shped_caract_7
    shped_caract_8
    shped_caract_9
    shped_caract_10
    shped_caract_11
    shped_caract_12
    shped_caract_13
    shped_caract_14
    shped_caract_15
    shped_ped_direccion2_recep
    shped_ped_direccion2_solic
    shped_conjunto
    shped_canal_venta
    shped_mercado_solic
    shped_fecha_creacion
    shped_urgencia
    shped_ped_cliente
    shped_gln_extension_recep
    shped_gln_extension_solic
    shped_pe_host_asociado
    shped_tra_cod_ext
    shped_parerror
    shped_nombre_devos
    shped_direccion_devos
    shped_direccion2_devos
    shped_poblacion_devos
    shped_codpostal_devos
    shped_provincia_devos
    shped_pais_devos
    shped_nombre_online
    shped_nif_online
    shped_direccion_online
    shped_direccion2_online
    shped_poblacion_online
    shped_codpostal_online
    shped_provincia_online
    shped_pais_online
    shped_email_online
    shped_tlf_online
    shped_gln_online
    shped_gln_extension_online
    shped_fecha_insercion
    shped_ped_fec_recep
    shped_ped_fec_entre
    shped_ped_fec_carga
    shped_ped_fec_prep
    shped_ped_fec_exped
    shped_dateaux1
    shped_dateaux2
    shped_dateaux3
    shped_dateaux4
    shped_dateaux5
    shped_fec_envio_inc
    shped_fecha_tratamiento
    shped_fec_ini_pack
    shped_fec_fin_pack
    shped_cutoff_preparacion
    shped_ped_reexpedicion_sn
    shped_ped_comentado_sn
    shped_ped_exp_unica_sn
    shped_ped_recreado_sn
    shped_cancelado_sn
    shped_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    shped_evento {
      evifazi_codigo
      evifazi_desc
      evifazi_define
      __typename
    }
    shped_interfaz {
      ifazi_codigo
      ifazi_desc
      ifazi_codigo_host
      __typename
    }
    shped_error {
      cepi_codigo
      cepi_desc_corta
      cepi_desc
      __typename
    }
    __typename
  }
}
`;

export const getShExpediciones = (params: { localizacion: number; query?: string }): string => `
  query getShExpediciones {
  getShExpediciones(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
  ) {
    shexp_id
    shexp_dispositivo
    shexp_localizacion
    shexp_codigo
    shexp_tipo
    shexp_exp_estado
    shexp_sec_carga_actual
    shexp_crit_carga
    shexp_crit_destino_exp
    shexp_crit_alm_exp
    shexp_crit_loc_destino
    shexp_crit_grexp
    shexp_transportista
    shexp_servicio_transporte
    shexp_plt_sec_carga
    shexp_ele_almacen
    shexp_crit_ruta_exp
    shexp_palets_max_exp
    shexp_peso_max_exp
    shexp_volumen_max_exp
    shexp_numaux1
    shexp_numaux2
    shexp_numaux3
    shexp_numaux4
    shexp_numaux5
    shexp_usuario
    shexp_loc_host
    shexp_cia
    shexp_crit_cia
    shexp_crit_ccr
    shexp_crit_muelle_exp
    shexp_matricula
    shexp_tipo_portes
    shexp_cl_trans
    shexp_cl_exp
    shexp_urg
    shexp_matricula_remolque
    shexp_criterio_orden
    shexp_pue_impresion
    shexp_ele_puerta
    shexp_conjunto
    shexp_parerror
    shexp_charaux1
    shexp_charaux2
    shexp_charaux3
    shexp_charaux4
    shexp_charaux5
    shexp_charaux6
    shexp_charaux7
    shexp_charaux8
    shexp_charaux9
    shexp_charaux10
    shexp_fecha_insercion
    shexp_fecha_creacion
    shexp_fecha_inicio_carga
    shexp_fecha_ultima_carga
    shexp_fecha_cierre
    shexp_fecha_llegada_trans
    shexp_fecha_salida_trans
    shexp_fecha_tratamiento
    shexp_dateaux1
    shexp_dateaux2
    shexp_dateaux3
    shexp_dateaux4
    shexp_dateaux5
    shexp_carga_pal_sn
    shexp_generado_ftrans_sn
    shexp_comentado_sn
    shexp_carga_autor_sn
    shexp_admite_asig_auto_sn
    shexp_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    shexp_evento {
      evifazi_codigo
      evifazi_desc
      evifazi_define
      __typename
    }
    shexp_interfaz {
      ifazi_codigo
      ifazi_desc
      ifazi_codigo_host
      __typename
    }
    shexp_error {
      cepi_codigo
      cepi_desc_corta
      cepi_desc
      __typename
    }
    __typename
  }
}

`;

export const getProcesos = (params: { localizacion: number }): string => `
  query getProcesos {
    getProcesos(
      idioma: 2
      localizacion: ${params.localizacion}
      orderBy: [pr_modulo_ASC, pr_proceso_ASC]
      limit: 1000
    ) {
      pr_proceso
      pr_estado {
        ei_desc_corta
      }
    }
  }
`;

export const getRelacionesPosiciones = (params: { localizacion: number }): string => `
  query getRelacionesPosiciones {
    getRelacionesPosiciones(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        AND: [
          { relpos_pos_principal_CONTAINS: "AS_CTR" }
          { relpos_pos_principal_NOT_CONTAINS: "AS_CTR_INC" }
        ]
      }
      orderBy: [relpos_pos_principal_ASC]
      limit: 1001
    ) {
      relpos_pos_principal
      relpos_pos_alternativa
      relpos_alm_alternativo {
        almi_desc_corta
      }
      relpos_alm_principal {
        almi_desc_corta
      }
    }
  }
`;

export const getLineasPedido = (params: { localizacion: number; query?: string }): string => `
query getLineasPedido {
  getLineasPedido(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    limit: 101
  ) {
    lped_nlinea
    lped_cant_host
    lped_cantpedida
    lped_cantformador
    lped_cantsacada
    lped_cantexped
    lped_cantnoserv
    lped_lote_fijo_sn
    lped_comentado_sn
    lped_utiliza_stk_kit_sn
    lped_lote
    lped_fec_recep
    lped_fec_serv
    lped_fec_exped
    lped_reserva_host
    lped_matricula
    lped_precio
    lped_iva
    lped_cant_host_ultima
    lped_fec_ultima_act
    lped_cant_pte_cancelar
    lped_cant_cancelada
    lped_numaux1
    lped_numaux2
    lped_numaux3
    lped_numaux4
    lped_numaux5
    lped_charaux1
    lped_charaux2
    lped_charaux3
    lped_charaux4
    lped_charaux5
    lped_dateaux1
    lped_dateaux2
    lped_dateaux3
    lped_dateaux4
    lped_dateaux5
    lped_veces_recreado
    lped_cantexceso
    lped_charaux6
    lped_charaux7
    lped_charaux8
    lped_charaux9
    lped_charaux10
    lped_caract_1 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_2 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_3 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_4 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_5 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_6 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_7 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_8 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_9 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_caract_10 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    lped_articulo {
      arti_cod_int
      arti_cia {
        ciai_codigo
        ciai_desc
        ciai_json_render
        ciai_art_valija {
          arti_cod_int
          __typename
        }
        __typename
      }
      arti_cod_ext
      arti_desc
      arti_uni_base {
        muni_codigo
        muni_desc_corta
        muni_codigo_iso
        muni_json_render
        __typename
      }
      arti_uni_paralela {
        muni_codigo
        muni_desc_corta
        muni_codigo_iso
        muni_json_render
        __typename
      }
      arti_lote_sn
      arti_caducidad_sn
      arti_json_render
      articulos_eans {
        artean_ean
        __typename
      }
      arti_caract_6 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      __typename
    }
    lped_uni_host {
      muni_codigo
      muni_desc_corta
      muni_codigo_iso
      muni_json_render
      __typename
    }
    lped_pedido {
      ped_num
      ped_num_host
      ped_cia {
        ciai_codigo
        ciai_desc
        ciai_json_render
        ciai_art_valija {
          arti_cod_int
          __typename
        }
        __typename
      }
      ped_tipo {
        tpedi_codigo
        tpedi_desc_corta
        tpedi_desc
        tpedi_json_render
        tpedi_categoria
        __typename
      }
      ped_entrega
      ped_ped_cliente
      __typename
    }
    lped_reserva {
      resi_codigo
      resi_desc_corta
      resi_desc
      __typename
    }
    lped_tns {
      tnsi_codigo
      tnsi_desc_corta
      tnsi_desc
      __typename
    }
    acciones
    __typename
  }
}
`;

export const getStatPedido = (params: { localizacion: number; pedido: string }): string => `
  query getPedidos{
      getPedidos(
        idioma: 2
        localizacion: ${params.localizacion}
        where: {
          ped_num_host: "${params.pedido}"
        }orderBy: ped_entrega_DESC
      ) {
        ped_estado {
          ei_desc_corta
        }
      }
    }
`;

export const getStatContainer = (params: { localizacion: number; container: string }): string => `
  query getPalets{
      getPalets(
        idioma: 2
        localizacion: ${params.localizacion}
        where: {
          pal_matricula: "${params.container}"
        }) {
        pal_estado {
          ei_desc_corta
        }
      }
    }
`;

export const getStatShipment = (params: { localizacion: number; shipment: number }): string => `
  query getExpediciones{
	getExpediciones(
		idioma: 2
    localizacion: ${params.localizacion}
    where: {
      exp_codigo: ${params.shipment}
    }) {
    exp_estado {
      ei_desc_corta
    }
  }
}
`;

export const getSeries = (params: { localizacion: number; wave: string }): string => `
  query getSeries{
    getSeries(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        ser_codigo: "${params.wave}"
      }) {
      ser_estado {
        ei_desc_corta
      }
    }
  }
`;

export const updPalet = (params: { localizacion: number; currentPalet: Partial<Palet>; editedPalet: Partial<Palet> }): string => `
  mutation updPalets {
    updPalets(
      idioma: 2
      localizacion: ${params.localizacion}
      palets: [
        {
          actual: {
              pal_numero: ${format(params.currentPalet?.pal_numero)}
              pal_matricula: ${format(params.currentPalet?.pal_matricula)}
              pal_padre: ${format(params.currentPalet?.pal_padre?.pal_numero)}
              pal_tipo: ${format(params.currentPalet?.pal_tipo?.tpi_tipo)}
              pal_alm_situ: ${format(params.currentPalet?.pal_alm_situ?.almi_numero)}
              pal_pos_situ: ${format(params.currentPalet?.pal_pos_situ)}
              pal_fecha_movim: ${format(params.currentPalet?.pal_fecha_movim)}
              pal_estado: ${format(params.currentPalet?.pal_estado?.ei_codigo)}
              pal_est_mov: ${format(params.currentPalet?.pal_est_mov?.ei_codigo)}
              pal_numsubpal: ${format(params.currentPalet?.pal_numsubpal)}
              pal_numbultos: ${format(params.currentPalet?.pal_numbultos)}
              pal_altura: ${format(params.currentPalet?.pal_altura)}
              pal_comentado_sn: ${format(params.currentPalet?.pal_comentado_sn)}
              pal_volumen: ${format(params.currentPalet?.pal_volumen)}
              pal_peso: ${format(params.currentPalet?.pal_peso)}
              pal_sscc: ${format(params.currentPalet?.pal_sscc)}
              pal_expedicion: ${format(params.currentPalet?.pal_expedicion?.exp_codigo)}
              pal_impreso_exp_sn: ${format(params.currentPalet?.pal_impreso_exp_sn)}
              pal_numetiq_alb: ${format(params.currentPalet?.pal_numetiq_alb)}
              pal_ctexp: ${format(params.currentPalet?.pal_ctexp?.ctexpi_codigo)}
              pal_mat_trans_envio: ${format(params.currentPalet?.pal_mat_trans_envio)}
              pal_num_sscc: ${format(params.currentPalet?.pal_num_sscc)}
              pal_alm_des: ${format(params.currentPalet?.pal_alm_des)}
              pal_pos_des: ${format(params.currentPalet?.pal_pos_des)}
              pal_salida: ${format(params.currentPalet?.pal_salida)}
              pal_agrdep: ${format(params.currentPalet?.pal_agrdep)}
              pal_destino: ${format(params.currentPalet?.pal_destino)}
              pal_serie: ${format(params.currentPalet?.pal_serie)}
              pal_agrupacion: ${format(params.currentPalet?.pal_agrupacion)}
              pal_numetiq_transp: ${format(params.currentPalet?.pal_numetiq_transp)}
              pal_localizacion_origen: ${format(params.currentPalet?.pal_localizacion_origen)}
              pal_cia: ${format(params.currentPalet?.pal_cia)}
              pal_mat_camion: ${format(params.currentPalet?.pal_mat_camion)}
              pal_matricula_asn: ${format(params.currentPalet?.pal_matricula_asn)}
              pal_ccr: ${format(params.currentPalet?.pal_ccr)}
              pal_mat_trans_devo: ${format(params.currentPalet?.pal_mat_trans_devo)}
              pal_numaux1: ${format(params.currentPalet?.pal_numaux1)}
              pal_numaux2: ${format(params.currentPalet?.pal_numaux2)}
              pal_numaux3: ${format(params.currentPalet?.pal_numaux3)}
              pal_numaux4: ${format(params.currentPalet?.pal_numaux4)}
              pal_numaux5: ${format(params.currentPalet?.pal_numaux5)}
              pal_charaux1: ${format(params.currentPalet?.pal_charaux1)}
              pal_charaux2: ${format(params.currentPalet?.pal_charaux2)}
              pal_charaux3: ${format(params.currentPalet?.pal_charaux3)}
              pal_charaux4: ${format(params.currentPalet?.pal_charaux4)}
              pal_charaux5: ${format(params.currentPalet?.pal_charaux5)}
              pal_dateaux1: ${format(params.currentPalet?.pal_dateaux1)}
              pal_dateaux2: ${format(params.currentPalet?.pal_dateaux2)}
              pal_dateaux3: ${format(params.currentPalet?.pal_dateaux3)}
              pal_dateaux4: ${format(params.currentPalet?.pal_dateaux4)}
              pal_dateaux5: ${format(params.currentPalet?.pal_dateaux5)}
              pal_caract_1: ${format(params.currentPalet?.pal_caract_1?.dcapvi_codigo)}
              pal_caract_2: ${format(params.currentPalet?.pal_caract_2?.dcapvi_codigo)}
              pal_caract_3: ${format(params.currentPalet?.pal_caract_3?.dcapvi_codigo)}
              pal_caract_4: ${format(params.currentPalet?.pal_caract_4?.dcapvi_codigo)}
              pal_caract_5: ${format(params.currentPalet?.pal_caract_5?.dcapvi_codigo)}
              pal_caract_6: ${format(params.currentPalet?.pal_caract_6?.dcapvi_codigo)}
              pal_caract_7: ${format(params.currentPalet?.pal_caract_7?.dcapvi_codigo)}
              pal_caract_8: ${format(params.currentPalet?.pal_caract_8?.dcapvi_codigo)}
              pal_caract_9: ${format(params.currentPalet?.pal_caract_9?.dcapvi_codigo)}
              pal_caract_10: ${format(params.currentPalet?.pal_caract_10?.dcapvi_codigo)}
          }
          nuevo: {
              pal_pos_situ: ${format(params.editedPalet?.pal_pos_situ)}
              pal_est_mov: ${format(params.editedPalet?.pal_est_mov?.ei_codigo)}
          }
        }
      ]
    ) {
      exito
      codigo_error
      texto_error
      mensaje
      __typename
    }
  }
`;

export const getOrdenMovimiento = (params: { localizacion: number; container: string }): string => `
  query getOrdenesMovimiento {
    getOrdenesMovimiento(
      idioma: 2
      localizacion: ${params.localizacion}
      where: {
        OR: [{ oma_palet: { pal_matricula_CONTAINS_IC: "${params.container}" } }]
      }
      limit: 1
  ) {
      oma_codigo
      oma_posdes
      oma_paso
      oma_fechahora
      oma_status
      oma_ordensubs
      oma_prioridad
      oma_posint
      oma_palet {
        pal_numero
        pal_matricula
      }
      oma_estado {
        ei_codigo
      }

      oma_almori {
        almi_numero
      }
      oma_posori
      oma_almdes {
        almi_numero
      }

      oma_ruta {
        rut_codigo
      }
    }
  }
`;

export const delOrdenesMovimiento = (params: { localizacion: number; currentOma: Partial<OrderMovement> }): string => `
  mutation delOrdenesMovimiento {
    delOrdenesMovimiento(
      idioma: 2
      localizacion: ${params.localizacion}
      ordenesMovimiento: [
        {
          oma_codigo: ${format(params.currentOma.oma_codigo)}
          oma_anterior: ${format(params.currentOma.oma_anterior)}
          oma_estado: ${format(params.currentOma.oma_estado?.ei_codigo)}
          oma_paso: ${format(params.currentOma.oma_paso)}
          oma_fechahora: ${format(params.currentOma.oma_fechahora)}
          oma_almori: ${format(params.currentOma.oma_almori?.almi_numero)}
          oma_posori: ${format(params.currentOma.oma_posori)}
          oma_almdes: ${format(params.currentOma.oma_almdes?.almi_numero)}
          oma_palet: ${format(params.currentOma.oma_palet?.pal_numero)}
          oma_prioridad: ${format(params.currentOma.oma_prioridad)}
          oma_almint: ${format(params.currentOma.oma_almori?.almi_numero)}
          oma_posint: ${format(params.currentOma.oma_posint)}
          oma_posdes: ${format(params.currentOma.oma_posdes)}
          oma_almblo: ${format(params.currentOma.oma_almblo)}
          oma_eleblo: ${format(params.currentOma.oma_eleblo)}
          oma_ruta: ${format(params.currentOma.oma_ruta?.rut_codigo)}
          oma_telefinal: ${format(params.currentOma.oma_telefinal)}
          oma_status: ${format(params.currentOma.oma_status)}
          oma_procfinal: ${format(params.currentOma.oma_procfinal)}
          oma_ordensubs: ${format(params.currentOma.oma_ordensubs)}
        }
      ]
    ) {
      exito
      codigo_error
      texto_error
      mensaje
      __typename
    }
  }
`;

function format(value: any): string {
  if (value === undefined || value === null || value === '') {
    return 'null';
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else {
    return value.toString();
  }
}

export const getOrder = (params: { localizacion: number; order: string }): string => `
  query getPedidos {
    getPedidos(
      idioma: 2
      localizacion: ${params.localizacion}
      where: { OR: [{ AND: [{ ped_num_host: "${params.order}" }] }] }
      orderBy: ped_num_host_ASC
      limit: 1
    ) {
      ped_num_host
      ped_ruta_exped {
        ruexpi_desc_corta
        ruexpi_desc
      }
      ped_destino_exp {
        mdexi_desc_corta
        mdexi_desc
      }
    }
  }
`;

export const getPalets = (params: { localizacion: number; query?: string }): string => `
  query getPalets {
    getPalets(
      idioma: 2
      localizacion: ${params.localizacion}
      ${params.query ? params.query : ''}
      limit: 101
    ) {
      pal_numero
      pal_matricula
      pal_padre {
        pal_numero
        pal_matricula
        __typename
      }
      pal_tipo {
        tpi_tipo
        tpi_desc_corta
        tpi_desc
        tpi_json_render
        __typename
      }
      pal_alm_situ {
        almi_numero
        almi_desc_corta
        almi_desc
        __typename
      }
      pal_pos_situ
      pal_fecha_movim
      pal_estado {
        ei_codigo
        ei_define
        ei_desc_corta
        ei_desc
        ei_atributo
        __typename
      }
      pal_est_mov {
        ei_codigo
        ei_define
        ei_desc_corta
        ei_desc
        ei_atributo
        __typename
      }
      pal_numsubpal
      pal_numbultos
      pal_altura
      pal_comentado_sn
      pal_volumen
      pal_peso
      pal_sscc
      pal_num_sscc
      pal_alm_des {
        almi_numero
        almi_desc_corta
        almi_desc
        __typename
      }
      pal_pos_des
      pal_salida {
        sal_codigo
        __typename
      }
      pal_agrdep
      pal_destino {
        mdpi_codigo
        mdpi_desc_corta
        mdpi_desc
        __typename
      }
      pal_agrupacion {
        agr_numero
        agr_serie {
          ser_codigo
          __typename
        }
        __typename
      }
      pal_expedicion {
        exp_codigo
        __typename
      }
      pal_numetiq_transp
      pal_impreso_exp_sn
      pal_numetiq_alb
      pal_localizacion_origen {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_json_render
        __typename
      }
      pal_cia {
        ciai_codigo
        ciai_desc
        ciai_json_render
        __typename
      }
      pal_mat_camion
      pal_ctexp {
        ctexpi_codigo
        ctexpi_desc_corta
        ctexpi_desc
        __typename
      }
      pal_matricula_asn
      pal_ccr
      pal_numaux1
      pal_numaux2
      pal_numaux3
      pal_numaux4
      pal_numaux5
      pal_charaux1
      pal_charaux2
      pal_charaux3
      pal_charaux4
      pal_charaux5
      pal_dateaux1
      pal_dateaux2
      pal_dateaux3
      pal_dateaux4
      pal_dateaux5
      pal_caract_1 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_2 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_3 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_4 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_5 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_6 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_7 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_8 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_9 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      pal_caract_10 {
        dcapvi_codigo
        dcapvi_desc
        dcapvi_host
        dcapvi_json_render
        __typename
      }
      acciones
      __typename
    }
  }
`;

export const getSalidasQr = (params: { localizacion: number; serie: string }): string => `
 query getSalidas {
  getSalidas(
    idioma: 2
    localizacion: ${params.localizacion}
    where: { OR: [{ AND: [{ sal_serie: { ser_codigo_IN: "${params.serie}" } }] }] }
    orderBy: sal_codigo_ASC
    limit: 101
  ) {
    sal_codigo
    sal_pedido {
      ped_num_host
    }
  }
}
`;

export const getBatchPed = (params: { localizacion: number; pedido: string }): string => `
 query getPedidos {
  getPedidos(
    idioma: 2
    localizacion: ${params.localizacion}
    where: { OR: [{ AND: [{ ped_num_host_IN: "${params.pedido}" }] }] }
    orderBy: ped_num_host_ASC
    limit: 101
  ) {
    ped_numaux5
  }
}
`;

export const getBatchSub = (params: { localizacion: number; batch: number }): string => `
query getMaestrosTiposBatch {
  getMaestrosTiposBatch(
    idioma: 2
    localizacion: ${params.localizacion}
    where: { OR: [{ AND: [{ mtbi_codigo: ${params.batch} }] }] }
    orderBy: [mtbi_codigo_ASC]
    limit: 101
  ) {
    mtbi_host1
    mtbi_host2
  }
}
`;

export const doCrearContenedorConStock = (params: {
  localizacion: number;
  dispositivo: number;
  container: string;
  article: string;
  quantity: number;
  warehouse: number;
  position: string;
}): string => `
  mutation doCrearContenedorConStock {
    doCrearContenedorConStock(
      idioma: 2
      localizacion: ${params.localizacion}
      dispositivo: ${params.dispositivo}
      pal_matricula: "${params.container}"
      pal_alm_situ: ${params.warehouse}
      pal_pos_situ: "${params.position}"
      pal_tipo: 110
      arg_pal_numaux1: null
      arg_pal_numaux2: null
      arg_pal_numaux3: null
      arg_pal_numaux4: null
      arg_pal_numaux5: null
      arg_pal_charaux1: null
      arg_pal_charaux2: null
      arg_pal_charaux3: null
      arg_pal_charaux4: null
      arg_pal_charaux5: null
      arg_pal_dateaux1: null
      arg_pal_dateaux2: null
      arg_pal_dateaux3: null
      arg_pal_dateaux4: null
      arg_pal_dateaux5: null
      arg_pal_caract_1: null
      arg_pal_caract_2: null
      arg_pal_caract_3: null
      arg_pal_caract_4: null
      arg_pal_caract_5: null
      arg_pal_caract_6: null
      arg_pal_caract_7: null
      arg_pal_caract_8: null
      arg_pal_caract_9: null
      arg_pal_caract_10: null
      agregaBultos: [
        {
          art_cia: "MANGO"
          art_cod_ext: "${params.article}"
          bul_cantidad: ${params.quantity}
          maju_codigo: 20
          pe_num: null
          ajin_comentario: null
          bul_lote: null
          bul_caducidad: null
          bul_cant_paralela: null
          pro_cod_int: null
          bul_reserva: null

        }
      ]
    ) {
      exito
      codigo_error
      texto_error
      mensaje
      nBultosAgregados
      __typename
    }
  }
`;

export const getEntradas = (params: { localizacion: number; query?: string }): string => `
query getEntradas {
  getEntradas(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    limit: 101
  ) {
    ent_numero
    ent_tipo {
      tei_tipo
      tei_desc_corta
      tei_desc
      tei_json_render
      __typename
    }
    ent_localizacion {
      loci_codigo
      loci_desc_corta
      loci_desc
      loci_json_render
      __typename
    }
    ent_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    ent_elemento {
      elei_codigo
      elei_desc
      elei_almacen {
        almi_numero
        almi_desc_corta
        almi_desc
        __typename
      }
      __typename
    }
    ent_esperada_sn
    ent_contable_sn
    ent_fecha
    ent_comentado_sn
    ent_cia {
      ciai_codigo
      ciai_desc
      ciai_json_render
      __typename
    }
    ent_fecha_fin
    ent_matricula
    ent_dispositivo {
      disi_codigo
      disi_nombre
      disi_desc
      __typename
    }
    ent_usuario {
      usr_codigo
      usr_nombre
      usr_json_render
      __typename
    }
    ent_fecha_borrado
    ent_codigo_externo
    ent_codigo_remitente
    ent_ptr {
      ptr_id
      __typename
    }
    ent_transportista {
      trai_cod_int
      trai_cod_ext
      trai_desc
      __typename
    }
    ent_numaux1
    ent_numaux2
    ent_numaux3
    ent_numaux4
    ent_numaux5
    ent_charaux1
    ent_charaux2
    ent_charaux3
    ent_charaux4
    ent_charaux5
    ent_dateaux1
    ent_dateaux2
    ent_dateaux3
    ent_dateaux4
    ent_dateaux5
    ent_caract_1 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_2 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_3 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_4 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_5 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_6 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_7 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_8 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_9 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    ent_caract_10 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    info_relacional {
      lista_pe_num_host
      lista_lent_albaran
      lista_pe_origen_host
      __typename
    }
    acciones
    __typename
  }
}
`;

export const doAbrirEntrada = (params: { localizacion: number; dispositivo: number; entrada: number; warehouse: number; elemento: string }): string => `
mutation doAbrirEntrada {
  doAbrirEntrada(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: ${params.dispositivo}
    ent_numero: ${params.entrada}
    ent_almacen: ${params.warehouse}
    ent_elemento: "${params.elemento}"
    comentario: null
    ent_matricula: null
    ent_transportista: null
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    entrada
    __typename
  }
}
`;

export const doLanzarEntrada = (params: { localizacion: number; dispositivo: number; entrada: number }): string => `
mutation doLanzarEntrada {
  doLanzarEntrada(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: ${params.dispositivo}
    ent_numero: ${params.entrada}
    mover: false
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    entrada
    __typename
  }
}
`;

export const getHsEnts = (params: { localizacion: number; query?: string }): string => `
query getHsEnts {
  getHsEnts(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    limit: 101
  ) {
    hsent_id
    hsent_ptr
    hsent_tipo_registro
    hsent_conjunto
    hsent_localizacion
    hsent_esperada_sn
    hsent_contable_sn
    hsent_cia
    hsent_matricula
    hsent_dispositivo
    hsent_usuario
    hsent_codigo_externo
    hsent_codigo_remitente
    hsent_numaux1
    hsent_numaux2
    hsent_numaux3
    hsent_numaux4
    hsent_numaux5
    hsent_charaux1
    hsent_charaux2
    hsent_charaux3
    hsent_charaux4
    hsent_charaux5
    hsent_dateaux1
    hsent_dateaux2
    hsent_dateaux3
    hsent_dateaux4
    hsent_dateaux5
    hsent_transportista
    hsent_caract_1
    hsent_caract_2
    hsent_caract_3
    hsent_caract_4
    hsent_caract_5
    hsent_caract_6
    hsent_caract_7
    hsent_caract_8
    hsent_caract_9
    hsent_caract_10
    hsent_fecha
    hsent_fecha_tratamiento
    hsent_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    hsent_interfaz {
      ifazi_codigo
      ifazi_define
      ifazi_desc
      ifazi_codigo_host
      __typename
    }
    hsent_error {
      cepi_codigo
      cepi_desc_corta
      cepi_desc
      __typename
    }
    __typename
  }
}
`;

export const getAlmacenes = (params: { localizacion: number; query?: string }): string => `
query getAlmacenes {
  getAlmacenes(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    limit: 101
  ) {
    almi_numero
    almi_retraso_dejapalet
    almi_nivel_lleno
    almi_gln_extension
    almi_desc_corta
    almi_desc
    almi_permite_asigubica_sn
    almi_extraccion_sn
    almi_reaprovisiona_sn
    almi_ubicaciones_sn
    almi_recepcion_sn
    almi_calidad_sn
    almi_contable_sn
    almi_expedicion_sn
    almi_carga_camion_sn
    almi_stock_sn
    almi_palet_etiq_sn
    almi_relanza_sn
    almi_ctrl_fechas_sn
    almi_manual_sn
    almi_remontar_sn
    almi_busca_ubi_sn
    almi_transito_sn
    almi_permite_autdin_sn
    almi_montaje_sn
    almi_porteria_sn
    almi_parking_sn
    almi_comentado_sn
    almi_palets_precalculados_sn
    almi_pasillo_estrecho_sn
    almi_palets_cajas_dentro_sn
    almi_retomar_picking_sn
    almi_localizacion {
      loci_codigo
      loci_desc_corta
      loci_desc
      loci_usr_plantilla {
        usr_codigo
        usr_nombre
        usr_nivel_mensaje {
          pvci_tabla
          pvci_atributo
          pvci_valor
          pvci_json_render
          pvci_desc
          __typename
        }
        usr_json_render
        __typename
      }
      loci_json_render
      __typename
    }
    almi_area {
      ai_codigo
      ai_desc_corta
      ai_desc
      __typename
    }
    almi_tipo_ajuste {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_uma_entrada {
      umai_codigo
      umai_desc_corta
      umai_desc
      __typename
    }
    almi_uma_paletiz {
      umai_codigo
      umai_desc_corta
      umai_desc
      __typename
    }
    almi_uma_rotacion {
      umai_codigo
      umai_desc_corta
      umai_desc
      __typename
    }
    almi_acepta_picos {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_min_uma_nopico {
      umai_codigo
      umai_desc_corta
      umai_desc
      __typename
    }
    almi_organiz_ubi {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_tp_div {
      tpi_tipo
      tpi_desc_corta
      tpi_desc
      tpi_host
      tpi_json_render
      __typename
    }
    almi_tipo {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_crit_desasigna_ubi {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_critasig_autest {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_entrada_equiv {
      almi_numero
      almi_desc_corta
      almi_desc
      almi_palet_etiq_sn
      almi_uma_paletiz {
        umai_codigo
        umai_desc_corta
        umai_desc
        __typename
      }
      almi_uma_entrada {
        umai_codigo
        umai_desc_corta
        umai_desc
        __typename
      }
      almi_organiz_ubi {
        pvci_tabla
        pvci_atributo
        pvci_valor
        pvci_json_render
        pvci_desc
        __typename
      }
      almi_area {
        ai_codigo
        ai_desc_corta
        ai_desc
        __typename
      }
      almi_localizacion {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_usr_plantilla {
          usr_codigo
          usr_nombre
          usr_nivel_mensaje {
            pvci_tabla
            pvci_atributo
            pvci_valor
            pvci_json_render
            pvci_desc
            __typename
          }
          usr_json_render
          __typename
        }
        loci_json_render
        __typename
      }
      __typename
    }
    almi_ubicacion_equiv {
      almi_numero
      almi_desc_corta
      almi_desc
      almi_palet_etiq_sn
      almi_uma_paletiz {
        umai_codigo
        umai_desc_corta
        umai_desc
        __typename
      }
      almi_uma_entrada {
        umai_codigo
        umai_desc_corta
        umai_desc
        __typename
      }
      almi_organiz_ubi {
        pvci_tabla
        pvci_atributo
        pvci_valor
        pvci_json_render
        pvci_desc
        __typename
      }
      almi_area {
        ai_codigo
        ai_desc_corta
        ai_desc
        __typename
      }
      almi_localizacion {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_usr_plantilla {
          usr_codigo
          usr_nombre
          usr_nivel_mensaje {
            pvci_tabla
            pvci_atributo
            pvci_valor
            pvci_json_render
            pvci_desc
            __typename
          }
          usr_json_render
          __typename
        }
        loci_json_render
        __typename
      }
      __typename
    }
    almi_accion_llegada_alm {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_iniciar_ubicacion {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_informa_movim {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_tipo_ent_mat_ifaz {
      tei_tipo
      tei_desc_corta
      tei_desc
      tei_crear_lineas_no_pdte
      tei_json_render
      __typename
    }
    almi_encadena_oma {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_pue_impresion {
      puei_nombre
      puei_desc
      puei_localizacion {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_usr_plantilla {
          usr_codigo
          usr_nombre
          usr_nivel_mensaje {
            pvci_tabla
            pvci_atributo
            pvci_valor
            pvci_json_render
            pvci_desc
            __typename
          }
          usr_json_render
          __typename
        }
        loci_json_render
        __typename
      }
      __typename
    }
    almi_tipotele_dejapalet {
      tti_tipo
      tti_define
      tti_desc
      __typename
    }
    almi_tablades_dejapalet {
      pr_numero
      pr_proceso
      pr_modulo
      pr_uic_g
      pr_uic_u
      __typename
    }
    almi_gln {
      glni_id
      glni_desc
      __typename
    }
    almi_accion_verificacion {
      pvci_tabla
      pvci_atributo
      pvci_valor
      pvci_json_render
      pvci_desc
      __typename
    }
    almi_caract_1 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_2 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_3 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_4 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_5 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_6 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_7 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_8 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_9 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_caract_10 {
      dcapvi_codigo
      dcapvi_desc
      dcapvi_host
      dcapvi_json_render
      __typename
    }
    almi_tipo_consol {
      tconi_codigo
      __typename
    }
    __typename
  }
}
`;

export const getPedidosDevolucionSap = (params: { localizacion: number; dispositivo: number; order: string }): string => `
query getPedidosDevolucionSap {
  getPedidosDevolucionSap(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: ${params.dispositivo}
    ifazDefine: "GET_PED_DEVOL_SAP"
    pedido: "${params.order}"
    pedidoExternoMarketplace: null
    mail: null
    tracking: null
    nombreApellidos: null
    referencia: null
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    pedidosDevolucionSap {
      articulo {
        arti_cod_int
        arti_cod_ext
        __typename
      }
      articuloCodExt
      orderItemQuantity
      __typename
    }
    __typename
  }
}
`;

export const getDispsAsignados = (params: { localizacion: number; query?: string }): string => `
query getDispsAsignados {
  getDispsAsignados(
    idioma: 2
    localizacion: ${params.localizacion}
    ${params.query ? params.query : ''}
    limit: 0
  ) {
    dia_dispositivo {
      disi_codigo
      disi_nombre
      disi_desc
      disi_tipo {
        tdi_codigo
        tdi_define
        tdi_desc
        __typename
      }
      __typename
    }
    dia_puesto {
      puei_nombre
      puei_desc
      puei_localizacion {
        loci_codigo
        loci_desc_corta
        loci_desc
        loci_usr_plantilla {
          usr_codigo
          usr_nombre
          usr_nivel_mensaje {
            pvci_tabla
            pvci_atributo
            pvci_valor
            pvci_json_render
            pvci_desc
            __typename
          }
          usr_json_render
          __typename
        }
        loci_json_render
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const doConectarPuesto = (params: { localizacion: number; dispositivo: number; node: string }): string => `
mutation doConectarPuesto {
  doConectarPuesto(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: ${params.dispositivo}
    puesto: "${params.node}"
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    cod_radio
    __typename
  }
}
`;

export const getPedidos = (params: { localizacion: number | null; query?: string }): string => `
  query getPedidos {
  getPedidos(
    idioma: 2
    ${params.localizacion !== null ? `localizacion: ${params.localizacion}` : ''}
    ${params.query ? params.query : ''}
    limit: 101
  ) {
    ped_num
    ped_num_host
    ped_entrega
    ped_fec_recep
    ped_fec_entre
    ped_prioridad
    ped_reexpedicion_sn
    ped_comentado_sn
    ped_exp_unica_sn
    ped_fec_carga
    ped_fec_prep
    ped_fec_exped
    ped_peso_teorico
    ped_vol_teorico
    ped_cod_recep
    ped_nombre_recep
    ped_nif_recep
    ped_email_recep
    ped_direccion_recep
    ped_direccion2_recep
    ped_poblacion_recep
    ped_codpostal_recep
    ped_provincia_recep
    ped_pais_recep
    ped_gln_extension_recep
    ped_cod_solic
    ped_nombre_solic
    ped_charaux10
    ped_estado {
      ei_codigo
      ei_define
      ei_desc_corta
      ei_desc
      ei_atributo
      __typename
    }
    ped_destino_exp {
      mdexi_codigo
      mdexi_desc_corta
      mdexi_desc
      __typename
    }
    ped_destino {
      mdpi_codigo
      mdpi_desc_corta
      mdpi_desc
      __typename
    }
    ped_ruta_exped {
      ruexpi_codigo
      ruexpi_desc_corta
      ruexpi_desc
      __typename
    }
    ped_transportista {
      trai_cod_int
      trai_cod_ext
      trai_desc
      __typename
    }
    acciones
    __typename
  }
}
`;

export const doCrearPedido = (params: { localizacion: number; dispositivo: number; order: string; type: number; date: string; article: string; quantity: number }): string => `
mutation doCrearPedido {
  doCrearPedido(
    idioma: 2
    localizacion: ${params.localizacion}
    dispositivo: ${params.dispositivo}
    ped_num_host: "${params.order}"
    ped_cia: "MANGO"
    ped_prioridad: 1
    ped_tipo: ${params.type}
    ped_exp_unica_sn: false
    ped_fec_entre: "${params.date}"
    ped_ruta_host: "CY"
    ped_localizacion_destino: ${params.localizacion}
    ped_ped_cliente: "FVNQK501"
    ped_cod_recep: "B2CHD"
    arg_ped_numaux4: 26
    arg_ped_charaux1: "ZOD2"
    arg_ped_charaux2: "PED"
    arg_ped_charaux4: "a"
    arg_ped_charaux6: "01"
    arg_ped_charaux7: "EUR"
    arg_ped_charaux9: "Austria"
    arg_ped_charaux10: "3212"
    arg_ped_caract_1: 1151
    arg_ped_caract_5: 1354
    arg_ped_caract_9: 300
    arg_ped_caract_10: 310
    lineasPedido: [
      {
        arti_cod_ext: "${params.article}"
        lped_cant_host: ${params.quantity}
        lped_uni_host: "UNI"
        lped_lote_fijo_sn: false
      }
    ]
  ) {
    exito
    codigo_error
    texto_error
    mensaje
    ped_num
    ped_entrega
    __typename
  }
}
`;

export const getLocalizaciones = (): string => `
query getLocalizaciones {
  getLocalizaciones(idioma: 2, orderBy: loci_desc_corta_ASC, limit: 0) {
    loci_codigo
    loci_desc_corta
    loci_desc
  }
}
`;

export const getHsPeds = (params: { query?: string }): string => `
query getHsPeds {
  getHsPeds(
    idioma: 1
    ${params.query ? params.query : ''}
    limit: 0
  ) {
    hsped_num_host
    hsped_estado {
      ei_codigo
      ei_define
      ei_desc_corta
    }
  }
}
`;
