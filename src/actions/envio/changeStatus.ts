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
        en_ruta: "enviado",
        recibido_tienda: "tienda",
        entregado_cliente: "recibido",
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


        if (estado === 'en_preparacion' || estado === 'en_ruta' || estado === 'entregado_cliente') {

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


    // RECORRER LA LISTA DE LOS ORDENES 
    for (const { order, destino } of orderList) {
        try {

            // OBTENER EL DESTINO DEL ORDEN
            if (estado === 'en_preparacion') {
                try {
                    // OBTENER EL DESTINO
                    const response = await fetch(`https://sami3-external.winwinafi.com/orders/kayser.pe/filters?orderNumber=${order}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`,
                        },
                    });
                    const dataOrder = await response.json()


                    if (!dataOrder.bEstado) {
                        throw new Error('# de ORDEN no Existe en WINWIN')
                    }
                    const data_envio = dataOrder.obj.ordenes[0].datos_envio[0]

                    if (data_envio.tipo_envio === 'recojo en tienda') {
                        const nombre_tienda = data_envio.direccion_envio

                        destino.label = nombre_tienda
                    } else {
                        const nombre_tienda = data_envio.direccion_envio

                        destino.label = nombre_tienda
                    }

                } catch (error: any) {
                    failedOrders.push({ order: { order, destino }, error: error.message })
                    continue;
                }
            }

            // Actualizar orden en la API
            await updateOrderInAPI(order, estado);

            // -- sp_UpdateOrders(p_OrderNumber, p_StatusID, p_UserID, p_PickupPoint, p_status, p_CommentText) 

            // Ejecutar sp_updateOrders
            const [result] = await prisma.$transaction(async (tx) => {
                // Llama al procedimiento almacenado
                await tx.$executeRaw`
                    CALL sp_UpdateOrders(${order}, ${estadoId}, ${userId}, ${destino.label}, ${estado}, ${CommentText}, @result);
                `;

                // Recupera el mensaje desde la variable de salida
                const [message] = await tx.$queryRaw<{ message: string }[]>`
                    SELECT @result AS message;
                `;

                return [message.message];
            });

            if (result.includes("ERROR:")) {
                console.error(`Error en la base de datos: ${result} ${order}`);
                throw new Error(`Error en la base de datos: ${result}`);
            }

        } catch (error: any) {
            console.error(`Error procesando la orden ${order}: `, error.message);
            failedOrders.push({ order: { order, destino }, error: error.message });
        }
    }

    revalidatePath(path);
    return failedOrders;
};
