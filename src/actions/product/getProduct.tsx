'use server'

import prisma from "@/lib/prisma"

interface ProductFromAPI {
    ProductID: number;
    CodBar: string ;
    CodProd: string ;
    Description: string ;
    ImageUrl: string ;
}

interface ApiResponse<T> {
    ok: boolean;
    message: string;
    data: T;
}
export const getProductBySearchCode = async (searchCode: string): Promise<ApiResponse<ProductFromAPI | null>> => {


    try {
        const resultProduct = await prisma.tbl_product_master.findFirst({
            where: {
                CodBar: searchCode
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