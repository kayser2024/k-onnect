"use server"

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache"


export const onChangeStatusSend = async (orderList: { order: string, destino: string }[], estado: string, path: string) => {
    console.log('manejando ', estado, 'desde el servidor', orderList, path)

    const session = await auth()

    // const user_id = session?.user.dni
    const user_id = 1

    const result = await prisma.orders.create({
        data: {
            OrderNumber: orderList[0].order,
            StatusID: 1,
            UserID: user_id,
            PickupPointID: 1,
            CreatedAt: new Date(),
        }
    })

    console.log(result, '🚩');

    // TODO: Obtener solo las ordenes de OrderList 
    let failedOrders: { order: { order: string, destino: string }, error: string }[] = []; // Aquí almacenamos las órdenes fallidas

    let fecha = new Date()
    fecha.setHours(fecha.getHours() - 5);


    let estadoFechaActualizar = ''
    switch (estado) {
        case 'pendiente':
            estadoFechaActualizar = 'pendiente'
            break;
        case 'en_preparacion':
            estadoFechaActualizar = 'preparacion'
            break;
        case 'enviado':
            estadoFechaActualizar = 'enviado'
            break;
        case 'recibido':
            estadoFechaActualizar = 'recibido'
            break;
        default:
            console.log('Ninguno');
            break
    }


    const jsonUpdate = {
        "actualizar": {
            "situacion_envio": {
                "estado_envio": estado,
                [estadoFechaActualizar]: fecha.toISOString()
            }
        }
    }


    const configuration = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdate)
    }



    // Actualizar en la api los
    // for (const order of orderList) {
    //     const base_url = `${process.env.WIN_WIN_PUT}/${order.order}`;


    //     try {
    //         const response = await fetch(base_url, configuration)
    //         const data = await response.json();
    //         if (data.sRpta !== "Actualizado correctamente en la base de datos") {
    //             // Si la respuesta no es exitosa, agregamos el pedido a la lista de fallidos
    //             failedOrders.push({ order, error: data.sRpta });
    //         }

    //         // TODO: INSERTAR EN LA BD LOS REGISTROS 🚩
    //         // userId
    //         // Status
    //         // Order
    //         // Comments
    //         // createdAt
    //         // updatedAt

    //         await prisma.orders.create({
    //             data: {
    //                 OrderNumber: order.order,
    //                 StatusID: 1,
    //                 UserID: 2,
    //                 PickupPointID: 1,
    //                 CreatedAt: new Date(),
    //             }
    //         })


    //     } catch (error: any) {
    //         console.log(error.message);
    //         failedOrders.push({ order, error: error.message });

    //     }
    // }

    revalidatePath(path, 'page')


    return failedOrders;
}
