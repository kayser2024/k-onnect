'use client'

import React, { useEffect, useState } from 'react'

import { changeStatusUser, createUser, getAllUsers, getUserByID, resetPassword, updateUser } from '@/actions/usuario/mantenimientoUser';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// import { columns } from './usuarios/columns'
// import { AlertConfirm } from './usuarios/alert-confirm';
// import { ModalUser } from './modal';
import type { User } from '@/types/User';
import { columns } from './columns';
import { ModalUser } from './modal';
import { AlertConfirm } from './alert-confirm';
import { ChevronLeft, ChevronRight } from 'lucide-react';


let initialDataUsuer = {
    UserID: 0,
    NroDoc: '',
    Name: '',
    LastName: '',
    Email: '',
    Password: '',
    RoleID: 1,
    Status: false,
    PickupPointID: 0,
    TypeDocID: 0
}


export const DataTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [action, setAction] = useState("")
    const [dataUser, setDataUser] = useState(initialDataUsuer);
    const [isSaving, setIsSaving] = useState(false)
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [searchUsuario, setSearchUsuario] = useState("");


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => await getAllUsers(),
    })


    const handleOpenModal = (action: string, userID?: number, currentStatus?: boolean, dni?: string) => {
        setAction(action);

        // console.log(action, userID, currentStatus)
        switch (action) {

            case 'create':
                handleCreate()
                break
            case 'edit':
                if (userID) handleEdit(userID)
                break
            case 'delete':
                if (userID && typeof currentStatus === "boolean") {
                    handleDelete(action, userID, currentStatus);
                }
                break
            case 'reset':
                if (userID && dni) handleReset(userID, dni)
                break
            default:
                break
        }
    }


    // FUNCIÓN PARA CREAR UN NUEVO USUARIO
    const handleCreate = () => {
        setDataUser(initialDataUsuer)
        setIsOpenModal(true);
    }

    // FUNCIÓN PARA EDITAR DATOS DEL USUARIO
    const handleEdit = async (userID: number) => {
        if (!userID) return;
        try {
            const user = await getUserByID(userID);
            setDataUser(user)
            setIsOpenModal(true);
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // FUNCION PARA CAMBIAR ESTADO DEL USUARIO
    const handleDelete = (action: string, userID: number, currentStatus: boolean) => {
        if (!userID) return;

        // abrir alert
        setIsOpenAlert(true);
        setDataUser(prevState => ({ ...prevState, UserID: userID, Status: currentStatus }));
        // console.log(action, userID, currentStatus)

    }

    //  FUNCION PARA RESETEAR LA CONTRASEÑA
    const handleReset = (userID: number, dni: string) => {
        if (!userID) return;
        // Abrir alert
        setIsOpenAlert(true);
        setDataUser(prevState => ({ ...prevState, UserID: userID, NroDoc: dni }))
        // console.log("reset password", userID)
    }


    // FUNCIÓN PARA GUARDAR LOS DATOS DEL USUARIO
    const handleSave = async (action: string, data: User) => {

        setIsSaving(true)
        try {
            if (action === 'create') {
                try {
                    const result = await createUser(data)
                    if (!result.ok) {
                        throw new Error(result.message)
                    }
                    toast.success(result.message)
                } catch (error: any) {
                    toast.error(error.message)
                }

            };
            
            if (action === 'edit') await updateUser(data);
        } catch (error: any) {
            toast.error(error.message);
            return false;
        } finally {
            setIsSaving(false)
            setIsOpenModal(false)
            setDataUser(initialDataUsuer)
        }

        refetch();
        return true

    }

    // FUNCIÓN PARA ACEPTAR Y GUARDAR
    const handleAlertAccept = async (action: string) => {

        setIsSaving(true)
        try {
            if (action === 'reset') await resetPassword(dataUser.UserID, dataUser.NroDoc)
            if (action === 'delete') await changeStatusUser(dataUser.UserID, dataUser.Status)
            toast.success("Operación exitosa");
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
            setIsOpenAlert(false)
            setDataUser(initialDataUsuer);
        }


        refetch()

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
        if (searchUsuario) {
            filters.push({ id: 'name', value: searchUsuario })
        }
        setColumnFilters(filters);
    }, [searchUsuario])

    return (
        <div>
            {/* SEARCH */}
            <div className="flex gap-2 w-full my-4">
                <label className="input  input-bordered flex items-center gap-2 w-full">
                    <Input placeholder='Buscar nombre ...' value={searchUsuario} onChange={e => setSearchUsuario(e.target.value)} />
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

                {isLoading && <Loader />}

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

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Total de registros: {totalRegistros}
                    </div>


                    <div className="space-x-2 flex justify-center items-center">
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
            <ModalUser isOpenModal={isOpenModal} handleSave={handleSave} setIsOpenModal={setIsOpenModal} action={action} data={dataUser} isSaving={isSaving} />


            {/* CONFIRM RESET - DELETE */}
            <AlertConfirm isOpenAlert={isOpenAlert} setIsOpenAlert={setIsOpenAlert} action={action} handleAccept={handleAlertAccept} isSaving={isSaving} />
        </div>
    )
}
