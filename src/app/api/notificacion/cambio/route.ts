import { onUpdateObservaciones } from "@/actions/observaciones/updateObservacion";
import { NextRequest, NextResponse } from "next/server";

interface Respuesta {
    fechaSolicitud: string,
    encargada: string,
    cliente: string,
    nroOrden: string,
    dni: string,
    enviado: string,
    lugar: string,
    boleta: string,
    nc: string,
    nuevaBoleta: string,
    plazoMaximo: string,
    antes: string,
    despues: string,
    ean: string,
    motivo: string,
    situacionDelCambio: string,
    observacionTotal: string,
    numeroCelular: string,
    fechaCreacionBoleta: string
}

export async function POST(req: NextRequest) {

    const body: Respuesta = await req.json()
    // console.log(body, '🟢🟢')
    const antes = body.antes.split(' / ')
    const despues = body.despues.split(' / ')
    const ean = body.ean.split(' / ')


    let cambioAefectuar = ""
    for (let i = 0; i < antes.length; i++) {
        cambioAefectuar += `**${antes[i]}** \t ${despues[i]} \t ${ean[i]}\n`

    }

    // console.log(antes);
    // console.log(despues);

    const message = {
        content: `**${body.boleta}**\n` +
            `Fecha de solicitud:** ${body.fechaSolicitud}**\n` +
            `DNI:** ${body.dni}**\n` +
            `Fecha de creacion de boleta:** ${body.fechaCreacionBoleta}**\n` +
            `Encargada:** ${body.encargada}**\n` +
            `Cliente:** ${body.cliente}**\n` +
            `Celular:** ${body.numeroCelular}**\n` +
            `Nro de orden:** ${body.nroOrden}**\n` +
            `Lugar:** ${body.lugar}**\n` +
            `Boleta:** ${body.boleta}**\n` +
            `Plazo maximo:** ${body.plazoMaximo}**\n` +
            `Motivo:** ${body.motivo}**\n` +
            `Situacion del cambio:** ${body.situacionDelCambio}**\n` +
            `Enviado:** ${body.enviado}**\n` +
            `CAMBIO A EFECTUAR:**\n` + cambioAefectuar

        /*
        PARA UNA PROXIMA ACTUALIZACION donde:
        Se implementara un bot que cree el canal y envie la notificacion
        embeds: [{
            "fields": [
                {
                    "name": "Actual",
                    "value": antes.join('\n'),
                    "inline": true
                },
                {
                    "name": "Cambio/Sap",
                    "value": despues.join('\n'),
                    "inline": true
                },
                {
                    "name": "Cambio/ean",
                    "value": ean.join('\n'),
                    "inline": true
                },
            ]
        }]
        */
    };


    const webhookURL: string = process.env.CANAL_CREADOR_CAMBIO!
    // console.log(webhookURL)
    const send = await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    })

    onUpdateObservaciones(body.nroOrden, body.motivo, 'cambio', body.observacionTotal)
    /* 
    DISPONIBLE EN  UNA PROXIMA ACTUALIZACION
    Enviar archivo de texto con informacion del cambio

    const formData = new FormData()
    const texto = 'jeje'
    formData.append('file', new Blob([texto], { type: 'text/plain' }), 'cambio.txt')

    await fetch(webhookURL, {
        method: 'POST',
        body: formData

    }).then(res => {
        if (res.ok) {
            console.log('Archivo enviado  con exito')
        } else {
            console.log('Error al enviar archivo')
        }
    })
        .catch(err => {
            console.log('Error al enviar archivo')
        })

    console.log('NOTIFICACION ENVIADA')
    */
    return NextResponse.json('Notificacion Enviada a discord')

}