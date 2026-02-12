/* eslint-disable @typescript-eslint/naming-convention */

export interface LoginResponse {
  doLogin: {
    token: string;
  };
}

export interface CrearMatriculaResponse {
  doCrearMatricula: {
    exito: boolean;
    pal_matricula: string;
    texto_error: string;
  };
}

export interface LanzarSerieResponse {
  doLanzarSaerie: {
    exito: boolean;
  };
}

export interface RadiosResponse {
  getRadios: Array<Partial<Radio>>;
}

export interface Radio {
  rad_codigo: number;
  rad_tipo: {
    pvci_valor: any;
    __typename: string;
  };
  rad_libre: number;
  rad_elemento: {
    elei_almacen: {
      almi_numero: any;
      __typename: string;
    };
    elei_codigo: any;
    __typename: string;
  };
  rad_estado: {
    ei_codigo: any;
    ei_define: any;
    ei_desc_corta: any;
    ei_desc: any;
    ei_atributo: any;
    __typename: string;
  };
  rad_usuario: {
    usr_codigo: any;
    usr_nombre: any;
    usr_nivel_mensaje: {
      pvci_tabla: any;
      pvci_atributo: any;
      pvci_valor: any;
      pvci_json_render: any;
      pvci_desc: any;
      __typename: string;
    };
    usr_json_render: any;
    __typename: string;
  };
  acciones: any;
  __typename: string;
}

export interface DesconectarRadioResponse {
  doDesconectarRadio: {
    exito: boolean;
  };
}

export interface ClearRadioResponse {
  doClearRadio: {
    count: number;
    status: string;
    success: boolean;
  };
}

export interface moverContenedorResponse {
  doEjecutarAccion: {
    exito: boolean;
    mensaje: string;
    __typename: string;
  };
}

export interface simulateLabelResponse {
  doEjecutarAccion: {
    exito: boolean;
    mensaje: string;
    __typename: string;
  };
}

export interface GetBultosResponse {
  getBultos: Array<Partial<Bulto>>;
}

export interface Bulto {
  bul_numero: number;
  bul_cantidad: number;
  acciones: string[];
  bul_fecha_creado: any;
  bul_fecha_entrada: any;
  bul_articulo: {
    arti_cod_int: string;
    arti_cod_ext: string;
    arti_cia: {
      ciai_codigo: any;
      ciai_desc: any;
      ciai_json_render: any;
      __typename: any;
    };
    arti_desc: any;
    arti_json_render: any;
    __typename: any;
  };
  bul_palet: {
    pal_numero: any;
    pal_matricula: any;
    __typename: any;
  };
  bul_subpalet: {
    pal_numero: any;
    pal_matricula: any;
    pal_padre: {
      pal_numero: any;
      pal_matricula: any;
      __typename: any;
    };
    pal_tipo: {
      tpi_tipo: any;
      tpi_desc_corta: any;
      tpi_desc: any;
      tpi_json_render: any;
      __typename: any;
    };
    pal_alm_situ: {
      almi_numero: any;
      almi_desc_corta: any;
      almi_desc: any;
      __typename: any;
    };
    pal_pos_situ: any;
    pal_fecha_movim: any;
    pal_estado: {
      ei_codigo: any;
      ei_define: any;
      ei_desc_corta: any;
      ei_desc: any;
      ei_atributo: any;
      __typename: any;
    };
    pal_est_mov: {
      ei_codigo: any;
      ei_define: any;
      ei_desc_corta: any;
      ei_desc: any;
      ei_atributo: any;
      __typename: any;
    };
    pal_numsubpal: any;
    pal_numbultos: any;
    pal_altura: any;
    pal_comentado_sn: any;
    pal_volumen: any;
    pal_peso: any;
    pal_sscc: any;
    pal_num_sscc: any;
    pal_alm_des: {
      almi_numero: any;
      almi_desc_corta: any;
      almi_desc: any;
      __typename: any;
    };
    pal_pos_des: any;
    pal_salida: {
      sal_codigo: any;
      __typename: any;
    };
    pal_agrdep: any;
    pal_destino: {
      mdpi_codigo: any;
      mdpi_desc_corta: any;
      mdpi_desc: any;
      __typename: any;
    };
    pal_agrupacion: {
      agr_numero: any;
      agr_serie: {
        ser_codigo: any;
        __typename: any;
      };
      __typename: any;
    };
    pal_expedicion: {
      exp_codigo: any;
      __typename: any;
    };
    pal_numetiq_transp: any;
    pal_impreso_exp_sn: any;
    pal_numetiq_alb: any;
    pal_localizacion_origen: {
      loci_codigo: any;
      loci_desc_corta: any;
      loci_desc: any;
      loci_json_render: any;
      __typename: any;
    };
    pal_cia: {
      ciai_codigo: any;
      ciai_desc: any;
      ciai_json_render: any;
      __typename: any;
    };
    pal_mat_camion: any;
    pal_ctexp: {
      ctexpi_codigo: any;
      ctexpi_desc_corta: any;
      ctexpi_desc: any;
      __typename: any;
    };
    pal_matricula_asn: any;
    pal_ccr: any;
    pal_numaux1: any;
    pal_numaux2: any;
    pal_numaux3: any;
    pal_numaux4: any;
    pal_numaux5: any;
    pal_charaux1: any;
    pal_charaux2: any;
    pal_charaux3: any;
    pal_charaux4: any;
    pal_charaux5: any;
    pal_dateaux1: any;
    pal_dateaux2: any;
    pal_dateaux3: any;
    pal_dateaux4: any;
    pal_dateaux5: any;
    pal_caract_1: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_2: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_3: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_4: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_5: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_6: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_7: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_8: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_9: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    pal_caract_10: {
      dcapvi_codigo: any;
      dcapvi_desc: any;
      dcapvi_host: any;
      dcapvi_json_render: any;
      __typename: any;
    };
    __typename: any;
  };
  bul_est_stock: {
    ei_codigo: any;
    ei_define: any;
    ei_desc_corta: any;
    ei_desc: any;
    ei_atributo: any;
    __typename: any;
  };
  bul_estado_reserva: {
    ei_codigo: any;
    ei_define: any;
    ei_desc_corta: any;
    ei_desc: any;
    ei_atributo: any;
    __typename: any;
  };
  bul_comentado_sn: any;
  bul_lote: any;
  bul_mot_bloq: any;
  bul_caducidad: any;
  bul_linea_entrada: {
    lent_entrada: {
      ent_numero: any;
      __typename: any;
    };
    lent_linea: any;
    __typename: any;
  };
  bul_tipo_entrada: {
    tei_tipo: any;
    tei_desc_corta: any;
    tei_desc: any;
    tei_json_render: any;
    __typename: any;
  };
  bul_proveedor: {
    proi_cod_int: any;
    proi_cod_ext: any;
    proi_desc: any;
    __typename: any;
  };
  bul_original: any;
  bul_reserva: {
    resi_codigo: any;
    resi_desc_corta: any;
    resi_desc: any;
    __typename: any;
  };
  bul_cant_paralela: any;
  bul_fecha_fab: any;
  bul_cant_verificada: any;
  bloqueos: {
    cbsi_codigo: any;
    cbsi_desc_corta: any;
    cbsi_desc: any;
    __typename: any;
  }[];
  __typename: any;
}

