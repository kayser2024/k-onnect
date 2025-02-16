'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"

export const insertComment = async (comment: string, orden: string) => {

    const now = new Date();
    now.setHours(now.getHours() - 5);

    const session = await auth();
    const userId = session!.user.UserID

    if (!session) {
        throw new Error("Usuario no autenticado");
    }
    let result;

    try {
        // obtener el StatusCurrent
        const orderData = await prisma.orders.findUnique({ where: { OrderNumber: orden } })
        let StatusID = orderData!.StatusID || 0;
        // console.log(orderData);
        if (!orderData) {
            return ({ ok: false, message: "Orden No encontrada" });
        }

        if (comment === "DEVOLUCION TOTAL") {
            StatusID = 6;
            // actualizar orden
            await prisma.orders.update({
                where: { OrderNumber: orden },
                data: { StatusID: StatusID, UserUpdaterID: userId }
            })
        }


        result = await prisma.orderLogs.create({
            data: {
                CommentText: comment,
                StatusOld: orderData!.StatusID,
                StatusID: StatusID,
                OrderNumber: orden,
                UserID: userId,
                CreatedAt: now
            }
        })

        // console.log(result)
    } catch (error: any) {
        // result = error.message
        result = { ok: false, message: "Error: " + error.message }

    }

    return {
        ok: true,
        message: result ? result.CommentText : "Comentario agregado correctamente"
    };
}