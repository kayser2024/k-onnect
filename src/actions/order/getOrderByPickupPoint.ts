'use server'

import prisma from "@/lib/prisma";

export const getOrderByPickupPoint = async (pickupPoint: number) => {
    console.log(pickupPoint)
    let result;
    try {
        result = await prisma.orders.findMany({
            where: {
                PickupPointID: pickupPoint,
                // StatusID: 3 //estaddo 3 => en_ruta, 4 => recibido en tienda
            },
        });
        console.log(result)
        return {
            ok: true,
            data: result,
            message: "Consulta realizada con éxito"
        }
    } catch (error: any) {

        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }

    }

}