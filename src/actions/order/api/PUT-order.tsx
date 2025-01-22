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

    console.log(data)


    let resutlPickupPoint;
    let pickupPoint;

    // obtener el usuario
    const session = await auth()
    const userId = session!.user.UserID

    const url = `https://sami3-external.winwinafi.com/orders/kayser.pe/${orden}`;


    // verificar el tipo de envío 🚩
    if (data.tipo_envio === "recojo en tienda") {
        // buscar la tienda para obtener los datos del pickupPoint
        resutlPickupPoint = await prisma.pickupPoints.findMany({
            where: {
                Description: data.direccion_envio
            }
        })

        //    PickupPointID: 3,
        //   Description: 'KAYSER LURIN - LURIN',✔️
        //   District: 'Lurin',✔️
        //   Province: 'Lima',✔️
        //   Department: 'Lima',✔️
        //   LocationCode: 'PE150119',✔️
        //   Place: 'Lurin',
        //   Address: 'Calle Monasterio S/N Predio San Vicente Parcela B-63 Sub Lote C  - Lurin ',
        //   Grouped: 'LIMA'

        // armar la data para actualizar 🚩
        const { Description, District, Province, Department, LocationCode, PickupPointID } = resutlPickupPoint[0]

        pickupPoint = {
            PickupPointID,
            Description,
            District,
            Province,
            Department,
            LocationCode
        }
        console.log(resutlPickupPoint)
    } else {
        // en caso de que es delivery armar la data 🚩

        // nombres_envio: 'Rossmery Claudia',
        // apellidos_envio: 'contreras',
        // direccion_envio: 'jr los badianes 306 urb. san ignacio',✔️
        // referencia_envio: 'nueva referencia',✔️
        // telefono_envio: '941064317',
        // departamento: 'lima', ✔️
        // provincia: 'CAÑETE',✔️
        // distrito: 'SAN VICENTE DE CAÑETE',✔️
        // dni_envio: '42412807',
        // servicio_envio: 'programado',
        // ubigeo: '150501',✔️
        // tipo_envio: 'delivery'

        pickupPoint = {
            PickupPointID: 56,
            Description: data.direccion_envio,
            District: data.distrito,
            Province: data.provincia,
            Department: data.departamento,
            LocationCode: data.ubigeo
        }


    }







    // TODO:armar data para actualizar en API🚩
    const jsonData = {
        "actualizar": {
            "datos_envio":
            {
                "nombres_envio": data.nombres_envio,
                "apellidos_envio": data.apellidos_envio,
                "direccion_envio": pickupPoint.Description,          //✔️
                "referencia_envio": data.referencia_envio,
                "telefono_envio": data.telefono_envio,
                "pais": "Perú",
                "departamento": pickupPoint.Department,              //✔️
                "provincia": pickupPoint.Province,                    //✔️
                "distrito": pickupPoint.District,                      //✔️
                "dni_envio": data.dni_envio,
                "servicio_envio": data.servicio_envio,
                "ubigeo": pickupPoint.LocationCode,                          //✔️
                "tipo_envio": data.tipo_envio
            }
        }
    }


    try {
        //1. Actualizar APi🚩
        // const response = await fetch(url, {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
        //     },
        //     body: JSON.stringify(jsonData)

        // });

        // const dataFetch = await response.json();

        // if (!dataFetch.bEstado) {
        //     throw new Error("OCURRIÓ UN ERROR INESPERADO")
        // }

        //2. Actualizar en OrderLogs 🚩
        const now = new Date();
        now.setHours(now.getHours() - 5);

        // obtener información de la orden
        const orderData = await prisma.orders.findUnique({ where: { OrderNumber: orden } })

        console.log(orderData)

        // verificar que la orden existe en la BD 🚩
        if (!orderData) {
            return { ok: false, message: "No se encontró la orden, comuniquese con el Área correspondiente" }
        }

        // Verificar que InfoShippingID no sea null
        if (orderData.InfoShippingID === null) {
            return { ok: false, message: "No se encontró la información de envío, comuníquese con el Área correspondiente" };
        }

        // Actualizar el nuevo pickupPoints en la tabla orden
        const resultOrders = await prisma.orders.update({
            where: { OrderNumber: orden },
            data: { PickupPoint: data.tipo_envio === "delivery" ? "DELIVERY" : pickupPoint.Description, UserUpdaterID: userId, UpdatedAt: now }
        })


        // Actualizar infoShipping 🚩
        const resulInfoShipping = await prisma.infoShipping.update({
            where: { InfoShippingID: orderData.InfoShippingID },
            data: {
                Nombre: data.nombres_envio,
                LastName: data.apellidos_envio,
                Address: pickupPoint.Description,
                Reference: data.referencia_envio,
                Phone: data.telefono_envio,
                Country: "Perú",
                Department: pickupPoint.Department,
                Province: pickupPoint.Province,
                District: pickupPoint.District,
                Dni: data.dni_envio,
                Service: data.servicio_envio,
                LocationCode: pickupPoint.LocationCode,
                TypeShipping: data.tipo_envio,
                PickupPointID: pickupPoint.PickupPointID,
            }

        })


        const responseOrders = await prisma.orderLogs.create({
            data: {
                CommentText: `Cambió Información de Envío`,
                StatusOld: orderData!.StatusID,
                StatusID: orderData!.StatusID || 0,
                OrderNumber: orden,
                UserID: userId,
                CreatedAt: now
            }
        })

        // si hay error al crear una orden devolver un error
        if (!responseOrders) {
            return { ok: false, message: "No se pudo crear la orden, comuniquese con el Área correspondiente" }
        }

        // si la respuesta es OK, revalidar la Página
        // if (dataFetch.sRpta) {
        //     revalidatePath(`/pedido/${orden}`);
        // }

        // return dataFetch.sRpta;



    } catch (error: any) {
        return error.message
    }

    return { ok: true, message: "Se realizaron los cambios correctamente" }

}


export const updateStatusPayment = async (order: string, status: string) => {

    const BASE_URL = process.env.WIN_WIN_PUT;
    let result;
    const currentUTCDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "UTC" })
    ).toISOString();

    const body = {
        "actualizar": {
            "situacion_pagos": {
                "estado_pago": status
            },

        }
    };

    try {
        const response = await fetch(`${BASE_URL}/${order}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
            },
            body: JSON.stringify(body),
        })
        const dataFetch = await response.json();

        if (dataFetch.sRpta) {
            revalidatePath(`/pedido/${order}`);
        }
        result = await response.json();

    } catch (error: any) {
        console.log(error.message)
        result = error.message
    }

    return result;
}