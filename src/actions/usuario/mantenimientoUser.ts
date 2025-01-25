'use server';

import prisma from "@/lib/prisma";
import { User } from "@/types/User";
import bcryptjs from 'bcryptjs';

export const getAllUsers = async () => {
    let result;
    try {
        result = await prisma.users.findMany()


    } catch (error: any) {
        console.log(error)
        result = error.message
    }
    return result
}

export const getUsersByRol = async (rolId: number) => {
    let result;
    try {
        result = await prisma.users.findMany({
            where: {
                RoleID: rolId
            }
        });
    } catch (error: any) {
        result = error.message
    }
    return result;
}

export const getUserByID = async (userID: number) => {

    let result;
    try {
        result = await prisma.users.findUnique({
            where: { UserID: userID },
            select: {
                UserID: true,
                NroDoc: true,
                Name: true,
                LastName: true,
                Email: true,
                RoleID: true,
                Status: true,
            }
        });

    } catch (error: any) {
        result = error.message
    }
    return result;
}

export const createUser = async (data: User) => {
    console.log(data, 'ENTRANDO CREATE PRISMA')
    const now = new Date();
    now.setHours(now.getHours() - 5); // Ajuste de zona horaria


    let result;

    // encriptar la contraseña
    const passwordHash = await bcryptjs.hash(data.NroDoc, 10);

    try {
        result = await prisma.users.create({
            data: {
                Email: data.Email,
                Name: data.Name,
                LastName: data.LastName,
                TypeDocID: data.TypeDocID,
                NroDoc: data.NroDoc,
                RoleID: data.RoleID,
                Password: passwordHash,
                PickupPointID: data.PickupPointID === 0 ? null : data.PickupPointID,
                CreatedAt: now,
            }
        });

    } catch (error: any) {
        console.log(error)
        return error.message
    }

    return result;
}

export const updateUser = async (data: User) => {
    let result;
    const now = new Date();
    now.setHours(now.getHours() - 5); // Ajuste de zona horaria
    try {
        result = await prisma.users.update({
            where: { UserID: data.UserID },
            data: {
                Name: data.Name,
                LastName: data.LastName,
                Email: data.Email,
                RoleID: Number(data.RoleID),
                Status: data.Status,
                UpdatedAt: now,
            },
        })

    } catch (error: any) {
        result = error.message
    }

    return result;
}

export const resetPassword = async (userID: number, dni: string) => {
    let result;

    try {
        const passwordHash = await bcryptjs.hash(dni, 10);

        result = await prisma.users.update({
            where: { UserID: userID },
            data: { Password: passwordHash },
        });

    } catch (error: any) {
        result = error.message
    }

    console.log(result, '👀👀')

    return result;
}

export const changeStatusUser = async (userID: number, status: boolean) => {
    let result;
    const now = new Date();
    now.setHours(now.getHours() - 5); // Ajuste de zona horaria

    try {
        result = await prisma.users.update({
            where: { UserID: userID },
            data: {
                Status: status,
                UpdatedAt: now,
            },
        });

    } catch (error: any) {
        console.log(error.message);

        result = error.message
    }

    return result;
}