export interface AjustarCantidadBultoResponse {
  doAjustarCantidadBulto: {
    exito: boolean;
    bul_numero: number;
  };
}

export interface GetPedidosResponse {
  getPedidos: Array<Partial<Order>>;
}

export interface GetStockResponse {
  getLineasPedido: Array<LineaPedido>;
}

export interface LineaPedido {
  lped_cantpedida: number;
  lped_articulo: {
    arti_cod_ext: string;
  };
}

export interface GetSalidasResponse {
  getSalidas: Array<Salida>;
}

export interface Salida {
  sal_codigo: number;
  sal_pedido: {
    ped_num_host: string;
  };
}

export interface GetBatchPedidoResponse {
  getPedidos: Array<BatchPedido>;
}

export interface BatchPedido {
  ped_numaux5: number;
}

export interface GetBatchSubResponse {
  getMaestrosTiposBatch: Array<BatchSub>;
}

export interface BatchSub {
  mtbi_host1: string;
  mtbi_host2: string;
}

export interface Order {
  ped_num_host: string;
  lineas_pedido: Array<Partial<LineaPedido>>;
  ped_estado: {
    ei_desc_corta: string;
  };
  ped_ruta_exped: {
    ruexpi_desc_corta: string;
    ruexpi_desc: string;
  };
  ped_destino_exp: {
    mdexi_desc_corta: string;
    mdexi_desc: string;
  };
  ped_transportista: {
    trai_cod_ext: string;
  };
}

export interface GetPedidosWithPrefixResponse {
  orders: Array<Partial<Order>>;
}

export interface GetShPedidosResponse {
  getShPedidos: Array<any>;
}

export interface GetShExpedicionesResponse {
  getShExpediciones: Array<any>;
}

export interface getShExpediciones {
  shexp_evento: {
    evifazi_define: string;
  };
}

export interface GetProcesosResponse {
  getProcesos: Array<Partial<Process>>;
}

export interface Process {
  pr_proceso: string;
  pr_estado: {
    ei_desc_corta: string;
  };
}

export interface Serie {
  ser_estado: {
    ei_desc_corta: string;
  };
}

export interface GetPaletsResponse {
  getPalets: Array<Partial<Palet>>;
}

