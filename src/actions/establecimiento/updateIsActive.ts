'use server'

import prisma from "@/lib/prisma"

export const updateIsActive = async (pickupID: number, status: boolean) => {

    console.log(status)
    try {

        const dataToUpdate = {
            IsActive: status,
            IsAvailablePickup: status ? true : false, // Si status es false, actualizar IsAvailablePickup a false
        };

        const result = await prisma.pickupPoints.update({
            where: {
                PickupPointID: pickupID,
            },
            data: dataToUpdate
        })

        return {
            ok: true,
            message: 'El estado del establecimiento ha sido actualizado',
            data: result,
        }
    } catch (error: any) {

    }

}