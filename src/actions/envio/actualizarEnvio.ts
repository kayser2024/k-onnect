"use server"

import { revalidatePath } from "next/cache"

export const onUpdateEnvio = async (orden: string, estado: string, path: string) => {

    console.log('manejando ', estado, 'desde el servidor', orden)


    const jsonUpdateEstadoEnvio = {
        "actualizar": {
            "situacion_envio":
                { "estado_envio": estado }
        }
    }

    const dataEstadoEnvio = await fetch(`${process.env.WIN_WIN_PUT}/${orden}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdateEstadoEnvio)
    }).then(res => res.json())

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

    // obtenemos fecha actual y le restamos 5 horas
    let fecha = new Date()
    fecha.setHours(fecha.getHours() - 5)

    const jsonUpdateFechaEnvio = {
        "actualizar": {
            "situacion_envio":
                { [estadoFechaActualizar]: fecha.toISOString() }
        }
    }

    if (estadoFechaActualizar !== 'pendiente') {
        const dataFechaEnvio = await fetch(`${process.env.WIN_WIN_PUT}/${orden}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
            },
            body: JSON.stringify(jsonUpdateFechaEnvio)
        }).then(res => res.json())

    }

    revalidatePath(path, 'page')
    return 'Evento manejado'
}
