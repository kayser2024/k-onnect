'use client'

import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'

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
import { getProductBySearchCode } from '@/actions/product/getProduct'
import { insertProductNotFoundDetail } from '@/actions/guia/insertProductDetail'
import { Detail } from '@/types/Guia'
import { QueryObserverResult } from '@tanstack/react-query'


interface OrderProps {
    data: any;
    rowSelection: RowSelectionState;
    setRowSelection: Dispatch<SetStateAction<RowSelectionState>>
    refetch: () => Promise<QueryObserverResult<Detail[]>>
}
export const DataTable = ({ data, rowSelection, setRowSelection, refetch }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchCode, setSearchCode] = useState("");

    console.log(data)
    const tableData = useMemo(() => {
        // return data && data[0] ? data[0].Details : [];
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
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection
        },
    })

    const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        console.log(searchCode)

        // buscar si existe el producto en la tabla
        const product = tableData.find((item: any) => item.BarCode === searchCode.trim());

        if (!product) {
            // realizar busqueda del producto en la api para relizar el insert
            const existProductInBD = await getProductBySearchCode(searchCode);

            console.log(existProductInBD)
            if (!existProductInBD.ok) {
                toast.warning("El Producto no existe")
                return;
            }

            // Obtener el NoteGuideID de la guía actual
            const noteGuideID = data[0]?.NoteGuideID;

            if (!noteGuideID) {
                toast.error("No se pudo obtener el NoteGuideID");
                return;
            }



            // TODO: insertar producto encontrado en la tabla GuideDetails 🚩
            // ExistInGuide:False,
            // Quantity:0,
            // QuantityPicks:1

            // const productFound = {
            //     NoteGuideID: noteGuideID,
            //     Description: "Producto AGREGADO",
            //     BarCode: existProductInBD?.data?.codigoEan || "",
            //     // Description: existProductInBD.data.descripcion,
            //     ProductCode: existProductInBD.data?.codigoSap || "",
            //     ImageURL: existProductInBD.data?.url_foto || "",
            //     Quantity: 0,
            //     QuantityPicks: 1,
            //     ExistInGuide: false,
            // }


            const resultNewProduct = await insertProductNotFoundDetail({} as any)
            await refetch()

            console.log(resultNewProduct)

        }

        console.log(product)

        // TODO: agregar 1 y guardar en la BD 🚩
        // TODO: crear sp_insertProductsReceptionGuide 🚩
        // const response = await insertProductGuide(data[0].GuideNumber, product)
        // console.log(response)

    }


    const handleSaveGuias = () => {
        // TODO:obtener las guias seleccionadas🚩

        //  Guardar en la BD la finalización
        // Implementación para guardar las guías
        console.log("Guardando Guías")
    }

    return (
        <div className="w-full flex flex-col gap-2 mt-4">
            <form action="" onSubmit={handleAddItem}>

                <Input placeholder='Ingresar Cod Prod | Cod Barra' value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
            </form>
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
                                    {row.getVisibleCells().map((cell) => {
                                        // console.log(cell.row.original.ExistInBox)
                                        const existInBox = cell.row.original.ExistInGuide;
                                        return <TableCell key={cell.id} className={`${existInBox ? '' : 'bg-orange-100'}`}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>

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
            </div>

            <div className=" flex justify-between">
                <div className="">
                    <p className='text-sm'>Total: </p>
                    <p className='text-sm'>Faltantes: </p>
                    <p className='text-sm'>Restantes: </p>

                </div>
                <Button onClick={handleSaveGuias}>Guardar</Button>
            </div>

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
        </div>
    )
}
