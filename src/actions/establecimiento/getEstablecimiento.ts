'use server';

import prisma from "@/lib/prisma";


export const getAllEstablecimientos = async (search: string) => {

    const pickupPoints = await prisma.pickupPoints.findMany({
        where: {
            Description: {
                contains: search,
            }
        }
    }
    );

    return pickupPoints.map(p => ({
        value: `${p.PickupPointID}`,
        label: `${p.Description}`
    }));
}

