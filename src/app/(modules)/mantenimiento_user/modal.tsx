'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from '@/types/User'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ModalUserProps {
    action: string,
    isOpenModal: boolean,
    handleSave: (action: string, data: User) => void,
    setIsOpenModal: (value: boolean) => void,
    data: User
    isSaving: boolean
}
export const ModalUser = ({ isOpenModal, handleSave, setIsOpenModal, action, data, isSaving }: ModalUserProps) => {

    const [dni, setDni] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [rolId, setRolId] = useState<number>(1);

    useEffect(() => {
        if (data) {
            setDni(data.dni || "");
            setName(data.name || "");
            setLastName(data.lastName || "");
            setEmail(data.email || "");
            setRolId(data.rolId || 1);
        }
    }, [data]);


    return (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}  >
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{action === 'create' ? 'Crear' : 'Editar'} Usuario</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">

                    {/* Dni */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dni" className="text-right">
                            Nro Doc.
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={dni}
                            onChange={e => setDni(e.target.value)}
                            disabled={action === 'edit'}
                        />
                    </div>
                    {/* nombre */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nombre</Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    {/* Apellido */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">Apellido</Label>
                        <Input
                            id="lastName"
                            className="col-span-3"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>

                    {/* email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                            id="email"
                            className="col-span-3"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type='email'
                        />
                    </div>

                    {/* Rol */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Rol</Label>
                        <Select onValueChange={(value) => setRolId(Number(value))} value={String(rolId)} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    <SelectItem value="1">ADMIN</SelectItem>
                                    <SelectItem value="2">ATC</SelectItem>
                                    <SelectItem value="3">TIENDA</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpenModal(false)} variant='outline' disabled={isSaving}>Cerrar</Button>
                    <Button onClick={() => handleSave(action, { name, lastName, email, rolId, dni })} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
