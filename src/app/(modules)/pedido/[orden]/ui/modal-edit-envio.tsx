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
import { SelectDepartment } from './select-department'
import { SelectProvince } from './select-province'
import { SelectDistrict } from './select-district'
import { ScrollArea } from '@/components/ui/scroll-area'


interface ModalEditEnvioProps {
    datos_envio: DatosEnvio,
    orden: string
}
export function ModalEditEnvio({ datos_envio, orden }: ModalEditEnvioProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [store, setStore] = useState("");
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState("")
    const [province, setProvince] = useState("")
    const [district, setDistrict] = useState("")
    const [address, setAddress] = useState("")
    const [reference, setReference] = useState("")
    const [locationCode, setLocationCode] = useState("")



    const tipo_envio = datos_envio.tipo_envio;


    // Función para Editar el envío
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


    console.log({ department, province, district }, '--------------')


    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger> <div className="bg-slate-100 text-center rounded-full cursor-pointer hover:bg-slate-300 p-2" onClick={handleEditEnvio}><LiaUserEditSolid title="Editar Envío" size={20} /></div></DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className='text-center'>Editar Envio</DialogTitle>
                </DialogHeader>

                <ScrollArea className='h-[500px] '>

                    <div className="grid gap-4 p-2">
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



                            {tipo_envio === 'recojo en tienda'
                                ? <>
                                    <Label htmlFor="username" className="text-right text-slate-500">
                                        Tienda
                                    </Label>

                                    <SelectStore setStore={setStore} />
                                </>
                                : <OptionShipping
                                    department={department}
                                    setDepartment={setDepartment}
                                    province={province}
                                    setProvince={setProvince}
                                    district={district}
                                    setDistrict={setDistrict}
                                    address={address}
                                    setAddress={setAddress}
                                    reference={reference}
                                    setReference={setReference}
                                    locationCode={locationCode}
                                    setLocationCode={setLocationCode}
                                />

                            }

                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}





interface OptionShippingProps {
    department: string
    setDepartment: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    district: string;
    setDistrict: (value: string) => void;
    address: string;
    setAddress: (value: string) => void;
    reference: string;
    setReference: (value: string) => void;
    locationCode: string;
    setLocationCode: (value: string) => void;
}
const OptionShipping = ({ department, setDepartment, province, setProvince, district, setDistrict, address, setAddress, reference, setReference, locationCode, setLocationCode }: OptionShippingProps) => {


    const handleSetDepartment = (value: string) => {
        setDepartment(value);
        setProvince("")
        setDistrict("")
        setLocationCode("")
    }

    const handleSetProvince = (value: string) => {
        setProvince(value)
        setDistrict("")
        setLocationCode("")
    }


    return (
        <>

            <div className="grid gap-4">

                <div className=" items-center gap-4">
                    <Label htmlFor="name" className="text-right text-slate-500">
                        Departamento
                    </Label>
                    <SelectDepartment
                        setDepartment={handleSetDepartment}
                        setProvince={setProvince}
                        setDistrict={setDistrict}
                        setLocationCode={setLocationCode}
                    />

                </div>
                <div className=" items-center gap-4">
                    <Label htmlFor="name" className="text-right text-slate-500">
                        Provincia
                    </Label>
                    <SelectProvince
                        province={province}
                        setProvince={handleSetProvince}
                        department={department}
                        setDistrict={setDistrict}
                        setLocationCode={setLocationCode}
                    />

                </div>
                <div className=" items-center gap-4">
                    <Label htmlFor="name" className="text-right text-slate-500">
                        Distrito
                    </Label>
                    <SelectDistrict
                        district={district}
                        province={province}
                        setDistrict={setDistrict}
                        locationCode={locationCode}
                        setLocationCode={setLocationCode}
                    />

                </div>



                <div className=" items-center gap-4">
                    <Label htmlFor="name" className="text-right text-slate-500">
                        Direccion
                    </Label>
                    <Input
                        id="address"
                        value={address}
                        placeholder="Ingresar Direccion"
                        className=""
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className=" items-center gap-4">
                    <Label htmlFor="name" className="text-right text-slate-500">
                        Referencia
                    </Label>
                    <Input
                        id="reference"
                        value={reference}
                        placeholder="Ingresar Referencia"
                        className=""
                        onChange={(e) => setReference(e.target.value)}

                    />
                </div>

            </div>


        </>
    )
}