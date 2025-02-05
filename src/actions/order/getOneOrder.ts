'use server'

import prisma from "@/lib/prisma"

export const getOneOrderLogs = async (order: string) => {

    let result;
    try {
        result = await prisma.orderLogs.findMany({
            where: {
                OrderNumber: order
            },
            orderBy: {
                CreatedAt: "asc"
            },
            include: {
                OrderStatus: true,
                Users: {
                    select: {
                        Name: true,
                        Roles: {
                            select: {
                                Description: true,
                            }
                        }
                    }
                },


            }

        })

    } catch (error: any) {
        result = error.message
    }

    return result;

}

export const getOrder = async (order: string) => {


    let result;
    try {
        result = await prisma.orders.findUnique({
            where: {
                OrderNumber: order
            }
        })
    } catch (error: any) {
        result = error.message
    }

    return result;

}

export const getInvoice = async (invoice: string) => {
    try {
        const resultInvoice = await prisma.orders.findFirst({
            where: {
                Invoice: invoice
            }
        })

        if (resultInvoice) {
            return {
                ok: true,
                message: "Invoice Encontrado con éxito",
                data: resultInvoice
            }
        } else {
            return {
                ok: false,
                message: "Boleta no encontrado en la BD, contáctase con el Área de DESARROLLO",
                data: null
            }
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: null
        }
    }
}