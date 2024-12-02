'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { orderUpdate } from "./api/PUT-order";

export const resetOrder = async (order: string, userId: number, estado: string = "reset_status", CommentText: string = "RESETEADO", estadoId = null, destino = null) => {
    const session = await auth();

    if (CommentText.trim() === "") {
        CommentText = "RESET";
    }
    // ACtualizar en La BD
    console.log(session, '🖐️🖐️')
    const [result] = await prisma.$transaction(async (tx) => {
        // Llama al procedimiento almacenado
        await tx.$executeRaw`
            CALL sp_UpdateOrders(${order}, ${estadoId}, ${userId}, ${destino}, ${estado}, ${CommentText}, @result);
        `;

        // Recupera el mensaje desde la variable de salida
        const [message] = await tx.$queryRaw<{ message: string }[]>`
            SELECT @result AS message;
        `;

        return [message.message];
    });

    // Actualizar en la API
    await orderUpdate(order, estado)

    return result;
}

