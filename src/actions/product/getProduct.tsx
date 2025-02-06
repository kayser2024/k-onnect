'use server'

import prisma from "@/lib/prisma"

export const getProductBySearchCode = async (searchCode: string) => {


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
            data: []
        }
    }
}