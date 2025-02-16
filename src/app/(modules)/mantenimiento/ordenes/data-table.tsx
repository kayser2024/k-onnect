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
    ColumnDef,
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { columns } from "./columns";
import { Order } from '@/types/OrderDb'
import { AlertConfirm } from './ui/alert-confirm'
import { toast } from 'sonner'
import { resetOrder } from '@/actions/order/resetOrder'
import { ChevronLeft, ChevronRight } from 'lucide-react'


interface OrderProps {
    orders: Order[]
    refetch: () => void
}
export const DataTable = ({ orders, refetch }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [order, setOrder] = useState("")


    const handleAccept = async (coment: string) => {

        setIsSaving(true)
        try {
            // ENVIAR A LA ACCION PARA RESETEAR LA ORDEN  "Preparacion"
            await resetOrder(order, 1, "reset_status", coment)

            toast.success("Operación exitosa");

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
            setIsOpenAlert(false)
            setOrder("")
        }

        refetch()

    }

    const handleOpenAlert = (orderId: number, orderNumber: string) => {

        setIsOpenAlert(true)
        setOrder(orderNumber)
    }


    const table = useReactTable({
        data: orders,
        columns: columns(handleOpenAlert),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
        },
    })



    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Ningún elemento agregado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between space-x-2 py-4 ">
                <div className="text-xs md:tx-sm text-muted-foreground">
                    Total: {table.getFilteredRowModel().rows.length} Orden(es)
                </div>

                <div className="space-x-2 flex items-center justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>

                    <div className='text-xs md:text-sm'>
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>


            {/* ALERT CONFIRM */}
            <AlertConfirm handleAccept={handleAccept} isOpenAlert={isOpenAlert} isSaving={isSaving} setIsOpenAlert={setIsOpenAlert} />
        </div>
    )
}