export interface Palet {
  pal_numero: any;
  pal_matricula: any;
  pal_padre: Partial<{
    pal_numero: any;
    pal_matricula: any;
    __typename: any;
  }>;
  pal_tipo: Partial<{
    tpi_tipo: any;
    tpi_desc_corta: any;
    tpi_desc: any;
    tpi_json_render: any;
    __typename: any;
  }>;
  pal_alm_situ: Partial<{
    almi_numero: any;
    almi_desc_corta: any;
    almi_desc: any;
    __typename: any;
  }>;
  pal_estado: Partial<{
    ei_codigo: any;
    ei_define: any;
    ei_desc_corta: any;
    ei_desc: any;
    ei_atributo: any;
    __typename: any;
  }>;
  pal_est_mov: Partial<{
    ei_codigo: number;
    ei_define: any;
    ei_desc_corta: any;
    ei_desc: any;
    ei_atributo: any;
    __typename: any;
  }>;
  pal_pos_situ: any;
  pal_fecha_movim: any;
  pal_mat_trans_devo: any;
  pal_mat_trans_envio: any;
  pal_serie: any;
  pal_numsubpal: any;
  pal_numbultos: any;
  pal_altura: any;
  pal_comentado_sn: any;
  pal_volumen: any;
  pal_peso: any;
  pal_sscc: any;
  pal_num_sscc: any;
  pal_alm_des: any;
  pal_pos_des: any;
  pal_salida: any;
  pal_agrdep: any;
  pal_destino: any;
  pal_agrupacion: any;
  pal_expedicion: any;
  pal_numetiq_transp: any;
  pal_impreso_exp_sn: any;
  pal_numetiq_alb: any;
  pal_localizacion_origen: any;
  pal_cia: any;
  pal_mat_camion: any;
  pal_ctexp: any;
  pal_matricula_asn: any;
  pal_ccr: any;
  pal_numaux1: any;
  pal_numaux2: any;
  pal_numaux3: any;
  pal_numaux4: any;
  pal_numaux5: any;
  pal_charaux1: any;
  pal_charaux2: any;
  pal_charaux3: any;
  pal_charaux4: any;
  pal_charaux5: any;
  pal_dateaux1: any;
  pal_dateaux2: any;
  pal_dateaux3: any;
  pal_dateaux4: any;
  pal_dateaux5: any;
  pal_caract_1: any;
  pal_caract_2: any;
  pal_caract_3: any;
  pal_caract_4: any;
  pal_caract_5: any;
  pal_caract_6: any;
  pal_caract_7: any;
  pal_caract_8: any;
  pal_caract_9: any;
  pal_caract_10: any;
  acciones: any[];
  __typename: any;
}

export interface GetRelacionesPosicionesResponse {
  getRelacionesPosiciones: Array<Posicion>;
}

export interface Posicion {
  relpos_pos_principal: string;
  relpos_pos_alternativa: string;
  relpos_alm_alternativo: {
    almi_desc_corta: string;
  };
  relpos_alm_principal: {
    almi_desc_corta: string;
  };
}

export interface GetLineasPedidoResponse {
  getLineasPedido: Array<OrderLine>;
}

export interface OrderLine {
  lped_nlinea: number;
  lped_cant_host: number;
  lped_articulo: {
    arti_cod_int: string;
    arti_cod_ext: string;
  };
  lped_pedido: {
    ped_num: number;
    ped_num_host: string;
  };
}

export interface GetSerieResponse {
  getSeries: Array<Serie>;
}

export interface GetOrderResponse {
  getPedidos: Array<Partial<Order>>;
}

export interface Container {
  pal_estado: {
    ei_desc_corta: string;
  };
}

export interface GetContainerResponse {
  getPalets: Array<Container>;
}

export interface Shipment {
  exp_estado: {
    ei_desc_corta: string;
  };
}

export interface GetShipmentResponse {
  getExpediciones: Array<Shipment>;
}
export interface UpdatePaletResponse {
  updPalets: Array<MResponse>;
}

export interface MResponse {
  exito: boolean;
  codigo_error: any;
  texto_error: any;
  mensaje: any;
  __typename: string;
}

export interface GetOrdenesMovimientoResponse {
  getOrdenesMovimiento: Array<Partial<OrderMovement>>;
}

export interface OrderMovement {
  oma_codigo: number;
  oma_posdes: number;
  oma_palet: {
    pal_numero: number;
    pal_matricula: string;
  };
  oma_anterior: number;
  oma_estado: {
    ei_codigo: number;
  };
  oma_paso: number;
  oma_fechahora: string;
  oma_almori: {
    almi_numero: number;
  };
  oma_posori: string;
  oma_almdes: {
    almi_numero: number;
  };
  oma_prioridad: number;
  oma_almint: number;
  oma_posint: any;
  oma_almblo: any;
  oma_eleblo: any;
  oma_ruta: {
    rut_codigo: number;
  };
  oma_telefinal: any;
  oma_status: any;
  oma_procfinal: any;
  oma_ordensubs: number;
}

export interface DelOrdenesMovimiento {
  delOrdenesMovimiento: Array<MResponse>;
}

export interface Puesto {
  localizacion: number;
  node: string;
  idioma?: number;
  dispositivo?: number;
  site: string;
  locationDescription: string;
  connected: boolean;
}

export interface ExactLocation {
  warehouse: string;
  location: string;
}

export interface GetLocalizacionesResponse {
  getLocalizaciones: { loci_codigo: number; loci_desc_corta: string; loci_desc: string }[];
}

export interface GetHsPedidosResponse {
  getHsPeds: {
    hsped_num_host: string;
    hsped_estado: {
      ei_codigo: number;
      ei_define: string;
      ei_desc_corta: string;
    };
  }[];
}
