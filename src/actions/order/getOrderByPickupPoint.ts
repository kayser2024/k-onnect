'use server'

import prisma from "@/lib/prisma";

export const getOrderByPickupPoint = async (startDate: Date | undefined, endDate: Date | undefined, orderStatusId: number, pickupPoint: number) => {
    let result;

    // Ajustar la fecha de inicio a las 00:00:00
    const startOfDay = new Date(startDate ?? new Date());
    startOfDay.setHours(0, 0, 0, 0);

    // Ajustar la fecha de fin a las 23:59:59
    const endOfDay = new Date(endDate ?? new Date());
    endOfDay.setHours(23, 59, 59, 999);

    try {
        result = await prisma.orders.findMany({
            where: {
                CreatedAt: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                // PickupPointID: pickupPoint,
                StatusID: orderStatusId, //estaddo 3 => en_ruta, 4 => recibido en tienda
                OR: [
                    { PickupPointID: pickupPoint },
                    {
                        Incidence: {
                            some: {
                                PickupPointID: pickupPoint
                            }
                        }
                    }
                ]
            },
        });


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