'use server'

import prisma from "@/lib/prisma";

export const getOrders = async () => {
    let result;

    try {
        result = await prisma.orders.findMany();
        // console.log(result);

    } catch (error: any) {
        result = error.message;
    }

    return result;

}