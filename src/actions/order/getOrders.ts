'use server'

import prisma from "@/lib/prisma";

export const getOrders = async () => {
    let result;

    try {
        result = await prisma.orders.findMany();
        // console.log(result);

    } catch (error: any) {
        result = error.message;
    }

    return result;

}

export const getDataOrderByInvoice = async (invoice: string) => {
    let result;

    try {

        result = await prisma.orders.findFirst({
            where: {
                Invoice: invoice
            }
        })
        console.log(result);
        return {
            ok: true,
            message: "Order Encontrado con éxito",
            data: result
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: []
        }
    }
}
