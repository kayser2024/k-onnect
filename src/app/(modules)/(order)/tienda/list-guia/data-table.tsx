'use client'

import React, { useMemo, useState } from 'react'

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
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader } from '@/components/loader'
import { Label } from '@/components/ui/label'
import { columns } from './columns'


interface OrderProps {
    data: any;
    setData: (value: any) => void
}

export const DataTable = ({ data, setData }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState("");


    const tableData = useMemo(() => {
        return data && data ? data : [];
    }, [data]);



    // Verificar que data y data[0] no sean undefined
    const table = useReactTable({
        data: tableData,
        columns: columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            // pagination: {
            //     pageIndex: 0,
            //     pageSize: 100,
            // }
        },
    })

    // const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     // buscar si existe el producto en la tabla
    //     const product = tableData.find((item: any) => item.BarCode === searchCode.trim());

    //     try {
    //         if (!product) {
    //             // realizar busqueda del producto en la api para relizar el insert
    //             const existProductInBD = await getProductBySearchCode(searchCode);

    //             if (!existProductInBD.data) {
    //                 toast.warning("El Producto no existe")
    //                 setLoading(false);
    //                 return;
    //             }

    //             // Obtener el NoteGuideID de la guía actual
    //             const noteGuideID = data[0]?.NoteGuideID;

    //             if (!noteGuideID) {
    //                 toast.error("No se pudo obtener el NoteGuideID");
    //                 setLoading(false)
    //                 return;
    //             }

    //             // insertar producto encontrado en la tabla GuideDetails 🚩
    //             const productFound = {
    //                 NoteGuideID: noteGuideID,
    //                 Description: "Producto AGREGADO",
    //                 BarCode: existProductInBD?.data?.codigoEan || "",
    //                 // Description: existProductInBD.data.descripcion,
    //                 ProductCode: existProductInBD.data?.codigoSap || "",
    //                 ImageURL: existProductInBD.data?.url_foto || "",
    //                 Quantity: 0,
    //                 QuantityPicks: 1,
    //                 ExistInGuide: false,
    //             }


    //             const resultNewProduct = await insertProductNotFoundDetail(productFound)
    //             // console.log(resultNewProduct)

    //         } else {
    //             // aumentar quantityPicks si existe el producto (Update Table GuideDetails)
    //             // QuantityPicks +1
    //             const resultUpdateItem = await updatOneItemPicks(guide, searchCode)
    //             // console.log(resultUpdateItem)
    //         }

    //     } catch (error: any) {
    //         toast.error(error.message)
    //     } finally {
    //         setSearchCode("")
    //         setLoading(false)
    //         await refetch()
    //     }


    // }


    // const handleGuideCompleted = async () => {
    //     setIsSaving(true)
    //     try {
    //         //  Guardar en la BD la finalización
    //         await updateGuideCompleted(data[0].NoteGuideID, observations)
    //         toast.success("Guía completado con Éxito")

    //         // vaciar la tabla cargada 🚩
    //         setData([])
    //         setIsGuideOpen(false)
    //         setObservations("")
    //         setSearchCode("")
    //     } catch (error: any) {
    //         toast.error(error.message)
    //     } finally {
    //         setIsSaving(false)
    //         setIsOpen(false)
    //     }
    // }


    // const openModalAccept = () => {
    //     // (false)
    //     setIsOpen(true)

    // }

    // const handleAccept = async () => {
    //     await handleGuideCompleted();
    // }

    // const handleClose = () => {
    //     setIsOpen(false)
    // }


    // const totals = data.reduce((acc: any, item: any) => {
    //     acc.total += item.Quantity;
    //     if (item.ExistInGuide) {
    //         acc.sobrantes += item.Quantity < item.QuantityPicks ? item.QuantityPicks - item.Quantity : 0;
    //         acc.fatantes += item.Quantity > item.QuantityPicks ? item.Quantity - item.QuantityPicks : 0;
    //     }
    //     acc.noListados += !item.ExistInGuide ? item.QuantityPicks : 0;
    //     acc.picking += item.QuantityPicks ? item.QuantityPicks : 0;
    //     return acc;
    // }, { total: 0, faltantes: 0, sobrantes: 0, noListados: 0, picking: 0 });

    return (
        <div className="w-full flex flex-col gap-4 mt-2 shadow-md border p-2 rounded-md ">

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
                                            return (
                                                <TableCell key={cell.id} >
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
                                        colSpan={columns.length + 1}
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



            {loading && <Loader />}


            {/* PAGINATION */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <span>
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
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

        </div>

    )
}
