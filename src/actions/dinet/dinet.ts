"use server"

import { OrdenResponse } from "@/types/Orden"

import { EtiquetaDinet } from "@/types/Dinet"
import { getDinetDate, validateDinetCamp } from "@/helpers/Dinet"
import prisma from "@/lib/prisma"

export async function obtenerEtiqueta(boleta: string) {

    const data = await prisma.oSF_PEDIDOS.findFirst({
        where: {
            OSF_SERIE_DOCUMENTO: boleta
        }
    })


    if (!data) {
        console.log('Error de orden')
        return data
    }
    console.log('1. Paso primer filtro')
    console.log(data)
    const ordenResponse: OrdenResponse = await fetch(`${process.env.WIN_WIN_URL as string}?orderNumber=${data.SS_NUMERO_ORDEN}`, {
        headers: {
            'Authorization': process.env.SAMISHOP_API_TOKEN as string
        },
    }).then(data => data.json())

    console.log('2. Orden obtenida')
    const orden = ordenResponse.obj.ordenes[0]
    console.log(orden.cabecera_pedido[0])

    console.log('3. Etiqueta realizada')
    const etiqueta: EtiquetaDinet =
    {
        nro_pedido: data.OSF_SERIE_DOCUMENTO,
        nro_doc_referencia: data.OSF_SERIE_DOCUMENTO,
        fecha_pedido: getDinetDate().trim(),
        fecha_entrega: getDinetDate().trim(),
        cliente: validateDinetCamp(
            orden.datos_facturacion[0].nombres_facturacion,
        ).trim(),
        dni_cliente: orden.datos_envio[0].dni_envio,
        telef_cliente: orden.datos_envio[0].telefono_envio.trim(),
        mail_cliente: validateDinetCamp(
            orden.datos_facturacion[0].email_facturacion,
        ).trim(),
        dir_entrega: validateDinetCamp(orden.datos_envio[0].direccion_envio).trim(),
        nom_contacto: validateDinetCamp(orden.datos_envio[0].nombres_envio).trim(),
        dni_contacto: validateDinetCamp(orden.datos_envio[0].dni_envio).trim(),
        cant_bultos_totales: 1,
        departamento: validateDinetCamp(orden.datos_envio[0].departamento)
            .toLocaleLowerCase()
            .trim(),
        provincia: validateDinetCamp(orden.datos_envio[0].provincia)
            .toLocaleLowerCase()
            .trim(),
        distrito: validateDinetCamp(orden.datos_envio[0].distrito)
            .toLocaleLowerCase()
            .trim(),
        observaciones: "",
        etiqueta: "",
        cod_origen: "",
        fecha_estimada_recojo: getDinetDate().trim(),
        tipo_pago: "",
        valor_mercaderia: "",
        cod_clasificacion: "",
        referencias: "",
        nombre_marca: "",
        peso: "",
        volumen: "",
    }

    return etiqueta
}