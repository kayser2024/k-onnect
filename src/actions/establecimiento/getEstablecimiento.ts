'use server';

import prisma from "@/lib/prisma";


export const getAllEstablecimientos = async () => {

    const pickupPoints = await prisma.pickupPoints.findMany();

    console.log(pickupPoints);

    return pickupPoints;
}