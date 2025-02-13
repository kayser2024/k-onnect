'use server'

import prisma from "@/lib/prisma"

export const updateIsAvailable = async (pickupID: number, status: boolean) => {

    try {

        const result = await prisma.pickupPoints.update({
            where: {
                PickupPointID: pickupID,
            },
            data: {
                IsAvailablePickup: status
            },
        })

        return {
            ok: true,
            message: 'El estado del establecimiento ha sido actualizado',
            data: result,
        }
    } catch (error: any) {

    }

}