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
import { toast } from 'sonner'
import { SelectStore } from '@/components/select/select-store'

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
    const [pickupPointID, SetPickupPointID] = useState("");

    useEffect(() => {
        if (data) {
            setDni(data.NroDoc || "");
            setName(data.Name || "");
            setLastName(data.LastName || "");
            setEmail(data.Email || "");
            setRolId(data.RoleID || 1);
        }
    }, [data]);


    // Escucha para la tecla Escape
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpenModal(false); // Actualiza el estado en el padre
            }
        };

        if (isOpenModal) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpenModal, setIsOpenModal]);

    // validar información antes de enviar

    const handleSubmit = () => {
        // validar data
        if (name.trim() === '' || email.trim() === '' || lastName.trim() === '' || dni.trim() === '') {
            return toast.error('Todos los campos son obligartorios')
        }
        if (name.trim().length < 4 || lastName.trim().length < 4) {
            return toast.error('Los nombres y apellidos deben tener al menos 4 caracteres')
        }
        if (!email.trim().match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return toast.error('El email no es válido')
        }
        if (dni.trim().length < 8) {
            return toast.error('El número de DNI debe tener al menos 8 dígitos')
        }


        // enviar data 
        handleSave(action, { Name: name, LastName: lastName, Email: email, RoleID: rolId, NroDoc: dni, TypeDocID: 1, PickupPointID: Number(pickupPointID), UserID: data.UserID })
    }

    return (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}  >
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className='text-center mb-2'>{action === 'create' ? 'Crear' : 'Editar'} Usuario</DialogTitle>

                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

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
                            required
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
                            required
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
                            required
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
                            required
                        />
                    </div>

                    {/* Rol SELECT */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Rol</Label>
                        <Select onValueChange={(value) => setRolId(Number(value))} value={String(rolId)} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleccionar un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    <SelectItem value="1">ADMIN</SelectItem>
                                    <SelectItem value="2">SOPORTE</SelectItem>
                                    <SelectItem value="3">WEB MASTER</SelectItem>
                                    <SelectItem value="4">ATC</SelectItem>
                                    <SelectItem value="5">ALMACEN</SelectItem>
                                    <SelectItem value="6">TIENDA</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Tienda SELECT */}
                    {rolId === 3 &&
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Tienda:</Label>
                            <div className="col-span-3">
                                <SelectStore setStore={SetPickupPointID} />
                            </div>

                        </div>
                    }


                </form>
                <DialogFooter className='mt-4'>
                    <Button onClick={() => setIsOpenModal(false)} variant='outline' disabled={isSaving}>Cerrar</Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
