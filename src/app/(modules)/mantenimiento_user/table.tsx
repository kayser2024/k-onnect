'use client'

import React, { useState } from 'react'

import { changeStatusUser, createUser, getAllUsers, getUserByDni, resetPassword, updateUser } from '@/actions/usuario/mantenimientoUser';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { columns } from './columns'
import { AlertConfirm } from './alert-confirm';
import { ModalUser } from './modal';
import { User } from '@/types/User';


let initialDataUsuer = {
    dni: '',
    name: '',
    lastName: '',
    email: '',
    emailVerified: '',
    password: '',
    image: '',
    rolId: 1,
    status: false,
}

export const DataTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [action, setAction] = useState("")
    const [dataUser, setDataUser] = useState(initialDataUsuer);
    const [isSaving, setIsSaving] = useState(false)


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => await getAllUsers(),
    })



    const handleOpenModal = (action: string, id?: string, currentStatus?: boolean) => {
        setAction(action);

        console.log(action, id, currentStatus)
        switch (action) {

            case 'create':
                handleCreate()
                break
            case 'edit':
                if (id) handleEdit(id)
                break
            case 'delete':
                if (id && typeof currentStatus === "boolean") {
                    handleDelete(action, id, currentStatus);
                }
                break
            case 'reset':
                if (id) handleReset(id)
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
    const handleEdit = async (id: string) => {
        if (!id) return;
        try {
            const user = await getUserByDni(id);
            setDataUser(user)
            setIsOpenModal(true);
        } catch (error: any) {
            console.log(error.message)
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
    const handleSave = async (action: string, data: User) => {

        setIsSaving(true)
        try {
            if (action === 'create') await createUser(data);
            if (action === 'edit') await updateUser(data);
            toast.success("Operación exitosa");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false)
            setIsOpenModal(false)
            setDataUser(initialDataUsuer)
        }

        refetch();

    }

    // FUNCIÓN PARA ACEPTAR Y GUARDAR
    const handleAlertAccept = async (action: string) => {

        setIsSaving(true)
        try {
            if (action === 'reset') await resetPassword(dataUser.dni)
            if (action === 'delete') await changeStatusUser(dataUser.dni, dataUser.status)
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
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
    })

    return (
        <div>
            {/* SEARCH */}
            <div className="flex gap-2 w-full my-4">
                <label className="input  input-bordered flex items-center gap-2 w-full">
                    <Input placeholder='Buscar usuario ...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
            </div>

            {/* MODAL CREATE  - UPDATE */}
            <ModalUser isOpenModal={isOpenModal} handleSave={handleSave} setIsOpenModal={setIsOpenModal} action={action} data={dataUser} isSaving={isSaving} />


            {/* CONFIRM RESET - DELETE */}
            <AlertConfirm isOpenAlert={isOpenAlert} setIsOpenAlert={setIsOpenAlert} action={action} handleAccept={handleAlertAccept} isSaving={isSaving} />
        </div>
    )
}
