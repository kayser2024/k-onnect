'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getTipoRol = async () => {

    try {

        const session = await auth()

        if (!session) return { ok: false, message: 'No se encontro la sesion' }

        const usuario = await prisma.usuarios.findUnique({
            where: { dni: session.user.dni },
            include: { roles: true }

        })

        if (!usuario) return { ok: false, message: 'No se encontro el usuario' }

        return {
            ok: true,
            data: usuario.roles.name,
            message: 'Rol encontrado'
        }

    } catch (error) {

        return { ok: false, message: 'Error al conectarse a la BD' }

    }
}