'use server'

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


export const fetchData = async (search: string, option: boolean): Promise<Option[]> => {

    const isCodePadre = !search.includes("-");
    const URL = `${process.env.STOCK_API}?WarehouseCode=ALM220&${option ? "BarCode" : (isCodePadre ? 'Model' : 'ProductCode')}=${search.toUpperCase()}`;
    const res = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}`
        },
    });

    const data = await res.json();
    if (data.message) {
        // throw new Error(data.message);
        return []
    }

    // console.log({ data }, '🚩🚩🚩')

    return data?.map((product: ProductResponse) => ({
        label: `${product.EAN} - ${product.ProductCode}`,
        value: product.ProductCode,
        product: {
            codigoEan: product.EAN,
            codigoSap: product.ProductCode,
            url_foto: product.images[0],
            id: product.EAN,
            quantity: product.Stock[0]?.OnHand,
            price: product.prices[0].PriceWebKayser,
            priceSale: product.prices[0].PricePublico,
            size: product.Size,
            color: product.Color,
        },
    }));
};

