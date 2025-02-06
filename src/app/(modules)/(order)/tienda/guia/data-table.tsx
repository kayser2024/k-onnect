'use client'

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { columns } from './columns'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { insertProductGuide } from '@/actions/guia/insertProductGuia'
import { insertProductNotFoundDetail } from '@/actions/guia/insertProductDetail'
import { Detail } from '@/types/Guia'
import { QueryObserverResult } from '@tanstack/react-query'
import { getProductBySearchCode } from '@/actions/product/getProduct'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { updateIncrementPicks, updatOneItemPicks } from '@/actions/guia/updateGuidePicks'
import { Loader } from '@/components/loader'
import { updateGuideCompleted } from '@/actions/guia/updateGuideComplete'
import { ModalGuideCompleted } from './ui/modal-guide-complete'


interface OrderProps {
    data: any;
    rowSelection: RowSelectionState;
    setRowSelection: Dispatch<SetStateAction<RowSelectionState>>
    guide: string
    refetch: () => Promise<QueryObserverResult<Detail[]>>
    setData: (value: any) => void
    setIsGuideOpen: (value: boolean) => void
}
export const DataTable = ({ data, rowSelection, setRowSelection, refetch, guide, setData, setIsGuideOpen }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchCode, setSearchCode] = useState("");
    const [loading, setLoading] = useState(false)

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false)

    console.log(data)
    const tableData = useMemo(() => {
        // return data && data[0] ? data[0].Details : [];
        return data && data ? data : [];
    }, [data]);

    const handleIncrement = async (NoteGuideDetailsID: number, increment: number) => {
        setLoading(true)
        // actualizar la base de datos
        console.log({ NoteGuideDetailsID, increment })
        try {
            const resultUpdateItem = await updateIncrementPicks(NoteGuideDetailsID, increment)
            console.log(resultUpdateItem)
        } catch (error: any) {
            toast.warning(error.message)
        } finally {
            setLoading(false)
            await refetch()
        }
    }


    // Verificar que data y data[0] no sean undefined
    const table = useReactTable({
        data: tableData,
        columns: columns(handleIncrement),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
            pagination: {
                pageIndex: 0,
                pageSize: 100,
            }
        },
    })

    const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // buscar si existe el producto en la tabla
        const product = tableData.find((item: any) => item.BarCode === searchCode.trim());

        try {
            if (!product) {
                // realizar busqueda del producto en la api para relizar el insert
                const existProductInBD = await getProductBySearchCode(searchCode);
                console.log(existProductInBD)
                if (!existProductInBD.data) {
                    toast.warning("El Producto no existe")
                    setLoading(false);
                    return;
                }

                // Obtener el NoteGuideID de la guía actual
                const noteGuideID = data[0]?.NoteGuideID;

                if (!noteGuideID) {
                    toast.error("No se pudo obtener el NoteGuideID");
                    setLoading(false)
                    return;
                }

                // insertar producto encontrado en la tabla GuideDetails 🚩
                // ExistInGuide:False,
                // Quantity:0,
                // QuantityPicks:1
                const productFound = {
                    NoteGuideID: noteGuideID,
                    Description: "Producto AGREGADO",
                    BarCode: existProductInBD?.data?.codigoEan || "",
                    // Description: existProductInBD.data.descripcion,
                    ProductCode: existProductInBD.data?.codigoSap || "",
                    ImageURL: existProductInBD.data?.url_foto || "",
                    Quantity: 0,
                    QuantityPicks: 1,
                    ExistInGuide: false,
                }


                const resultNewProduct = await insertProductNotFoundDetail(productFound)
                // console.log(resultNewProduct)

            } else {
                // aumentar quantityPicks si existe el producto (Update Table GuideDetails)
                // QuantityPicks +1
                const resultUpdateItem = await updatOneItemPicks(guide, searchCode)
                // console.log(resultUpdateItem)
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setSearchCode("")
            setLoading(false)
            await refetch()
        }


    }


    const handleGuideCompleted = async () => {
        setIsSaving(true)
        try {
            //  Guardar en la BD la finalización
            await updateGuideCompleted(data[0].NoteGuideID)
            toast.success("Guía completado con Éxito")

            // vaciar la tabla cargada 🚩
            setData([])
            setIsGuideOpen(false)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
            setIsOpen(false)
        }
    }


    const openModalAccept = () => {
        // (false)
        setIsOpen(true)

    }

    const handleAccept = async () => {
        await handleGuideCompleted();
    }

    const handleClose = () => {
        setIsOpen(false)
    }


    return (
        <div className="w-full flex flex-col gap-2 mt-4">
            <form action="" onSubmit={handleAddItem}>

                <Input placeholder='Ingresar Cod Prod | Cod Barra' value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
            </form>
            <div className="rounded-md border">

                <ScrollArea className='h-[400px]'>

                    <Table>
                        <TableHeader className=''>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} >
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
                                        {row.getVisibleCells().map((cell) => {
                                            // console.log(cell.row.original.ExistInBox)
                                            const existInBox = cell.row.original.ExistInGuide;
                                            return (
                                                <TableCell key={cell.id} className={`${existInBox ? '' : 'bg-orange-1   00'}`} >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            )

                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Ningún elemento encontrado
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            <div className=" flex justify-between">
                <div className="">
                    <p className='text-sm'>Total: </p>
                    <p className='text-sm'>Faltantes: </p>
                    <p className='text-sm'>Restantes: </p>

                </div>
                <Button onClick={openModalAccept}>Guardar</Button>
            </div>

            {loading && <Loader />}


            {/* PAGINATION */}
            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} Fila(s) Seleccionado(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div> */}

            <ModalGuideCompleted
                handleAccept={handleAccept}
                handleClose={handleClose}
                isLoading={isSaving}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    )
}
