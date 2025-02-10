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
import { deleteGuideProduct, updateIncrementPicks, updatOneItemPicks } from '@/actions/guia/updateGuidePicks'
import { Loader } from '@/components/loader'
import { updateGuideCompleted } from '@/actions/guia/updateGuideComplete'
import { ModalGuideCompleted } from './ui/modal-guide-complete'
import { Label } from '@/components/ui/label'


interface OrderProps {
    data: any;
    rowSelection: RowSelectionState;
    setRowSelection: Dispatch<SetStateAction<RowSelectionState>>
    guide: string
    refetch: () => Promise<QueryObserverResult<Detail[]>>
    setData: (value: any) => void
    setIsGuideOpen: (value: boolean) => void
}
interface ProductFromAPI {
    codigoEan: string | null;
    codigoSap: string | null;
    url_foto: string | null;
    id: number;
}
export const DataTable = ({ data, rowSelection, setRowSelection, refetch, guide, setData, setIsGuideOpen }: OrderProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchCode, setSearchCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState("");


    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false)

    const tableData = useMemo(() => {
        return data && data ? data : [];
    }, [data]);

    const handleIncrement = async (NoteGuideDetailsID: number, increment: number) => {
        setLoading(true)
        // actualizar la base de datos
        console.log({ NoteGuideDetailsID, increment })
        try {
            const resultUpdateItem = await updateIncrementPicks(NoteGuideDetailsID, increment)
            // console.log(resultUpdateItem)
        } catch (error: any) {
            toast.warning(error.message)
        } finally {
            setLoading(false)
            await refetch()
        }
    }

    const handleDeleteProduct = async (NoteGuideDetailsID: number) => {
        setLoading(true)
        try {
            const resultDeleteItem = await deleteGuideProduct(NoteGuideDetailsID)
            console.log(resultDeleteItem)

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
        columns: columns(handleIncrement, handleDeleteProduct),
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
            // await updateGuideCompleted(data[0].NoteGuideID, observations)
            // toast.success("Guía completado con Éxito")

            // // vaciar la tabla cargada 🚩
            // setData([])
            // setIsGuideOpen(false)
            // setObservations("")
            // setSearchCode("")

            // enviar correo si tiene sobrante o faltantes
            const to = "victor.contreras@kayser.pe"
            const subject = "Email-example"
            const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Correo de prueba</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #007BFF;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007BFF;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>¡Hola!</h1>
                <p>Este es un correo de prueba enviado desde <strong>Nodemailer</strong>.</p>
                <p>Puedes incluir enlaces, imágenes y más:</p>
                <a href="https://example.com" class="button">Visitar Ejemplo</a>
              </div>
            </body>
            </html>
          `;
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, html }),
            });

            const result = await response.json();
            console.log(result);

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


    const totals = data.reduce((acc: any, item: any) => {
        acc.total += item.Quantity;
        if (item.ExistInGuide) {
            // acc.sobrantes += item.Quantity < item.QuantityPicks ? item.QuantityPicks - item.Quantity : 0;
            // acc.fatantes += item.Quantity > item.QuantityPicks ? item.Quantity - item.QuantityPicks : 0;
            acc.faltantes += item.QuantityPicks < item.Quantity ? item.Quantity - (item.QuantityPicks || 0) : 0;
            acc.sobrantes += item.QuantityPicks > item.Quantity ? (item.QuantityPicks || 0) - item.Quantity : 0;
        }
        acc.noListados += !item.ExistInGuide ? item.QuantityPicks : 0;
        acc.picking += item.QuantityPicks ? item.QuantityPicks : 0;
        return acc;
    }, { total: 0, faltantes: 0, sobrantes: 0, noListados: 0, picking: 0 });

    return (
        <div className="w-full flex flex-col gap-4 mt-2 shadow-md border p-2 rounded-md bg-slate-50/50 mb-4">
            <form action="" onSubmit={handleAddItem}>

                <Input placeholder='Ingresar Cod Prod | Cod Barra' className="shadow-sm mt-2 " value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
            </form>
            <div className="rounded-md border">

                <ScrollArea className='h-[380px]'>

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
                                                <TableCell key={cell.id} className={`${existInBox ? '' : 'bg-orange-50'}`} >
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

            <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                    <p className='text-xs'>Total : {totals.total}</p>|
                    <p className={`${totals.faltantes > 0 ? ' text-red-600 font-semibold' : ''} text-xs`}>Faltantes: {totals.faltantes}</p>|
                    <p className={`${totals.faltantes > 0 ? ' text-orange-300 font-semibold' : ''} text-xs`}>Sobrantes: {totals.sobrantes}</p>|
                    <p className='text-xs'>Picking: {totals.picking}</p>|
                    <p className='text-xs'>No listados: {totals.noListados}</p>

                </div>
                <div className="flex mt-4 gap-2">
                    <div className="w-full ">
                        <Label>Observaciones:</Label>
                        <Input placeholder='Ingresar observaciones' value={observations} onChange={(e) => setObservations(e.target.value)}></Input>
                    </div>
                    <Button onClick={openModalAccept} className='mt-6'>Guardar</Button>
                </div>
            </div>

            {loading && <Loader />}

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
