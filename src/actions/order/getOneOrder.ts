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
                }
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