'use server'


// export interface Response {
//     bEstado: boolean;
//     iCodigo: number;
//     sRpta: string;
//     obj: Obj[];
// }

// export interface Obj {
//     datos_variacion: DatosVariacion[];
//     paginas_totales: number;
//     pagina_actual: number;
//     total_de_registros: number;
// }

// export interface DatosVariacion {
//     _id: string;
//     sku_padre: string;
//     cod_agrupador: string;
//     sku: string;
//     dominio: string;
//     url1_imagen_sku: string;
//     url2_imagen_sku: string;
//     url3_imagen_sku: string;
//     url4_imagen_sku: string;
//     url5_imagen_sku: string;
//     url6_imagen_sku: string;
//     url_images: string[];
//     price: number;
//     sale_price: number;
//     cantidad: number;
//     peso: number;
//     atributo1_titulo: string;
//     atributo1_valor: string;
//     atributo1_cod_hex: string;
//     atributo1_url_imagen: string;
//     atributo1_detalle: string;
//     atributo2_titulo: string;
//     atributo2_valor: string;
//     atributo2_cod_hex: string;
//     atributo2_url_imagen: string;
//     atributo2_detalle: string;
//     atributo3_titulo: string;
//     atributo3_valor: string;
//     atributo3_cod_hex: string;
//     atributo3_detalle: string;
//     atributo3_url_imagen: string;
//     producto_bandera: string;
//     tags_widget: string;
//     fecha_creacion: Date;
//     fecha_modificacion: Date;
//     usuario_creacion: string;
//     usuario_modificacion: string;
//     erp_storages: any[];
//     __v: number;
// }


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



export interface ProductResponse {
    EAN: string;
    ProductCode: string;
    ProductDescription: string;
    Model: string;
    Color: string;
    Size: string;
    Material: string;
    Composition: string;
    Brand: string;
    Family: string;
    SubFamily: string;
    Gender: string;
    SunatCode: string;
    SunatDescription: string;
    ICBPER: string;
    Defective: string;
    ArtpetMinStockLevel: number;
    Stock: Stock[];
    images: string[];
    prices: Price[];
}

export interface Stock {
    OnHand: number;
    WarehouseCode: string;
    WarehouseName: string;
}

export interface Price {
    PricePromotoras: number;
    PricePublico: number;
    PriceWebKayser: number;
    PriceWhatsApp: string;
}




export const fetchData = async (search: string): Promise<Option[]> => {

    const URL = process.env.STOCK_API;
    const isCodePadre = !search.includes("-");
    console.log({ isCodePadre }, 'IS CODE PADRE')
    const res = await fetch(`${URL}?WarehouseCode=ALM220&${isCodePadre ? 'Model' : 'ProductCode'}=${search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}`
        },
    });
    // if (!res.ok) throw new Error('Error al cargar productos');
    const data: ProductResponse[] = await res.json();



    console.log({ data }, '🚩🚩🚩')

    // calcular el stok


    return data.map((product) => ({
        label: `${product.EAN} - ${product.ProductCode}`,
        value: product.Model,
        product: {
            codigoEan: product.EAN,
            codigoSap: product.Model,
            url_foto: product.images[0],
            id: product.EAN,
            quantity: product.Stock[0].OnHand,
            price: product.prices[0].PricePublico,
            priceSale: product.prices[0].PriceWebKayser,
            size: product.Size,
            color: product.Color,
        },
    }));
};

