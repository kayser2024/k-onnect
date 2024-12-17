'use client'

import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LiaUserEditSolid } from 'react-icons/lia'
import { DatosEnvio } from '@/types/Orden'
import { SelectStore } from './select-store'
import { updateShippingInfo } from '@/actions/order/api/PUT-order'
import { toast } from 'sonner'


interface ModalEditEnvioProps {
    datos_envio: DatosEnvio,
    orden: string
}
export function ModalEditEnvio({ datos_envio, orden }: ModalEditEnvioProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [store, setStore] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEditEnvio = () => {
        setOpenEdit(true)
        // Enviar al servidor la data
        try {
            // GUARDAR INCIDENCIA
            // await updateShippingInfo (data)

        } catch (error: any) {
            console.log(error.message)
        } finally {
            setOpenEdit(false)
        }

    }

    // Función para guardar la información del Envío
    const handleSave = async () => {
        setLoading(true)
        const data = {
            orden,
            nombres_envio: datos_envio.nombres_envio,
            apellidos_envio: datos_envio.apellidos_envio,
            direccion_envio: store,
            telefono_envio: datos_envio.telefono_envio,
            dni_envio: datos_envio.dni_envio,
        }
        if (!store) {
            toast.warning("Por favor seleccionar una Tienda")
        }

        // ACtualizar información envio
        const response = await updateShippingInfo(data)
        console.log(response, 'RESPONSE-----')

        setOpenEdit(false)
        toast.success("Operación exitosa")

        setLoading(false)

    }


    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger> <div className="bg-slate-100 text-center rounded-full cursor-pointer hover:bg-slate-300 p-2" onClick={handleEditEnvio}><LiaUserEditSolid title="Editar Envío" size={20} /></div></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Editar Envio</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className=" items-center gap-4">
                        <Label htmlFor="name" className="text-right text-slate-500">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            defaultValue={datos_envio.nombres_envio}
                            className=""
                            disabled
                        />
                    </div>
                    <div className=" items-center gap-4">
                        <Label htmlFor="dni" className="text-right text-slate-500">
                            DNI
                        </Label>
                        <Input
                            id="dni"
                            defaultValue={datos_envio.dni_envio}
                            className=""
                            disabled
                        />
                    </div>
                    <div className=" items-center gap-4">
                        <Label htmlFor="cel" className="text-right text-slate-500">
                            Tel. / Cel.
                        </Label>
                        <Input
                            id="cel"
                            defaultValue={datos_envio.telefono_envio}
                            className=""
                        />
                    </div>

                    <div className=" items-center gap-4">
                        <Label htmlFor="username" className="text-right text-slate-500">
                            Tienda
                        </Label>

                        <SelectStore setStore={setStore} />

                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
