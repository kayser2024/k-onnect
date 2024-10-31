import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { BoletaResponse, Orden, OrdenResponse } from '@/types/Orden'

interface Params {
    search: string,
    currentPage: number
    type: string
}

async function fetchingData(currentPage: number, search: string, type: string) {

    console.log('type', type, search)

    if (type == 'estado_facturacion') {
        const data:OrdenResponse = await fetch(`${process.env.WIN_WIN_URL}?${type}=${search}&page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SAMISHOP_API_TOKEN as string
            },
            cache: "no-cache"
        }).then(res => res.json())

    return data

    } else {

        console.log('Buscando ordenes')

        const data:OrdenResponse = await fetch(`${process.env.WIN_WIN_URL}?${type}=${search}&page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SAMISHOP_API_TOKEN as string
            },
            cache: "no-cache"
        }).then(res => res.json())

    return data
    }
}

async function TableComprobantes({ currentPage, search, type }: Params) {

    const data:OrdenResponse = await fetchingData(currentPage, search, type)
    const ordenes=data.obj?.ordenes?.filter(
        orden => orden.situacion_facturacion[0].estado_facturacion !== 'pendiente'
    );
    
    if (!ordenes) {
        return <div>Contenido no encontrado</div>
    }

    return (

        <>
            <Table >
                <TableCaption>Lista de Boletas del dia</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[350px] text-center">Fecha</TableHead>
                        <TableHead className="w-[350px] text-center">Boleta</TableHead>
                        <TableHead className="w-[350px] text-center">Orden</TableHead>
                        <TableHead className="w-[350px] text-center">PDF</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        ordenes.map((orden:Orden ) => {


                            const fecha = orden.situacion_facturacion[0].fecha_envio_facturacion;
                        
                            // Validar que fecha tenga un valor antes de dividirla en partes
                            let fechaFormateada = "";
                        
                            if (fecha) {
                                const [anio, mes, dia] = fecha.split("T")[0].split("-");
                                fechaFormateada = `${dia}/${mes}/${anio}`; // Formato "dd/mm/yyyy"
                            } else {
                                console.log("La fecha no está definida.");
                            }
                            

                            return (
                                <TableRow className=" text-xs" key={orden.cabecera_pedido[0].numero_orden}>
                                     {/* <tr key={i}>{JSON.stringify(boleta,null,2)}</tr> */}

                                    <TableCell className="lowercase text-center">{fechaFormateada}</TableCell>
                                     <TableCell className='text-center'>{orden.situacion_facturacion[0].estado_facturacion}</TableCell>
                                     <TableCell className="text-blue-700 font-bold text-center">
                                         <Link href={`/pedido/${orden.cabecera_pedido[0].numero_orden}`}>{orden.cabecera_pedido[0].numero_orden}</Link>
                                     </TableCell>
                                     <TableCell className='flex justify-center'>
                                         <a target='_blank' 
                                         className={`w-full  flex flex-col  items-center  justify-center text-center p-2 rounded-lg ${
                                            orden.situacion_facturacion[0].link_doc1 as string ? "bg-black text-white" : "bg-gray-300 text-gray-500 pointer-events-none"
                                          }`}
                                        //  className='flex items-center gap-2 bg-black p-2 text-white rounded-lg' 
                                         href={orden.situacion_facturacion[0].link_doc1 as string || undefined}>
                                             <FileText />
                                             Ver Boleta
                                         </a>
                                     </TableCell>
                                </TableRow>
                            )
                        }
                        )}
                </TableBody>
            </Table >
        </>)
}

export default TableComprobantes