'use server'

import prisma from "@/lib/prisma";

export const getOrdersByDate = async (start: Date, end: Date, userId: number, statusId: number) => {

    // Ajustar la fecha de inicio a las 00:00:00
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);

    // Ajustar la fecha de fin a las 23:59:59
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    let result
    try {
        result = await prisma.orders.findMany({
            where: {
                CreatedAt: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                UserID: userId,
                StatusID: statusId,
            },
            select: {
                OrderNumber: true,
                Invoice: true,
                PickupPoint: true,
                Users: {
                    select: {
                        Name: true,
                    }
                },
                OrderStatus: {
                    select: {
                        Description: true,
                    }
                },
                CreatedAt: true,
            }

        });

    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: []
        };
    }

    return {
        ok: true,
        data: result,
        message: "Filtro realizado con éxito"
    }

}