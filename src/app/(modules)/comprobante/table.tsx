import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { FileText } from 'lucide-react'

interface Params {
    search: string,
    currentPage: number
    type: string
}

async function fetchingData(currentPage: number, search: string, type: string) {

    console.log('type', type, search)

    if (type == 'OSF_SERIE_DOCUMENTO') {
        console.log('Buscando boletas')
        const dbData = await prisma.oSF_PEDIDOS.findMany({
            take: 25,
            orderBy: {
                FECHA_REGISTRO: 'desc'
            },
            where: search ? {
                OSF_SERIE_DOCUMENTO: {
                    contains: search
                }
            } : {}
        })
        return dbData
    } else {

        console.log('Buscando ordenes')
        const dbData = await prisma.oSF_PEDIDOS.findMany({

            take: 25,
            orderBy: {
                FECHA_REGISTRO: 'desc'
            },
            where: search ? {
                SS_NUMERO_ORDEN: {
                    contains: search
                }
            } : {}
        })
        return dbData
    }
}

async function TableComprobantes({ currentPage, search, type }: Params) {

    const boletas = await fetchingData(currentPage, search, type)

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
                        boletas.map(boleta => {

                            const fecha = boleta.FECHA_REGISTRO!.toLocaleDateString()
                            let [dia, mes, anio] = fecha.split('/')

                            dia = Number(dia) < 10 ? `0${dia}` : dia
                            mes = Number(mes) < 10 ? `0${mes}` : mes

                            const fechaFormateada = `${dia}/${mes}/${anio}`
                            return (
                                <TableRow className=" text-xs" key={boleta.OSF_SERIE_DOCUMENTO}>
                                    <TableCell className="lowercase text-center">{fechaFormateada}</TableCell>
                                    <TableCell className='text-center'>{boleta.OSF_SERIE_DOCUMENTO}</TableCell>
                                    <TableCell className="text-blue-700 font-bold text-center">
                                        <Link href={`/pedido/${boleta.SS_NUMERO_ORDEN}`}>{boleta.SS_NUMERO_ORDEN}</Link>
                                    </TableCell>
                                    <TableCell className='flex justify-center'>
                                        <a target='_blank' className='flex items-center gap-2 bg-black p-2 text-white rounded-lg' href={boleta.BS_URL_PDF as string}>
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