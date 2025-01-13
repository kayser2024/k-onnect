'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getTipoRol = async () => {

    try {

        const session = await auth()

        if (!session) return { ok: false, message: 'No se encontro la sesion' }

        const usuario = await prisma.users.findUnique({
            where: { NroDoc: session.user.NroDoc },
            include: { Roles: true }

        })

        if (!usuario) return { ok: false, message: 'No se encontro el usuario' }

        return {
            ok: true,
            data: usuario.Roles.Description,
            message: 'Rol encontrado'
        }

    } catch (error) {

        return { ok: false, message: 'Error al conectarse a la BD' }

    }
}