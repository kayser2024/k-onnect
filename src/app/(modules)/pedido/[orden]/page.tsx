import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { DetallePedido, OrdenResponse } from "@/types/Orden"
import { OSF_PEDIDOS } from "@prisma/client"
import { Eye, MapPin, MessageCircleDashedIcon } from "lucide-react"
import { Metadata } from "next"
import AccionCopiar from "@/components/Pedido/AccionCopiar"
import AccionesOrden from "./AccionesOrden"
import { DataTableProductos } from "./DataTableProductos"
import { columns } from "./Columnas";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import ActualizarEnvio from "./ActualizarEnvio"
import Observacion from "./Observacion"

import { redirect } from "next/navigation"
import { auth } from "@/auth.config"

export const metadata: Metadata = {
    title: 'Orden de compra',
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

    console.log('ORDEN : ', orden)

    const data: OrdenResponse = await fetch(`${process.env.WIN_WIN_URL}?orderNumber=${orden}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':process.env.SAMISHOP_API_TOKEN as string
        },
        cache: "no-store"
    }).then(res => res.json())



    return data
}

async function fetchingPaymentDocument(orden: string) {

    const data = await prisma.oSF_PEDIDOS.findFirst({
        where: {
            SS_NUMERO_ORDEN: orden
        }
    })

    return data
}

async function CardFacturacion(comprobante: OSF_PEDIDOS) {

    const fecha = comprobante.FECHA_REGISTRO!.toLocaleDateString()

    let [dia, mes, anio] = fecha.split('/')

    dia = Number(dia) < 10 ? `0${dia}` : dia
    mes = Number(mes) < 10 ? `0${mes}` : mes

    const fechaFormateada = `${dia}/${mes}/${anio}`
    const fechaFormateada2 = `${mes}/${dia}/${anio}`

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informacion de Facturacion</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col">
                <div className="flex gap-2">
                    <div >
                        <span className="text-xs text-gray-400">Comprobante</span>
                        <AccionCopiar className="font-bold" texto={comprobante.OSF_SERIE_DOCUMENTO} />
                    </div>
                </div>

                <div >
                    <span className="text-xs text-gray-400">Fecha</span>
                    <AccionCopiar texto={fechaFormateada} />
                </div>

                <div >
                    <span className="text-xs text-gray-400">Fecha</span>
                    <AccionCopiar texto={fechaFormateada2} />
                </div>
                <div >

                    <a className="font-bold flex gap-2 items-center my-2" target="_blank" href={`https://tutati.com/pe/outputs?uid_outputs=&eid_outputs=${comprobante.OSF_SERIE_DOCUMENTO}`}>
                        <Eye size={20} />
                        Ver en tutati
                    </a>
                </div>
                <a target="_blank" className="w-full bg-black text-white text-center p-2 rounded-lg" href={`${comprobante.BS_URL_PDF}`}>Ver Boleta</a>

            </CardContent>
        </Card>
    )
}

