'use client'

import React, { useEffect, useState } from 'react'

import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { columns } from './columns';
import { Modal } from './modal';
import { createEstablec, getEstablecById, getListEstablecimientos, updateEstablec } from '@/actions/establecimiento/getEstablecimiento';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PickupPoint } from '@/types/Establec';
import { ChevronLeft, ChevronRight } from 'lucide-react';


let initialData: PickupPoint = {
    PickupPointID: 0,
    Description: "",
    District: "",
    Province: "",
    Department: "",
    LocationCode: "",
    Place: "",
    Address: "",
    CodWareHouse: "",
    Lat: null,
    Lon: null,
    IsActive: false,
    IsAvailablePickup: false
}

export const DataTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [action, setAction] = useState("")
    const [dataUser, setDataUser] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false)
    const [searchStore, setSearchStore] = useState("");


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['listEstablec'],
        queryFn: async () => await getListEstablecimientos(),
        staleTime: 1000,

    })


    const handleOpenModal = (action: string, id?: number) => {
        setAction(action);

        switch (action) {

            case 'create':
                handleCreate()
                break
            case 'edit':
                if (id) handleEdit(id)
                break
            default:
                break
        }
    }


    // FUNCIÓN PARA CREAR UN NUEVO USUARIO
    const handleCreate = () => {
        setDataUser(initialData)
        // TODO: Crear una tienda 🚩

        setIsOpenModal(true);
    }

    // FUNCIÓN PARA EDITAR DATOS DEL USUARIO
    const handleEdit = async (id: number) => {
        if (!id) return;
        try {
            const establec: PickupPoint = await getEstablecById(id);
            setDataUser(establec)
            setIsOpenModal(true);
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }


    // FUNCIÓN PARA GUARDAR LOS DATOS DE la TIENDA
    const handleSave = async (action: string, data: PickupPoint, id: number) => {
        let result;
        setIsSaving(true)
        console.log(data)
        try {
            if (action === 'create') {
                result = await createEstablec(data);

                if (!result.ok) {
                    toast.error(result.message)
                    return;
                }
                toast.success(result.message)
            }



            // llamar action para crear un establecimiento y actualizar establecimiento
            if (action === 'edit') {
                if (!id) {
                    toast.error("No se obtuvo identificador del estableciemiento");
                    return;
                }
                const result = await updateEstablec(data, id)

                if (!result.ok) {
                    toast.error(result.message)
                    return;
                }
                toast.success(result.message)
            }


        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false)
            setIsOpenModal(false)
            setDataUser(initialData)
        }

        // refetch();
        handleRefetch()

    }


    const queryClient = useQueryClient();
    const handleRefetch = async () => {
        const previousPageIndex = table.getState().pagination.pageIndex;

        await queryClient.invalidateQueries({ queryKey: ['listEstablec'] });

        // Pequeño delay para asegurarnos de que los datos están listos antes de actualizar la paginación
        setTimeout(() => {
            table.setPageIndex(previousPageIndex);
        }, 50);
    };


    // REACT-TABLE
    const table = useReactTable({
        data: data || [],
        columns: columns(handleOpenModal, handleRefetch),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,

        state: {
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
        },
    })



    // Actualizar el total de registros solo cuando cambie `data`

    useEffect(() => {
        const filters = []
        if (searchStore) {
            filters.push({ id: 'name', value: searchStore })
        }
        setColumnFilters(filters);
    }, [searchStore])

    return (
        <div>
            {/* SEARCH */}
            <div className="flex gap-2 w-full my-4">
                <label className="input  input-bordered flex items-center gap-2 w-full">
                    <Input placeholder='Buscar nombre ...' value={searchStore} onChange={e => setSearchStore(e.target.value)} />
                </label>
                <Button
                    variant='default'
                    className='gap-2'
                    onClick={() => handleOpenModal('create')}
                >
                    Nuevo
                </Button>
            </div>

            <div className="overflow-x-auto">

                {isLoading
                    ? <Loader />
                    :
                    // <div className="">
                    <ScrollArea className='h-[460px] w-full'>

                        <Table >
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Sin Resultados
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                        <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                    // </div>

                }

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Total de registros: {table.getPrePaginationRowModel().rows.length}
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

                        <div className="text-sm text-muted-foreground">
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
            </div>

            {/* MODAL CREATE  - UPDATE */}
            {!isLoading && <Modal isOpenModal={isOpenModal} handleSave={handleSave} setIsOpenModal={setIsOpenModal} action={action} data={dataUser} isSaving={isSaving} />}


            {/* CONFIRM RESET - DELETE */}
            {/* <AlertConfirm isOpenAlert={isOpenAlert} setIsOpenAlert={setIsOpenAlert} action={action} handleAccept={handleAlertAccept} isSaving={isSaving} /> */}
        </div >
    )
}
