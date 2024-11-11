import { onUpdateObservaciones } from "@/actions/observaciones/updateObservacion";
import { NextRequest, NextResponse } from "next/server";

//IDCANAL = 1260938988865454080

interface Respuesta {
    fechaSolicitud: string,
    dni: string,
    cliente: string,
    formaDevolucion: string,
    operacion: string,
    tipoExtorno: string,
    fechaVenta: string,
    boleta: string,
    montoPago: number,
    nc: string,
    montoExtorno: number,
    plazoMaximo: string,
    ordenCompra: string,
    correoCliente: string,
    encargado: string,
    observacion: any,
    notaAdicional: string,
    observacionTotal: string,
    numeroCelular: string
    fechaCreacionBoleta: string
}
export async function POST(req: NextRequest) {

    const body: Respuesta = await req.json()
    const message = {
        content: `**${body.boleta}**\n` +
            `Fecha de solicitud: ${body.fechaSolicitud}\n` +
            `DNI: ${body.dni}\n` +
            `Fecha de Creacion de boleta: ${body.fechaCreacionBoleta}\n` +
            `Cliente: ${body.cliente}\n` +
            `Celular: ${body.numeroCelular}\n` +
            `Tipo de Extorno: **${body.tipoExtorno}**\n` +
            `Fecha de venta: ${body.fechaVenta}\n` +
            `Boleta: ${body.boleta}\n` +
            `Monto de extorno: ${body.montoExtorno}\n` +
            `Orden de compra: ${body.ordenCompra}\n` +
            `Encargado: ${body.encargado}\n` +
            `Observación: ${body.observacion}\n`,

    };
    console.log(message,'🚩')

    const webhookURL: string = process.env.CANAl_CREADOR_DEVOLUCION!
    const send = await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    })
    // await onUpdateObservaciones(body.ordenCompra, body.observacion, 'devolucion', body.observacionTotal)
    return NextResponse.json('Devolucion realizada correctamente')

}