async function CardComentarios({ comentarios }: { comentarios: string }) {
    const data = JSON.parse(comentarios)

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
                                <p className="text-gray-400 text-right">{comentario.fecha}</p>
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

function formatedDetallePedido(detalle_pedido: DetallePedido[]) {

    const data: ProductoTable[] = detalle_pedido.map(producto => ({
        id: producto.sku,
        foto: producto.url_imagen_sku,
        descripcion: `${producto.categoria},${producto.title},${producto.sku},${producto.atributo1_titulo},${producto.atributo1_valor},${producto.atributo2_titulo},${producto.atributo2_valor}`,
        cantidad: producto.quantity_sku,
        precio: producto.sale_price,
        subTotal: producto.sale_price * producto.quantity_sku
    }));

    const dataReal: ProductoTable[] = []

    for (let i = 0; i < detalle_pedido.length; i++) {
        for (let j = 0; j < detalle_pedido[i].quantity_sku; j++) {
            dataReal.push({
                id: detalle_pedido[i].sku,
                foto: detalle_pedido[i].url_imagen_sku,
                descripcion: `${detalle_pedido[i].categoria},${detalle_pedido[i].title},${detalle_pedido[i].sku},${detalle_pedido[i].atributo1_titulo},${detalle_pedido[i].atributo1_valor},${detalle_pedido[i].atributo2_titulo},${detalle_pedido[i].atributo2_valor}`,
                cantidad: 1,
                precio: detalle_pedido[i].sale_price,
                subTotal: detalle_pedido[i].sale_price
            })
        }
    }

    return dataReal
};

async function HomeOrden({ params }: Props) {

    const { orden } = params

    const user = await auth()

    if (!user) redirect('/api/auth/signin')


    const data = await fetchingDataFromOrder(orden)
    console.log(data);

    if (data.obj === null) {
        return <div>No se encontro la orden</div>
    }

    const ordenes = data.obj?.ordenes[0]



    const cupon = '';
    const cabecera_pedido = ordenes?.cabecera_pedido[0]
    const { detalle_pedido } = ordenes
    const datos_facturacion = ordenes.datos_facturacion[0]
    const resumen_pedido = ordenes.resumen_pedido[0]
    const datos_envio = ordenes.datos_envio[0]
    const situacion_pagos = ordenes.situacion_pagos[0]
    const situacion_envio = ordenes.situacion_envio[0]
    const situacion_facturacion = ordenes.situacion_facturacion[0]

    const comprobante: OSF_PEDIDOS | null = await fetchingPaymentDocument(orden)
    let direccionMaps = `https://www.google.com.pe/maps/search/${datos_envio.servicio_envio !== "programado" ? 'KAYSER' : ''} ${datos_envio.direccion_envio}+${datos_envio.distrito}+${datos_envio.provincia}+${datos_envio.departamento}+peru`
    const productos = formatedDetallePedido(detalle_pedido)

    let colorEnvio = ''
    if (situacion_envio.estado_envio === "pendiente")
        colorEnvio = "bg-yellow-300"
    else if (situacion_envio.estado_envio === 'en_preparacion')
        colorEnvio = "bg-gray-300"
    else if (situacion_envio.estado_envio === 'enviado')
        colorEnvio = "bg-blue-300"
    else if (situacion_envio.estado_envio === 'recibido')
        colorEnvio = "bg-green-300"

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
                <h2 className="font-light text-sm">Fecha: {cabecera_pedido?.fecha_pedido.toString()}</h2>
            </section>

            <section className="flex flex-col lg:grid grid-cols-[70%_30%] gap-2">

                <div className="flex flex-col gap-2">
                    <Card className="cols">
                        <CardHeader>
                            <div className="flex justify-between">
                                <CardTitle>Detalle de Productos</CardTitle>
                                <AccionesOrden orden={data} docActual={`${comprobante ? comprobante.OSF_SERIE_DOCUMENTO : cabecera_pedido?.numero_orden}`} />
                            </div>
                            <span className={`rounded-2xl p-2 w-max text-xs ${cupon ? 'bg-green-300' : 'bg-orange-300'} text-white font-bold  transition-all`}>{cupon ? cupon : "Sin Cupon"}</span>
                            <CardDescription>Detalles de la orden</CardDescription>

                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="tablaNormal">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="tablaNormal">Tabla</TabsTrigger>
                                    <TabsTrigger value="tablaCambio">Tabla Actualizable</TabsTrigger>
                                </TabsList>
                                <TabsContent value="tablaNormal">
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <Table>
                                            <TableCaption>Tabla de Productos</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Foto</TableHead>
                                                    <TableHead>Descripcion</TableHead>
                                                    <TableHead>Cantidad</TableHead>
                                                    <TableHead>Precio</TableHead>
                                                    <TableHead>Subtotal</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {detalle_pedido.map((producto, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <img src={`${producto.url_imagen_sku}`} className="max-h-28 rounded-lg" alt="" />
                                                        </TableCell>
                                                        <TableCell className="flex flex-col">
                                                            <h3 className="text-sm  text-gray-400">{producto.categoria}</h3>
                                                            <h2 className="text-lg">{producto.title}</h2>
                                                            <AccionCopiar className="text-sm text-gray-400" texto={producto.sku} />
                                                            <p className="text-sm text-gray-400">{producto.atributo1_titulo}: {producto.atributo1_valor}</p>
                                                            <p className="text-sm text-gray-400">{producto.atributo2_titulo}: {producto.atributo2_valor}</p>
                                                            <a className="bg-gray-300 p-1 w-max rounded-md text-black my-3 font-bold" target="_blank" href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${producto.sku}&tab=detail&page=1&row_count=100`}>Ver en tutati</a>
                                                        </TableCell>
                                                        <TableCell>{producto.quantity_sku}</TableCell>
                                                        <TableCell>
                                                            <p className="line-through text-gray-400">S/.{producto.price.toFixed(2)}</p>
                                                            <p>S/.{producto.sale_price.toFixed(2)}</p>
                                                        </TableCell>
                                                        <TableCell>S/.{producto.subtotal_sku.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                                <TabsContent value="tablaCambio">
                                    <DataTableProductos persona={user.user?.name} comprobante={comprobante} columns={columns} data={productos} orden={ordenes} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card >
                        <CardHeader>
                            <CardTitle>Resumen de Pedido</CardTitle>
                            <CardDescription className={`${colorEstado} p-2 w-max rounded-2xl text-white font-bold`}> {situacion_pagos.estado_pago} </CardDescription>

                        </CardHeader>
                        <CardContent>

                            <div >
                                <span className="text-xs text-gray-400">Metodo de Pago</span>
                                <p>{situacion_pagos.metodo_pago}</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-bold">
                                    <span >Subtotal</span>
                                    <span>S/. {resumen_pedido.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Envio</span>
                                    <span>S/. {resumen_pedido.costo_envio}</span>
                                </div>


                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Descuento Catalogo</span>
                                    <span>- S/. {resumen_pedido.disccount_catalog?.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Descuento Cupon</span>
                                    <span></span>
                                    <span>{cupon ? `- S/. ${resumen_pedido.disccount_coupon?.toFixed(2)}` : '- S/. 0.00'}</span>
                                </div>

                                <div className="flex justify-between font-bold">
                                    <span>Descuento Total</span>
                                    <span className="text-red-400">- S/. {resumen_pedido.disccount?.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span >Total</span>
                                    <span >S/. {resumen_pedido.gran_total?.toFixed(2)}</span>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <a className=" w-1/2 m-2 bg-[#009ee3] text-center p-2 rounded-lg text-white font-bold c" target="_blank" href={`https://www.mercadopago.com.pe/activities/1?q=${cabecera_pedido?.numero_orden}`}>Ver en MP</a>
                            <Observacion observaciones={situacion_facturacion.link_doc1} orden={cabecera_pedido?.numero_orden} />
                        </CardFooter>
                    </Card>

                    <Suspense key={cabecera_pedido?.numero_orden} fallback={<div>Cargando </div>}>
                        {situacion_facturacion.link_doc1 && <CardComentarios comentarios={situacion_facturacion.link_doc1} />}
                    </Suspense>
                </div>
                {/* SECCION */}
                <div className="flex flex-col  gap-2">

                    <Suspense fallback={<div>Cargando </div>}>
                        {comprobante ? <CardFacturacion {...comprobante} /> : <EmptyCardFacturacion />}
                    </Suspense>

                    <Card>
                        <CardHeader>
                            <CardTitle>Seguimiento de Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <ActualizarEnvio classsname={colorEnvio} orden={cabecera_pedido?.numero_orden} estado_envio={situacion_envio.estado_envio} />

                            <div className="flex gap-2">
                                <div >
                                    <span className="text-xs text-gray-400">En preparacion</span>
                                    <p className="text-ellipsis">{situacion_envio.preparacion}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div >
                                    <span className="text-xs text-gray-400">Enviado</span>
                                    <p className="text-ellipsis">{situacion_envio.enviado}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div >
                                    <span className="text-xs text-gray-400">Recibido</span>
                                    <p className="text-ellipsis">{situacion_envio.recibido}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informacion de Envio</CardTitle>
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