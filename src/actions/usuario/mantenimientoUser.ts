'use server';

import prisma from "@/lib/prisma";
import { User } from "@/types/User";
import bcryptjs from 'bcryptjs';

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

export const getUserByDni = async (dni: string) => {

    let result;
    try {
        result = await prisma.usuarios.findUnique({
            where: { dni },
            select: {
                dni: true,
                name: true,
                lastName: true,
                email: true,
                rolId: true,
                status: true,
                image: true
            }
        });

    } catch (error: any) {
        result = error.message
    }
    return result;
}

export const createUser = async (data: User) => {
    console.log(data, 'ENTRANDO CREATE PRISMA')

    const { pickPointID, ...rest } = data;

    let result;

    // encriptar la contraseña
    const passwordHash = await bcryptjs.hash(data.dni, 10);

    try {
        // buscar el ID de la tienda
        const storeData = await prisma.pickupPoints.findFirst({
            where: {
                Description: pickPointID
            }
        });


        result = await prisma.usuarios.create({ data: { ...rest, emailVerified: 'no', image: '', password: passwordHash, pickupPointID: storeData?.PickupPointID } });

    } catch (error: any) {
        console.log(error)
        return error.message
    }


    return result;


}

export const updateUser = async (data: User) => {
    let result;
    try {
        result = await prisma.usuarios.update({
            where: { dni: data.dni },
            data: {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                rolId: Number(data.rolId),
                status: data.status,
            },
        })

    } catch (error: any) {
        result = error.message
    }

    return result;
}

export const resetPassword = async (id: string) => {
    let result;
    console.log({ id }, '💀ENtrando consulta RESET PRISMA')

    try {
        const passwordHash = await bcryptjs.hash(id, 10);

        result = await prisma.usuarios.update({
            where: { dni: id },
            data: { password: passwordHash },
        });

    } catch (error: any) {
        result = error.message
    }

    console.log(result, '👀👀')

    return result;
}

export const changeStatusUser = async (id: string, status: boolean) => {
    let result;
    try {
        result = await prisma.usuarios.update({
            where: { dni: id },
            data: { status },
        });

    } catch (error: any) {
        console.log(error.message);

        result = error.message
    }

    return result;
}