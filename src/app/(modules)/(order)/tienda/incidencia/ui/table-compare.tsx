import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from '@/components/ui/separator'


interface IncidentProduct {
    CodProd: string,
    CodEan: string,
    ProdQuantity: number,
}



interface TableCompareProps {
    productsIncidence: { IncidenceLogs: IncidentProduct[] },
    products: IncidentProduct[]
    type: string
}
export const TableCompare = ({ productsIncidence, products, type }: TableCompareProps) => {


    return (
        <div className="flex flex-row gap-2">

            <Table className='min-h-64'>
                <TableCaption>Lista de Productos Originales.</TableCaption>
                <TableHeader>
                    <TableRow className='bg-slate-500 hover:bg-slate-600'>
                        <TableHead className='text-white uppercase'>Cod. Sap</TableHead>
                        <TableHead className='text-white uppercase'>Cod. Ean</TableHead>
                        <TableHead className="text-white text-right uppercase">Cant.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productsIncidence?.IncidenceLogs?.filter((p: any) => p.Description === type).map((p: IncidentProduct) =>
                        <TableRow key={p.CodEan} className='bg-slate-100'>
                            <TableCell className='text-xs'>{p.CodProd}</TableCell>
                            <TableCell className='text-xs'>{p.CodEan}</TableCell>
                            <TableCell className="text-xs text-right">{p.ProdQuantity}</TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>

            <Separator orientation='vertical' />


            <Table className='min-h-64'>
                <TableCaption>Lista de Productos Ingresados.</TableCaption>
                <TableHeader>
                    <TableRow className='bg-slate-500 text-white hover:bg-slate-600'>
                        <TableHead className='text-white uppercase'>Cod. Sap</TableHead>
                        <TableHead className='text-white uppercase'>Cod. Ean</TableHead>
                        <TableHead className="text-white text-right uppercase">Cant.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        products.map((p: IncidentProduct) =>
                            <TableRow key={p.CodEan} className=''>
                                <TableCell className='text-xs'>{p.CodProd}</TableCell>
                                <TableCell className='text-xs'>{p.CodEan}</TableCell>
                                <TableCell className="text-right">{p.ProdQuantity}</TableCell>
                            </TableRow>
                        )
                    }

                </TableBody>

            </Table>
        </div>
    )
}
