"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Option {
    value: string;
    label: string;
}

export const onChangeStatusSend = async (orderList: { order: string; destino: Option }[], estado: string, path: string) => {
    const session = await auth();
    const userId = 1;

    const failedOrders: { order: { order: string; destino: Option }; error: string }[] = [];
    const fecha = new Date();
    fecha.setHours(fecha.getHours() - 5);

    const estadosMap: Record<string, string> = {
        pendiente: "pendiente",
        en_preparacion: "preparacion",
        enviado: "enviado",
        en_tienda: "tienda",
        recibido: "recibido",
    };

    const estadoAPI = estadosMap[estado] || "";
    if (!estadoAPI) {
        console.log("Estado no reconocido:", estado);
        return [];
    }

    const jsonUpdate = {
        "actualizar": {
            "situacion_envio": {
                "estado_envio": estadoAPI,
                [estadoAPI]: fecha.toISOString(),
            },
        },
    };

    const configuration = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
        },
        body: JSON.stringify(jsonUpdate),
    };

    const base_url = process.env.WIN_WIN_PUT;

    // Función para manejar la inserción de órdenes
    // const insertOrder = async (orderNumber: string, pickupPointId: number, statusId: number) => {
    //     return await prisma.orders.create({
    //         data: {
    //             OrderNumber: orderNumber,
    //             StatusID: statusId,
    //             UserID: +userId,
    //             PickupPointID: pickupPointId,
    //             CreatedAt: fecha,
    //         },
    //     });
    // };


    let CommentText = 'agregando comentarios'

    // Función para manejar el update status de ordenes
    const updateOrder = async (orderNumber: string, statusId: number) => {

        try {
            // Si el stored procedure acepta parámetros
            const result = await prisma.$executeRaw`
                CALL LogOrderStatusUpdate(${orderNumber}, ${statusId},${userId},${CommentText});
            `;

            return result; // Este valor será 0 o 1 dependiendo de si el SP se ejecutó correctamente
        } catch (error) {
            console.error("Error ejecutando el stored procedure:", error);
            throw new Error("Error actualizando el estado de la orden");
        }
    }


    // Función para actualizar una orden en la API
    const updateOrderInAPI = async (order: string) => {
        try {
            const response = await fetch(`${base_url}/${order}`, configuration);
            const data = await response.json();
            if (data.sRpta !== "Actualizado correctamente en la base de datos") {
                throw new Error(data.sRpta);
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    // Obtener el ID del estado actual
    const estadoId = await prisma.orderStatus
        .findFirst({ where: { Description: estado } })
        .then((status) => status?.StatusID);

    if (!estadoId) {
        console.error(`Estado "${estado}" no encontrado en la base de datos.`);
        return [];
    }

    for (const { order, destino } of orderList) {
        try {
            // Verificar si la orden ya existe en la base de datos
            const existOrder = await prisma.orders.findFirst({ where: { OrderNumber: order } });
            if (existOrder) {
                failedOrders.push({ order: { order, destino }, error: `La orden ${order} ya existe en la BD` });
                continue;
            }

            // Actualizar orden en la API
            await updateOrderInAPI(order);

            // Insertar la orden en la base de datos
            // await insertOrder(order, parseInt(destino.value), estadoId);


            // Ejecutar sp_updateOrders
            const result = await prisma.$executeRaw`
                CALL sp_UpdateOrders(${order}, ${estadoId}, ${userId}, ${estado}, ${CommentText});
            `;

            console.log(result, '🟡🟡')
        } catch (error: any) {
            console.error(`Error procesando la orden ${order}:`, error.message);
            failedOrders.push({ order: { order, destino }, error: error.message });
        }
    }

    revalidatePath(path);
    return failedOrders;
};
