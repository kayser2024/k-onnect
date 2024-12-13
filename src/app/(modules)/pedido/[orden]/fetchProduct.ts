'use server'


export interface Response {
    bEstado: boolean;
    iCodigo: number;
    sRpta: string;
    obj: Obj[];
}

export interface Obj {
    datos_variacion: DatosVariacion[];
    paginas_totales: number;
    pagina_actual: number;
    total_de_registros: number;
}

export interface DatosVariacion {
    _id: string;
    sku_padre: string;
    cod_agrupador: string;
    sku: string;
    dominio: string;
    url1_imagen_sku: string;
    url2_imagen_sku: string;
    url3_imagen_sku: string;
    url4_imagen_sku: string;
    url5_imagen_sku: string;
    url6_imagen_sku: string;
    url_images: string[];
    price: number;
    sale_price: number;
    cantidad: number;
    peso: number;
    atributo1_titulo: string;
    atributo1_valor: string;
    atributo1_cod_hex: string;
    atributo1_url_imagen: string;
    atributo1_detalle: string;
    atributo2_titulo: string;
    atributo2_valor: string;
    atributo2_cod_hex: string;
    atributo2_url_imagen: string;
    atributo2_detalle: string;
    atributo3_titulo: string;
    atributo3_valor: string;
    atributo3_cod_hex: string;
    atributo3_detalle: string;
    atributo3_url_imagen: string;
    producto_bandera: string;
    tags_widget: string;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    usuario_creacion: string;
    usuario_modificacion: string;
    erp_storages: any[];
    __v: number;
}


interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: string;
    quantity: number;
    color: string;
    size: string;
    price: number;
    priceSale: number
}



interface Option {
    label: string;
    value: string;
    product: Product;
}

export const fetchData = async (search: string): Promise<Option[]> => {
    const res = await fetch(`https://sami3-external.winwinafi.com/inventary/variant/kayser.pe?codPadre=${search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SAMISHOP_API_TOKEN as string
        },
    });
    if (!res.ok) throw new Error('Error al cargar productos');
    const data: Response = await res.json();

    const { obj } = data;

    if (!obj) {
        return []
    }

    console.log({ data: obj[0] }, '🚩🚩🚩')


    return obj[0].datos_variacion.map((product) => ({
        label: `${product.sku} - ${product.sku_padre}`,
        value: product.sku_padre,
        product: {
            codigoEan: product.sku,
            codigoSap: product.sku_padre,
            url_foto: product.url1_imagen_sku,
            id: product["_id"],
            quantity: product.cantidad,
            price: product.price,
            priceSale: product.sale_price,
            size: product.atributo1_valor,
            color: product.atributo2_valor,
        },
    }));
};