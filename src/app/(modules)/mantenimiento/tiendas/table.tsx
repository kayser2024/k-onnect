'use client'

import React, { useEffect, useState } from 'react'

import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { columns } from './columns';
import { Modal } from './modal';
import { getEstablecById, getListEstablecimientos, updateEstablec } from '@/actions/establecimiento/getEstablecimiento';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PickupPoint } from '@/types/Establec';


let initialData: PickupPoint = {
    PickupPointID: 0,
    Description: "",
    District: "",
    Province: "",
    Department: "",
    LocationCode: "",
    Place: "",
    Address: ""
}

export const DataTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [action, setAction] = useState("")
    const [dataUser, setDataUser] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false)
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [searchStore, setSearchStore] = useState("");


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['listEstablec'],
        queryFn: async () => await getListEstablecimientos(),
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
        setIsOpenModal(true);
    }

    // FUNCIÓN PARA EDITAR DATOS DEL USUARIO
    const handleEdit = async (id: number) => {
        if (!id) return;
        try {
            const establec: PickupPoint = await getEstablecById(id);
            console.log({ establec }, '👀👀')
            setDataUser(establec)
            setIsOpenModal(true);
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }


    // FUNCION PARA CAMBIAR ESTADO DEL USUARIO
    const handleDelete = (action: string, id: string, currentStatus: boolean) => {
        if (!id) return;

        // abrir alert
        setIsOpenAlert(true);
        setDataUser(prevState => ({ ...prevState, dni: id, status: currentStatus }));
        console.log(action, id)

    }

    //  FUNCION PARA RESETEAR LA CONTRASEÑA
    const handleReset = (id: string) => {
        if (!id) return;
        // Abrir alert
        setIsOpenAlert(true);
        setDataUser(prevState => ({ ...prevState, dni: id }))
        console.log("reset password", id)
    }


    // FUNCIÓN PARA GUARDAR LOS DATOS DEL USUARIO
    const handleSave = async (action: string, data: PickupPoint) => {

        setIsSaving(true)
        try {
            // if (action === 'create') await createUser(data);
            // if (action === 'edit') await updateUser(data);

            // llamar action para crear un establecimiento y actualizar establecimiento
            if (action === 'edit') await updateEstablec(data)


            toast.success("Operación exitosa");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false)
            setIsOpenModal(false)
            setDataUser(initialData)
        }

        refetch();

    }


    // REACT-TABLE
    const table = useReactTable({
        data: data || [],
        columns: columns(handleOpenModal),
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
            },
        },
    })


    // Actualizar el total de registros solo cuando cambie `data`
    useEffect(() => {
        if (data) {
            setTotalRegistros(data.length);
        }
    }, [data]);

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
                    <Table >
                        <ScrollArea className='h-[500px]'>
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
                        </ScrollArea>
                    </Table>
                }

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Total de registros: {totalRegistros}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </div>

            {/* MODAL CREATE  - UPDATE */}
            {!isLoading && <Modal isOpenModal={isOpenModal} handleSave={handleSave} setIsOpenModal={setIsOpenModal} action={action} data={dataUser} isSaving={isSaving} />}


            {/* CONFIRM RESET - DELETE */}
            {/* <AlertConfirm isOpenAlert={isOpenAlert} setIsOpenAlert={setIsOpenAlert} action={action} handleAccept={handleAlertAccept} isSaving={isSaving} /> */}
        </div>
    )
}
