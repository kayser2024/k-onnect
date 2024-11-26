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

    let CommentText = 'agregando comentarios'


    // Función para actualizar una orden en la API
    const updateOrderInAPI = async (order: string, estado: string) => {
        if (estado === 'preparacion' || estado === 'enviado' || estado === 'recibido') {

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
            // const existOrder = await prisma.orders.findFirst({ where: { OrderNumber: order } });
            // if (existOrder) {
            //     failedOrders.push({ order: { order, destino }, error: `La orden ${order} ya existe en la BD` });
            //     continue;
            // }

            // OBTENER EL DESTINO
            const response = await fetch(`https://sami3-external.winwinafi.com/orders/kayser.pe/filters?orderNumber=${order}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `${process.env.SAMISHOP_API_TOKEN}`,
                },
            });
            const destinoFetch = await response.json()

            console.log({ destino: destinoFetch.obj.ordenes[0].datos_envio[0].direccion_envio }, '🔴🔴')

            // obtener el ID del establecimiento
            const establecimientoId = await prisma.pickupPoints.findFirst({
                where: {
                    Description: destinoFetch.obj.ordenes[0].datos_envio[0].direccion_envio,
                },
            }).then((store) => store?.PickupPointID);

            console.log(establecimientoId)

            // Actualizar orden en la API
            await updateOrderInAPI(order, estado);

            // Insertar la orden en la base de datos
            // await insertOrder(order, parseInt(destino.value), estadoId);


            // Ejecutar sp_updateOrders
            const result = await prisma.$executeRaw`
                CALL sp_UpdateOrders(${order}, ${estadoId}, ${userId}, NULL, ${estado}, ${CommentText}, @result);
            `;
            const result2 = await prisma.$executeRaw`
                SELECT @result AS message;
            `;
            console.log(result2, '🟡🟡')
        } catch (error: any) {
            console.error(`Error procesando la orden ${order}:`, error.message);
            failedOrders.push({ order: { order, destino }, error: error.message });
        }
    }

    revalidatePath(path);
    return failedOrders;
};
