"use server"

import { revalidatePath } from "next/cache"


export const onChangeStatusSend = async (orderList: string[], estado: string, path: string) => {
    console.log('manejando ', estado, 'desde el servidor', orderList, path)

    let failedOrders: { order: string, error: string }[] = []; // Aquí almacenamos las órdenes fallidas

    let fecha = new Date()
    fecha.setHours(fecha.getHours() - 5);

    // Actualizar estado
    const jsonUpdateEstado = {
        "actualizar": {
            "situacion_envio":
                { "estado_envio": estado }
        }
    }
    // Actualizar Fecha
    const jsonUpdateFechaEstado = {
        "actualizar": {
            "situacion_envio":
                { "enviado": fecha.toISOString() }
        }
    }

    const configurationEstado = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdateEstado)
    }

    const configurationFecha = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdateFechaEstado)
    }



    for (const order of orderList) {
        const base_url = `${process.env.WIN_WIN_PUT}/${order}`;


        try {
            const dataEstadoEnvio = await fetch(base_url, configurationEstado)
            const response = await dataEstadoEnvio.json();
            const dataFechaEnvio = await fetch(base_url, configurationFecha)
            if (response.sRpta !== "Actualizado correctamente en la base de datos") {
                // Si la respuesta no es exitosa, agregamos el pedido a la lista de fallidos
                failedOrders.push({ order, error: response.sRpta });
            }

        } catch (error: any) {
            console.log(error.message);
            failedOrders.push({ order, error: error.message });

        }
    }

    revalidatePath(path, 'page')


    return failedOrders;
}
