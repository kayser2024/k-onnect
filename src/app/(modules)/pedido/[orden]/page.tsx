import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DetallePedido, OrdenResponse } from "@/types/Orden"
import { ExternalLink, Eye, MapPin, MessageCircleDashedIcon } from "lucide-react"
import { Metadata } from "next"
import AccionCopiar from "@/components/Pedido/AccionCopiar"
import AccionesOrden from "./AccionesOrden"
import { DataTableProductos } from "./DataTableProductos"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import ActualizarEnvio from "./ActualizarEnvio"
import Observacion from "./Observacion"

import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { format, setDefaultOptions } from "date-fns"
import { es } from 'date-fns/locale'
import { TimeLine } from "./TimeLine"
import { TimeLineHorizontal } from "./TimeLineHorizontal"
import { Collapisble } from "./ui/Collapisble"
import { ModalEditEnvio } from "./ui/modal-edit-envio"

setDefaultOptions({ locale: es })


export const metadata: Metadata = {
    title: 'Detalle Orden',
    icons: '/kayser.ico'
}

interface ProductoTable {
    id: string,
    foto: string,
    descripcion: string,
    cantidad: number,
    precio: number,
    subTotal: number
}

interface Props {
    params: {
        orden: string
    }
}

async function fetchingDataFromOrder(orden: string) {
    let result
    const URL = `${process.env.WIN_WIN_URL}?orderNumber=${orden}` as string
    const OPTIONS: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SAMISHOP_API_TOKEN as string
        },
        cache: "no-store"
    }

    try {
        const response = await fetch(URL, OPTIONS)
        result = await response.json();
    } catch (error: any) {
        result = error.message
    }

    return result
}

async function CardFacturacion({ situacion_facturacion }: { situacion_facturacion: any }) {
    const fecha = situacion_facturacion?.fecha_envio_facturacion;
    const estado_facturacion = situacion_facturacion?.estado_facturacion;
    const link_doc1 = situacion_facturacion?.link_doc1;
    const link_doc2 = situacion_facturacion?.link_doc2;

    // Validar que fecha tenga un valor antes de dividirla en partes
    let fechaFormateada = "";

    if (fecha) {
        const [anio, mes, dia] = fecha.split("T")[0].split("-");
        fechaFormateada = `${dia}/${mes}/${anio}`; // Formato "dd/mm/yyyy"
    } else {
        console.log("La fecha no está definida.");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informacion de Facturacion</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col">
                <div className="flex gap-2">
                    <div >
                        <span className="text-xs text-gray-400">Comprobante</span>
                        <AccionCopiar className="font-bold" texto={estado_facturacion} />
                    </div>
                </div>

                <div >
                    <span className="text-xs text-gray-400">Fecha</span>
                    <AccionCopiar texto={fechaFormateada} />
                </div>

                <div >
                    <a className="font-bold flex gap-2 items-center my-2" target="_blank" href={`https://tutati.com/pe/outputs?uid_outputs=&eid_outputs=${estado_facturacion}`}><Eye size={20} />Ver en tutati</a>
                </div>

                <a target="_blank" className={`w-full text-center p-2 rounded-lg ${link_doc1 ? "bg-black text-white" : "bg-gray-300 text-gray-500 pointer-events-none"}`} href={link_doc1 || undefined}>Ver Boleta</a>

            </CardContent>
        </Card>
    )
}

async function CardComentarios({ comentarios }: { comentarios: string }) {
    let data;

    try {
        data = JSON.parse(comentarios);
        if (!Array.isArray(data)) throw new Error('El JSON no es un array');
    } catch (error) {
        console.error('Formato JSON inválido:', error);
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-red flex flex-col gap-2">
                    {
                        data.map((comentario: any, index: number) => (
                            <div key={comentario.fecha + index} className="bg-gray-50 rounded-lg p-2 text-sm">
                                <span className="text-gray-400">{comentario.usuario}</span>
                                <p className="font-bold">{comentario.tipo}</p>
                                <p>
                                    {comentario.comentario}
                                </p>
                                <p className="text-gray-400 text-right">{format(comentario.fecha, 'eee dd/MM/yy hh:mm a')}</p>
                            </div>
                        ))
                    }

                </div>
            </CardContent>
        </Card>
    )


}

