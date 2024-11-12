'use server';

import prisma from "@/lib/prisma";

export const getAllUsers = async () => {
    let result;
    try {

        result = await prisma.usuarios.findMany()

    } catch (error: any) {
        console.log(error)
        result = error.message
    }
    return result
}