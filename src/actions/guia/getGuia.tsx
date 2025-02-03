'use server'

export interface ResponseGuia {
    GuideNumber: string;
    OriginWarehouse: string;
    NameOriginWarehouse: string;
    DestinationWarehouse: string;
    NameDestinationWarehouse: string;
    Details: Detail[];
}

export interface Detail {
    BarCode: string;
    ProductCode: string;
    Description: string;
    Image1: string;
    Quantity: string;
}



export const getGuiasByValue = async (value: string, codEstablec: string) => {

    try {
        const response = await fetch(`http://192.168.0.244:5050/api/Transfer?GuideNumber=${value}&DestinationWarehouse=${codEstablec}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}` //token de prueba
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const data: ResponseGuia[] = await response.json();
        console.log(data)
        return {
            ok: true,
            message: 'Guia encontrada',
            data: data
        }
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }
    }
}