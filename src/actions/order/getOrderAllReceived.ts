'use server'

import prisma from "@/lib/prisma";

export const getAllOrderReceived = async (status: number, pickupPoint: number) => {
    console.log(status, pickupPoint)
    let result;
    try {
        result = await prisma.orders.findMany({
            where: {
                StatusID: {
                    in: [4, 5]
                },
                PickupPointID: pickupPoint,
                HasIncidence: false
            },
        });

        console.log(result)

        return {
            ok: true,
            message: "Todos los pedidos recibidos con éxito",
            data: result
        };


    } catch (error: any) {
        return {
            ok: true,
            message: error.message,
            data: []
        }
    }

}