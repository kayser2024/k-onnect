export interface OrdenResponse {
    bEstado: boolean;
    iCodigo: string;
    sRpta: string;
    obj: Objeto;
}
export interface BoletaResponse {
    bEstado: boolean;
    iCodigo: string;
    sRpta: string;
    obj: Objeto;
}


export interface Objeto {
    ordenes: Orden[];
    "paginas totales": number;
    "pagina actual": number;
    "total de registros": number;
}

export interface Orden {
    solicitado: boolean;
    cupon: string;
    delivery_settings_id: string | null;
    cabecera_pedido: CabeceraPedido[];
    datos_facturacion: DatosFacturacion[];
    resumen_pedido: ResumenPedido[];
    detalle_pedido: DetallePedido[];
    terminos_legales: TerminosLegales[];
    situacion_envio: SituacionEnvio[];
    situacion_facturacion: SituacionFacturacion[];
    situacion_erp: SituacionERP[];
    situacion_pagos: SituacionPago[];
    datos_envio: DatosEnvio[];
    otros: string[];
    promoter: string[];
    __v: number;
    cod_payme: string;
    created_at: string;
}

export interface CabeceraPedido {
    dominio: string;
    estado_pedido: string;
    email_pedido: string;
    numero_orden: string;
    fecha_pedido: Date;
}

export interface DatosEnvio {
    nombres_envio: string;
    apellidos_envio: string;
    direccion_envio: string;
    referencia_envio: string;
    telefono_envio: string;
    pais: string;
    departamento: string;
    provincia: string;
    distrito: string;
    dni_envio: string;
    servicio_envio: string;
    ubigeo: string;
    tipo_envio: string;
}

export interface DatosFacturacion {
    tipo_de_doc: string;
    tipo_doc_identidad: string;
    id_cliente: string;
    nombres_facturacion: string;
    email_facturacion: string;
    telefono_facturacion: string;
    moneda: string;
}

export interface DetallePedido {
    id?: number;
    sku: string;
    quantity_sku: number;
    recurrente: string;
    additional_details: string[];
    title: string;
    price: number;
    sku_padre: string;
    atributo1_titulo: string;
    atributo1_valor: string;
    atributo2_titulo: string;
    atributo2_valor: string;
    peso: number;
    sale_price: number;
    tag: string;
    promo: string;
    url_imagen_sku: string;
    categoria: string;
    sub_categoria: string;
    subtotal_sku: number;
}

export interface ResumenPedido {
    disccount_coupon: number;
    disccount_catalog: number;
    disccount: number;
    costo_envio: number;
    impuesto: number;
    quantity: number;
    subtotal: number;
    total: number;
    gran_total: number;
}

export interface SituacionEnvio {
    estado_envio: string;
    preparacion: string;
    listo_envio: string;
    enviado: string;
    recibido: string;
    operador_logistico: string;
    tracking: string;
    ticket_url: null;
    metodo_despacho: string;
    envio_solicitado: boolean;
    fecha_envio_solicitado: null;
    estado_impreso: boolean;
    estado_sincronizado: boolean;
}

export interface SituacionERP {
    estado_erp: string;
    fecha_envio_erp: string;
}

export interface SituacionFacturacion {
    estado_facturacion: string;
    fecha_envio_facturacion: string;
    link_doc1: string;
    link_doc2: string;
}

export interface SituacionPago {
    estado_pago: string;
    fecha_pago: Date;
    metodo_pago: string;
    mo: string;
    payment_details: PaymentDetails;
}

export interface PaymentDetails {
    id_pasarela: string;
    nombre_pasarela: string;
    s_pasarela: string;
}

export interface TerminosLegales {
    acepta_condiciones: string;
    acepta_datos: string;
}
