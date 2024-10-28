import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Orden, OrdenResponse } from "@/types/Orden";
import Link from "next/link";
import { Suspense } from "react";


interface Params {
    search: string,
    currentPage: number
    type: string
}

async function fetchingData(currentPage: number, search: string, type: string) {

    console.log('Feching info desde server...');
    const data: OrdenResponse = await fetch(`${process.env.WIN_WIN_URL}?${type}=${search}&page=${currentPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SAMISHOP_API_TOKEN as string
        },
        cache: "no-cache"
    }).then(res => res.json())

    console.log(process.env.SAMISHOP_API_TOKEN)
    console.log(process.env.SAMISHOP_API_TOKEN?.length)
    console.log('Fetching terminado');
    console.log(data)

    return data
}

async function TablePedidos({ currentPage, search, type }: Params) {

    const data: OrdenResponse = await fetchingData(currentPage, search, type)
    const ordenes = data.obj?.ordenes

    if (!ordenes) {
        return <div>Contenido no encontrado</div>
    }


    return (
        <>
            <div className="text-center">
                <span className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 bg-gray-300">
                    {data.obj["paginas totales"]}
                </span>
            </div>
            <Table >
                <TableCaption>Lista de Ordenes del dia</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Orden</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Dni</TableHead>
                        <TableHead>Telefono</TableHead>
                        <TableHead>Fecha Pago</TableHead>
                        <TableHead className="text-center">Cupon</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Tipo Envio</TableHead>
                        <TableHead>Estado Pago</TableHead>
                        <TableHead>Envío</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        ordenes.map((orden: Orden) => {

                            let colorPago = ''
                            const fechaPago = orden.cabecera_pedido[0].fecha_pedido.toString().split('T')
                            if (orden.situacion_pagos[0].estado_pago === 'pendiente') {
                                colorPago = 'bg-yellow-400'
                            } else if (orden.situacion_pagos[0].estado_pago === 'pagado') {
                                colorPago = 'bg-green-300'
                            } else if (orden.situacion_pagos[0].estado_pago === 'cancelado') {
                                colorPago = 'bg-red-300'
                            } else {
                                colorPago = 'bg-gray-300'
                            }
                            let colorEnvio = ''
                            if (orden.situacion_envio[0].estado_envio === "pendiente")
                                colorEnvio = "bg-yellow-300"
                            else if (orden.situacion_envio[0].estado_envio === 'en_preparacion')
                                colorEnvio = "bg-gray-300"
                            else if (orden.situacion_envio[0].estado_envio === 'enviado')
                                colorEnvio = "bg-blue-300"
                            else if (orden.situacion_envio[0].estado_envio === 'recibido')
                                colorEnvio = "bg-green-300"

                            return (
                                <TableRow className=" text-xs" key={orden.cabecera_pedido[0].numero_orden}>
                                    <TableCell className="text-blue-700 font-bold">
                                        <Link href={`/pedido/${orden.cabecera_pedido[0].numero_orden}`}>
                                            {orden.cabecera_pedido[0].numero_orden}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="lowercase">{orden.datos_facturacion[0].nombres_facturacion}</TableCell>
                                    <TableCell>
                                        <Link href={`/cliente?dni=${orden.datos_facturacion[0].id_cliente}`}>
                                            {orden.datos_facturacion[0].id_cliente}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{orden.datos_facturacion[0].telefono_facturacion}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p>{fechaPago[0]}</p>
                                            <p>{fechaPago[1]}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{orden.cupon ? orden.cupon : '-----'}</TableCell>
                                    <TableCell>S/.{orden.resumen_pedido[0].gran_total.toFixed(2)}</TableCell>
                                    <TableCell>{orden.datos_envio[0].servicio_envio}</TableCell>
                                    <TableCell>
                                        <p className={`text-white text-center ${colorPago} p-2  rounded-lg`}>
                                            {orden.situacion_pagos[0].estado_pago}
                                        </p>
                                    </TableCell>
                                    <TableCell >
                                        <p className={`${colorEnvio} text-center text-black p-2 rounded-lg`}>
                                            {orden.situacion_envio[0].estado_envio}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        )}
                </TableBody>
            </Table >
        </>
    )
}

export default TablePedidos