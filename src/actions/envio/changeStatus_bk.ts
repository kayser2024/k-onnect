"use server"

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache"

interface Option {
    value: string;
    label: string;
}


export const onChangeStatusSend = async (orderList: { order: string, destino: Option }[], estado: string, path: string) => {
    console.log('manejando ', estado, 'desde el servidor', orderList, path)

    const session = await auth()

    // const user_id = session?.user.dni
    const user_id = 1

    // const result = await prisma.orders.create({
    //     data: {
    //         OrderNumber: orderList[0].order,
    //         StatusID: 1,
    //         UserID: user_id,
    //         PickupPointID: 1,
    //         CreatedAt: new Date(),
    //     }
    // })

    // console.log(result, '🚩');

    // TODO: Obtener solo las ordenes de OrderList 
    let failedOrders: { order: { order: string, destino: Option }, error: string }[] = []; // Aquí almacenamos las órdenes fallidas
    let estadoFechaActualizar = ''

    let fecha = new Date()
    fecha.setHours(fecha.getHours() - 5);

    const jsonUpdate = {
        "actualizar": {
            "situacion_envio": {
                "estado_envio": estadoFechaActualizar,
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



    switch (estado) {
        case 'pendiente':
            estadoFechaActualizar = 'pendiente'
            // TODO: INSERTAR en la Tabla Orders && PUT en la API 🚩


            break;
        case 'en_preparacion':
            estadoFechaActualizar = 'preparacion'
            // TODO: UPDATE status en la Tabla Orders && PUT en la API 🚩
           
            // obtener el id del estado de la orden
            const estado_id = await prisma.orderStatus.findFirst({
                where: {
                    Description: estado
                }
            }).then((status) => {
                return status?.StatusID
            })

            // Actualizar en la api los
            for (const order of orderList) {

                const base_url = `${process.env.WIN_WIN_PUT}/${order.order}`;

                try {
                    //  VERIFICAR SI EXISTE EN LA BD PARA NO ACTUALIZAR
                    const existOrder = await prisma.orders.findFirst({ where: { OrderNumber: order.order } })

                    if (!existOrder) {
                        const response = await fetch(base_url, configuration)
                        const data = await response.json();
                        if (data.sRpta !== "Actualizado correctamente en la base de datos") {
                            // Si la respuesta no es exitosa, agregamos el pedido a la lista de fallidos
                            failedOrders.push({ order, error: data.sRpta });
                            continue
                        }


                        // INSERTAR EN LA BD LOS REGISTROS 
                        const resultInsert = await prisma.orders.create({
                            data: {
                                OrderNumber: order.order,
                                StatusID: estado_id,//estado de la orden 'pendiendo','preparacion', etc...
                                UserID: 1,
                                PickupPointID: parseInt(order.destino.value),
                                CreatedAt: fecha,
                            }
                        })

                    } else {
                        failedOrders.push({ order, error: `La ${order.order} ya existe en la BD` })
                    }


                } catch (error: any) {
                    console.log(error.message);
                    failedOrders.push({ order, error: error.message });

                }
            }

            break;
        case 'enviado':
            estadoFechaActualizar = 'enviado'
            // TODO: UPDATE status en la Tabla Orders && PUT en la API 🚩

            break;
        case 'en_tienda':
            // TODO: UPDATE status en la Tabla Orders 🚩

            break;
        case 'recibido':
            // TODO: UPDATE status en la Tabla Orders && PUT en la API 🚩

            estadoFechaActualizar = 'recibido'
            break;
        default:
            console.log('Ninguno');
            break
    }


    revalidatePath(path)


    return failedOrders;
}
