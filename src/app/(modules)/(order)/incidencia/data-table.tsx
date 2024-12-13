'use client'

import React, { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { changStatusIncidence, detailOrder, getAllIncidence, getAllIncidenceByInvoice } from '@/actions/order/Incidencia'
import { formatDate } from '@/helpers/convertDate'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ConfirmCompleted } from './ui/confirm-completed'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { columns } from './columns'


interface OrderProps {
    incidentList: [];
}

export const DataTable = ({ incidentList }: OrderProps) => {
    const [dataIncidente, setDataIncidente] = useState(incidentList)
    const [sorting, setSorting] = useState<SortingState>([])
    const [expanded, setExpanded] = useState({});
    const [enabled, setEnabled] = useState(false);
    const [order, setOrder] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [valueSearch, setValueSearch] = useState("")
    const [incidenceId, setIncidenceId] = useState(0);


    console.log({ incidentList }, "LISTA INCIDENCIA")

    // Obtener el detalle de la orden
    const { data, refetch, isLoading, isPending } = useQuery({
        queryKey: ["OrderDetail", order],
        queryFn: async ({ queryKey }) => {
            const orden = queryKey[1];
            return await detailOrder(Number(orden))
        },
        enabled: enabled,
    })

    console.log({ data }, '🚩🚩🚩🚩')

    // se ejecutará cuando se hace click
    const getDetailOrden = (orden: number) => {
        setOrder(orden)
        console.log(order, "Consumir Action")
        setEnabled(true);
        refetch();
    }

    // AFunción para actulizar el estado de la orden a Completado
    const handleAccept = async () => {

        try {
            setLoading(true)
            await changStatusIncidence(incidenceId);

        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
            setIsOpen(false)
            refetch()
        }

    }


    const table = useReactTable({
        data: dataIncidente,
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


    // Función para buscar incidencia por el Invoice
    const handleSearch = async () => {
        const trimmedValue = valueSearch.trim();

        if (!trimmedValue) {
            // No hay búsqueda, obtener todas las incidencias
            try {
                setLoading(true);
                const response = await getAllIncidence();
                setDataIncidente(response);
            } catch (error: any) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (/^[BF].{4,}$/.test(trimmedValue)) {
            // Buscar por boleta válida
            try {
                setLoading(true);
                const response = await getAllIncidenceByInvoice(trimmedValue);
                setDataIncidente(response);
            } catch (error: any) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            // Formato inválido
            toast.warning("Ingresar una Boleta válida");
        }

    }


    // manejador de 
    const handleChange = (incidenceId: number) => {
        console.log(incidenceId, '---------Detail select')
        setIncidenceId(incidenceId)
        setIsOpen((prev) => !prev)

    }

    return (
        <div className="w-full">
            <div className='flex gap-2 py-4'>
                <Input placeholder='Buscar # Orden' onChange={e => setValueSearch(e.target.value)} value={valueSearch} />
                <Button onClick={handleSearch} disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</Button>
            </div>

            <div className="rounded-md border">
                {
                    loading
                        ? <Loader />
                        :
                        <Table className='w-full'>
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
                                            {isLoading && <Loader />}
                                            {row.getIsExpanded() && (

                                                <TableRow className=' bg-slate-50 '>
                                                    <TableCell className="p-0"></TableCell>
                                                    <TableCell colSpan={row.getVisibleCells().length - 1} className="p-4 ">
                                                        <Table className='bg-slate-50 border'>
                                                            <TableHeader className='bg-slate-400 '>
                                                                <TableRow className='text-white hover:bg-slate-400'>
                                                                    <TableHead className='text-white w-[350px]'>Prod. Original</TableHead>
                                                                    <TableHead className='text-white w-[350px]'>Prod. Cambiado</TableHead>
                                                                    <TableHead className='text-white w-[350px]'>Motivo</TableHead>
                                                                    <TableHead className='text-white'>Bol. / Fact. Incidencia</TableHead>
                                                                    {/* <TableHead className='text-white w-[100px]'>Total</TableHead> */}
                                                                    <TableHead className='text-white'>Fecha</TableHead>
                                                                    <TableHead className='text-white'>Estado</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody className='bg-slate-100 border'>
                                                                {data?.map((detail: any, index: number) => (
                                                                    <TableRow key={index} className='hover:bg-slate-200'>
                                                                        <TableCell className='w-[350px] '>
                                                                            <ul className='list-disc ml-2'>
                                                                                {/* LISTAR LOS PRODUCTOS ORIGINALES */}
                                                                                {detail.IncidenceLogs
                                                                                    .filter((incidence: any) => incidence.Description === 'ORIGIN' || incidence.Description === 'RETURN')
                                                                                    .map((incidence: any) => {
                                                                                        console.log({ incidence })
                                                                                        return (
                                                                                            <li key={incidence.IncidenceLogID}>
                                                                                                <span className='text-xs flex'>
                                                                                                    {incidence.CodProd} ({incidence.ProdQuantity || 1})
                                                                                                </span>
                                                                                            </li>
                                                                                        )
                                                                                    })}

                                                                            </ul>

                                                                        </TableCell>
                                                                        <TableCell className='text-center w-[350px]'>

                                                                            {/* LISTAR LOS PRODUCTOS A CAMBIAR */}
                                                                            <ul className='list-disc ml-2'>
                                                                                {detail.IncidenceLogs
                                                                                    .filter((incidence: any) => incidence.Description === 'CHANGE')
                                                                                    .map((incidence: any) => {
                                                                                        return (
                                                                                            <li key={incidence.IncidenceLogID}>
                                                                                                <span className='text-xs flex'>
                                                                                                    {incidence.CodProd} ({incidence.ProdQuantity || 1})
                                                                                                </span>
                                                                                            </li>
                                                                                        )
                                                                                    })}

                                                                            </ul>

                                                                        </TableCell>
                                                                        <TableCell className='text-xs text-center'>{detail.Description || "─"}</TableCell>
                                                                        <TableCell className='text-xs w-[200px]'>{detail.InvoiceIncidence}</TableCell>
                                                                        {/* <TableCell className='text-xs flex items-center justify-between w-[100px]'><span>S/</span> {JSON.stringify(detail.IncidenceLogs, null, 2)}</TableCell> */}
                                                                        <TableCell className='text-xs w-[250px]'>{formatDate(new Date(detail.CreatedAt).toISOString())}</TableCell>
                                                                        {
                                                                            detail.TypeIncidenceID == 3
                                                                                ? <TableCell className='flex gap-2 items-center'>
                                                                                    <Checkbox onCheckedChange={() => handleChange(Number(detail.IncidenceID))} checked={detail.IsCompleted} disabled={detail.IsCompleted} />Completado
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
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Ningún elemento encontrado
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                }
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

            {/* Modal para confirmar el Completed */}
            <ConfirmCompleted isOpen={isOpen} setIsOpen={setIsOpen} handleAccept={handleAccept} isLoading={loading} />
        </div >
    )
}
