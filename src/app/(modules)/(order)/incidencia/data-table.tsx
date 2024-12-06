'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    ColumnDef,
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { columns } from "./columns";
import { QueryKey, useQuery } from '@tanstack/react-query'
import { changStatusIncidence, detailOrder } from '@/actions/order/Incidencia'
import { formatDate } from '@/helpers/convertDate'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ConfirmCompleted } from './ui/confirm-completed'


interface OrderProps {
    incidentList: {}[];
}
export const DataTable = ({ incidentList }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [expanded, setExpanded] = useState({});
    const [enabled, setEnabled] = useState(false);
    const [order, setOrder] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [invoice, setInvoice] = useState("");


    console.log(incidentList)

    const { data, refetch, isLoading, isPending } = useQuery({
        queryKey: ["OrderDetail", order],
        queryFn: async ({ queryKey }) => {
            const orden = queryKey[1];
            return await detailOrder(Number(orden))
        },
        enabled: enabled,
    })


    // se ejecutará cuando se hace click
    const getDetailOrden = (orden: number) => {
        setOrder(orden)
        console.log(order, "Consumir Action")
        setEnabled(true);
        refetch();


    }


    console.log({ isPending, data }, '👀')



    const handleAccept = async () => {
        const invoice = ""

        try {
            setLoading(true)
            await changStatusIncidence(invoice);

        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
            setIsOpen(false)
            refetch()
        }

    }

    const table = useReactTable({
        data: incidentList,
        columns: columns(getDetailOrden),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        state: {
            sorting,
            expanded
        },
    })


    return (
        <div className="w-full">
            <div className='flex gap-2 py-4'>
                <Input placeholder='Buscar # Orden' />
                <Button>Buscar</Button>
            </div>

            <div className="rounded-md border">

                <Table>
                    <TableHeader className='bg-slate-500'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className='text-white'>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    {/* Fila principal */}
                                    <TableRow data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {/* Contenido expandido (FILA HIJO)*/}
                                    {row.getIsExpanded() && (
                                        <TableRow className=' bg-slate-50 '>
                                            <TableCell colSpan={row.getVisibleCells().length} className="">
                                                <Table className='bg-slate-50 border'>
                                                    <TableHeader className='bg-slate-400 '>
                                                        <TableRow className='text-white hover:bg-slate-400'>
                                                            <TableHead className='text-white'>Producto Original</TableHead>
                                                            <TableHead className='text-white'>Producto Cambiado</TableHead>
                                                            <TableHead className='text-white'>Motivo</TableHead>
                                                            <TableHead className='text-white'>Boleta de Incidencia</TableHead>
                                                            <TableHead className='text-white'>Cantidad</TableHead>
                                                            <TableHead className='text-white w-[100px]'>Total</TableHead>
                                                            <TableHead className='text-white'>Fecha</TableHead>
                                                            <TableHead className='text-white'>Estado</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className='bg-slate-100 border'>
                                                        {data?.map((detail: any, index: number) => (
                                                            <TableRow key={index} className='hover:bg-slate-200'>
                                                                <TableCell className='w-[200px]'>{detail.CodProd}</TableCell>
                                                                <TableCell className='text-center w-[200px]'>{detail.CodProdChange || "─"}</TableCell>
                                                                <TableCell className='text-center'>{detail.Reason || "─"}</TableCell>
                                                                <TableCell>B0L374-INCID.</TableCell>
                                                                <TableCell className='text-center'>{detail.Quantity}</TableCell>
                                                                <TableCell className='flex items-center justify-between w-[100px]'><span>S/</span> {detail.TotalRefund || "0.00"}</TableCell>
                                                                <TableCell className='text-xs w-[200px]'>{formatDate(new Date(detail.CreatedAt).toISOString())}</TableCell>
                                                                {
                                                                    detail.TypeIncidenceID == 3
                                                                        ? <TableCell className='flex gap-2 items-center'>
                                                                            <Checkbox onCheckedChange={() => setIsOpen((prev) => !prev)} checked={detail.IsCompleted} disabled={detail.IsCompleted} />Completado
                                                                        </TableCell>

                                                                        : <TableCell className='text-center'>─</TableCell>
                                                                }
                                                            </TableRow>
                                                        ))}

                                                    </TableBody>

                                                </Table>
                                            </TableCell>

                                        </TableRow>

                                    )}
                                </React.Fragment>

                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Ningún elemento agregado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} Fila(s) Seleccionado(s).
                </div> */}
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div>
            </div>

            <ConfirmCompleted isOpen={isOpen} setIsOpen={setIsOpen} handleAccept={handleAccept} isLoading={loading} />
        </div >
    )
}
