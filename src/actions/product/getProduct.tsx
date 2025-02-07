'use server'

import prisma from "@/lib/prisma"

interface ProductFromAPI {
    codigoEan: string | null;
    codigoSap: string | null;
    url_foto: string | null;
    id: number;
}

interface ApiResponse<T> {
    ok: boolean;
    message: string;
    data: T;
}
export const getProductBySearchCode = async (searchCode: string): Promise<ApiResponse<ProductFromAPI | null>> => {


    try {
        const resultProduct = await prisma.oSF_Product.findFirst({
            where: {
                codigoEan: searchCode
            }
        })


        return {
            ok: true,
            message: "Producto encontrado",
            data: resultProduct
        }

    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: null
        }
    }
}