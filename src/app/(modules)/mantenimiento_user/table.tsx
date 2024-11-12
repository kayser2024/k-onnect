'use client'

import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import React, { useState } from 'react'
import { columns } from './columns'

import { IoIosSearch } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalUser } from './modal';
import prisma from '@/lib/prisma';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/actions/usuario/mantenimientoUser';
export const DataTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => await getAllUsers(),
    })

    console.log({ data, isLoading, isError }, '👀🟢')



    const handleOpenModal = (action: string, id: number, currentStatus: boolean) => {

        // Implement your modal logic here
        if (action === 'create') { handleCreate() }
        else if (action === 'edit') { handleEdit(id) }
        else if (action === 'delete') { handleDelete(id, currentStatus) }
        else if (action === 'reset') { handleReset(id) }
    }


    // FUNCIÓN PARA CREAR UN NUEVO USUARIO
    const handleCreate = () => {
        // setIsOpen(true);
        console.log('create')
    }

    // FUNCIÓN PARA EDITAR DATOS DEL USUARIO
    const handleEdit = (id: number) => {

    }

    // FUNCION PARA CAMBIAR ESTADO DEL USUARIO
    const handleDelete = (id: number, currentStatus: boolean) => {


    }

    //  FUNCION PARA RESETEAR LA CONTRASEÑA
    const handleReset = (id: number) => {

    }

    const handleSave = () => {
        setIsOpen(false)
    }

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
                    {/* <input type="text" className="grow block" placeholder="Buscar usuario" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> */}
                    <Input placeholder='Buscar usuario ...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

                    {/* <IoIosSearch size={25} /> */}
                </label>
                <Button
                    variant='default'
                    className='gap-2'
                    onClick={() => handleOpenModal('create')}
                >
                    <CiCirclePlus size={25} />
                    Nuevo
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    Sin Resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* <ModalUser isOpen={isOpen} onClose={() => setIsOpen(false)} handleSave={handleSave} /> */}
        </div>
    )
}
