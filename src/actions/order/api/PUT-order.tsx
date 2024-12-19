'use server'

import prisma from "@/lib/prisma";
import { auth } from '@/auth.config';
import { revalidatePath } from "next/cache";


export const orderUpdate = async (order: string, estado: string) => {
    let result;
    const currentUTCDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "UTC" })
    ).toISOString();

    let jsonUpdateEstado;
    if (estado === 'reset_status') {
        jsonUpdateEstado = {
            "actualizar": {
                "situacion_envio": {
                    "estado_envio": "preparacion",
                    "preparacion": currentUTCDate,
                    "enviado": null,
                    "recibido": null
                },
            },
        };
    } else {

        jsonUpdateEstado = {
            "actualizar": {
                "situacion_envio": {
                    "estado_envio": estado,
                    [estado]: currentUTCDate,
                },
            },
        };

    }

    const getConfig = (body: object) => ({
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
        },
        body: JSON.stringify(body),
    });

    const base_url = process.env.WIN_WIN_PUT;
    try {
        const response = await fetch(`${base_url}/${order}`, getConfig(jsonUpdateEstado))

        result = await response.json();
    } catch (error: any) {
        console.log(error.message);
        result = error.message;

    }

    return result


}

export const updateShippingInfo = async (data: any) => {

    const { orden } = data;

    // obtener el usuario
    const user = await auth()
    console.log({ session: user?.user.name }, '👍👍👍👍')


    const url = `https://sami3-external.winwinafi.com/orders/kayser.pe/${orden}`;

    // Obtener los datos de tienda
    const pickupPoint = await prisma.pickupPoints.findMany({
        where: {
            Description: data.direccion_envio
        }
    })


    const jsonData = {
        "actualizar": {
            "datos_envio":
            {
                "nombres_envio": data.nombres_envio,
                "apellidos_envio": data.apellidos_envio,
                "direccion_envio": data.direccion_envio,
                "referencia_envio": data.referencia_envio,
                "telefono_envio": data.telefono_envio,
                "pais": data.pais,
                "departamento": data.departamento,
                "provincia": data.provincia,
                "distrito": data.distrito,
                "dni_envio": data.dni_envio,
                "servicio_envio": data.servicio_envio,
                "ubigeo": data.ubigeo,
                "tipo_envio": data.tipo_envio
            }
        }
    }


    try {
        // Actualizar APi🚩
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
            },
            body: JSON.stringify(jsonData)

        });

        const dataFetch = await response.json();

        if (!dataFetch.bEstado) {
            throw new Error("OCURRIÓ UN ERROR INESPERADO")
        }

        // Actualizar en OrderLogs 🚩
        const now = new Date();
        now.setHours(now.getHours() - 5);

        // obtener información de la orden
        const orderData = await prisma.orders.findUnique({ where: { OrderNumber: orden } })

        // Actualizar el nuevo pickupPoints en la tabla orden
        await prisma.orders.update({
            where: { OrderNumber: orden },
            data: { PickupPoint: pickupPoint[0].Description, UserUpdaterID: 1, UpdatedAt: now }
        })


        await prisma.orderLogs.create({
            data: {
                CommentText: `Se edito Información de Envío`,
                StatusOld: orderData!.StatusID,
                StatusID: orderData!.StatusID || 0,
                OrderNumber: orden,
                UserID: 1,
                CreatedAt: now
            }
        })


        if (dataFetch.sRpta) {
            revalidatePath(`/pedido/${orden}`);
        }

        return dataFetch.sRpta;

    } catch (error: any) {
        return error.message
    }
}