async function EmptyCardFacturacion() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informacion de Facturacion</CardTitle>

            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <p>Aun no disponible</p>
            </CardContent>
        </Card>
    )

}


async function HomeOrden({ params }: Props) {

    const { orden } = params

    const user = await auth()

    if (!user) redirect('/api/auth/signin')


    const data = await fetchingDataFromOrder(orden)

    if (!data) {
        return <>Something Error</>
    }

    if (data.obj === null) { return <div>No se encontro la orden</div> }
    const ordenes = data?.obj?.ordenes[0];

    const cupon = ordenes?.cupon;
    const cabecera_pedido = ordenes?.cabecera_pedido[0]
    // const { detalle_pedido } = ordenes
    // const datos_facturacion = ordenes.datos_facturacion[0]
    const resumen_pedido = ordenes.resumen_pedido[0]
    const datos_envio = ordenes.datos_envio[0]
    const situacion_pagos = ordenes.situacion_pagos[0]
    const situacion_envio = ordenes.situacion_envio[0]
    const situacion_facturacion = ordenes.situacion_facturacion[0]
    const created_at = ordenes.created_at



    let direccionMaps = `https://www.google.com.pe/maps/search/${datos_envio.servicio_envio !== "programado" ? 'KAYSER' : ''} ${datos_envio.direccion_envio}+${datos_envio.distrito}+${datos_envio.provincia}+${datos_envio.departamento}+peru`
    // const productos = formatedDetallePedido(detalle_pedido)


    let colorEstado = ''
    if (situacion_pagos.estado_pago === 'pagado') colorEstado = "bg-green-300"
    else if (situacion_pagos.estado_pago === 'cancelado') colorEstado = "bg-red-300"
    else if (situacion_pagos.estado_pago === 'pendiente') colorEstado = "bg-orange-300"


    return (
        <main className="p-2" >
            <section>
                <div className="flex flex-col sm:flex-row  sm:justify-between">
                    <div className="flex flex-wrap sm:flex-row  gap-5">
                        <h1 className="font-bold text-xl">Orden ID: {cabecera_pedido?.numero_orden}</h1>
                    </div>
                    <div className="w-full flex justify-around sm:w-auto sm:justify-normal gap-5">
                        <Badge >Estado: {cabecera_pedido?.estado_pedido}</Badge>
                    </div>
                </div>
                <span>{new Date(ordenes.created_at).toLocaleString()}</span>
            </section>

            <section className="flex flex-col lg:grid grid-cols-[70%_30%] gap-2">
                {/* COLUMN 1 */}
                <div className="flex flex-col gap-2">

                    {/* Detalle de Productos */}
                    <Card className="cols">
                        <CardHeader>
                            <div className="flex justify-between">
                                <CardTitle>Detalle de Productos</CardTitle>
                                <AccionesOrden orden={data} docActual={`${situacion_facturacion ? situacion_facturacion.estado_facturacion : cabecera_pedido?.numero_orden}`} />
                            </div>
                            <span className={`rounded-2xl p-2 w-max text-xs ${cupon ? 'bg-green-300' : 'bg-orange-300'} text-white font-bold  transition-all`}>{cupon ? cupon : "Sin Cupon"}</span>
                            <CardDescription>Detalles de la orden</CardDescription>

                        </CardHeader>
                        <CardContent>
                            <DataTableProductos persona={user.user?.Name} comprobante={situacion_facturacion} data={data.obj.ordenes[0]} orden={ordenes} />
                        </CardContent>
                    </Card>

                    {/* Resumen Pedido */}
                    <Card >
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <p>Resumen de Pedido</p>
                                    <span className={`${colorEstado} p-1 px-2 uppercase rounded-2xl text-sm text-white font-normal`}>
                                        {situacion_pagos.estado_pago}
                                    </span>
                                </div>
                                <Observacion observaciones={situacion_facturacion.link_doc2} orden={cabecera_pedido?.numero_orden} />
                            </CardTitle>

                        </CardHeader>
                        <CardContent>

                            <div className="mb-4 ">
                                <span className="text-sm text-gray-400">Metodo de Pago</span>
                                <br />
                                <a className="inline-flex gap-2 items-center text-[#099aea]" target="_blank" href={`https://www.mercadopago.com.pe/activities/1?q=${cabecera_pedido?.numero_orden}`} title="Ir a Mercado Pago">
                                    <ExternalLink size={15} /> {situacion_pagos.metodo_pago}
                                </a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-bold">
                                    <span >Subtotal</span>
                                    <span>S/ {resumen_pedido.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Envio</span>
                                    <span>S/ {resumen_pedido.costo_envio}</span>
                                </div>


                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Desc. Catalogo</span>
                                    <span>- S/ {resumen_pedido.disccount_catalog?.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Desc. Cupon</span>
                                    <span></span>
                                    <span>{cupon ? `- S/ ${resumen_pedido.disccount_coupon?.toFixed(2)}` : '- S/ 0.00'}</span>
                                </div>

                                <div className="flex justify-between font-bold">
                                    <span>Desc. Total</span>
                                    <span className="text-red-400">- S/ {resumen_pedido.disccount?.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span className="text-xl" >Total</span>
                                    <span className="text-xl" >S/ {resumen_pedido.gran_total?.toFixed(2)}</span>
                                </div>
                            </div>

                        </CardContent>

                    </Card>

                    {/* HISTORIAL */}
                    <Collapisble orden={orden} created_at={created_at} />


                    {/* Observaciones */}
                    <Suspense key={cabecera_pedido?.numero_orden} fallback={<div>Cargando ... </div>}>
                        {situacion_facturacion.link_doc2 && <CardComentarios comentarios={situacion_facturacion.link_doc2} />}
                    </Suspense>
                </div>

                {/* COLUMN 2*/}
                <div className="flex flex-col  gap-2">

                    <Suspense fallback={<div>Cargando ... </div>}>
                        {(situacion_facturacion.estado_facturacion !== 'pendiente') ? <CardFacturacion situacion_facturacion={situacion_facturacion} /> : <EmptyCardFacturacion />}
                    </Suspense>

                    {/* SEGUIMIENTO PEDIDO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Seguimiento de Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TimeLineHorizontal situacion_envio={situacion_envio} situacion_pagos={situacion_pagos} pendiente={created_at} />
                        </CardContent>
                    </Card>


                    {/* INFORMACIÓN ENVIO */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Informacion de Envio </CardTitle>
                                <ModalEditEnvio datos_envio={datos_envio} orden={cabecera_pedido?.numero_orden} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div >
                                <span className="text-xs text-gray-400">Nombre</span>
                                <p>{datos_envio.nombres_envio}</p>
                            </div>
                            <div >
                                <span className="text-xs text-gray-400">Correo</span>
                                <p>{cabecera_pedido?.email_pedido}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Dni</span>
                                <AccionCopiar texto={datos_envio.dni_envio} />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Direccion Envio</span>
                                <p> {datos_envio.direccion_envio}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Distrito, provincia, departamento</span>
                                <p> {datos_envio.distrito}, {datos_envio.provincia}, {datos_envio.departamento}.</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Modalidad de Entrega</span>
                                <p> {datos_envio.servicio_envio}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Telefono</span>
                                <div className="flex gap-2 items-center">
                                    <a href={`https://wa.me/51${datos_envio.telefono_envio}?text=Te Saludo Janella de Kayser Peru`} target="_blank">
                                        <MessageCircleDashedIcon size={20} />
                                    </a>
                                    <p> {datos_envio.telefono_envio} </p>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Ubigeo</span>
                                <p> {datos_envio.ubigeo}</p>
                            </div>
                            <a className="flex my-2 text-blue-600 items-center gap-2" target="_blank" href={direccionMaps}>
                                <MapPin size={15} />
                                Ver en Maps
                            </a>
                        </CardContent>
                    </Card>


                </div>

            </section>

        </main >
    )
}

export default HomeOrden