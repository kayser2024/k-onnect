'use server'

import prisma from "@/lib/prisma"

export const getOneOrder = async (order: string) => {

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
                OrderStatus: true
            }
        })

    } catch (error: any) {
        result = error.message
    }

    return result;

}