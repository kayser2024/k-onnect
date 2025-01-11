'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { orderUpdate } from "./api/PUT-order";

export const resetOrder = async (orderNumber: string, userID: number, estado: string = "reset_status", CommentText: string = "RESETEADO", estadoId = null, destino = null) => {
    const session = await auth();
    const userId = session!.user.UserID

    if (!session) {
        throw new Error("Usuario no autenticado");
    }
    let invoice = ""
    let dataFacturation = null;
    let dataEnvio = null


    if (CommentText.trim() === "") {
        CommentText = "RESET";
    }

    // ACtualizar en La BD
    const [result] = await prisma.$transaction(async (tx) => {
        // Llama al procedimiento almacenado
        await tx.$executeRaw`
            CALL sp_UpdateOrders(${orderNumber}, ${invoice}, ${estadoId}, ${userId}, ${destino}, ${estado}, ${CommentText},${dataEnvio || {}},${dataFacturation || {}}, @result);
        `;

        // Recupera el mensaje desde la variable de salida
        const [message] = await tx.$queryRaw<{ message: string }[]>`
            SELECT @result AS message;
        `;

        return [message.message];
    });

    // Actualizar en la API
    await orderUpdate(orderNumber, estado)

    return result;
}

