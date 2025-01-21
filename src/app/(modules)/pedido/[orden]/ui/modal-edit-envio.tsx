'use client'

import React, { useEffect, useState } from 'react'

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
import { ScrollArea } from '@/components/ui/scroll-area'
import { CascadingSelect } from '@/components/select/CascadingSelect'


interface ModalEditEnvioProps {
    datos_envio: DatosEnvio,
    orden: string
}
export function ModalEditEnvio({ datos_envio, orden }: ModalEditEnvioProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [store, setStore] = useState("");
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(datos_envio.nombres_envio)
    const [lastName, setLastName] = useState(datos_envio.apellidos_envio)
    const [phone, setPhone] = useState(datos_envio.telefono_envio)
    const [dni, setDni] = useState(datos_envio.dni_envio)

    const [department, setDepartment] = useState(datos_envio.departamento.trim());
    const [province, setProvince] = useState(datos_envio.provincia.trim());
    const [district, setDistrict] = useState(datos_envio.distrito.trim());
    const [address, setAddress] = useState(datos_envio.direccion_envio);
    const [reference, setReference] = useState(datos_envio.referencia_envio);
    const [locationCode, setLocationCode] = useState(datos_envio.ubigeo);

    const tipo_envio = datos_envio.tipo_envio;

    const isDelivery = datos_envio.tipo_envio === 'delivery';

    // Función para guardar la información del Envío
    const handleSave = async () => {
        setLoading(true)
        const data = {
            orden,
            nombres_envio: name,
            apellidos_envio: lastName,
            telefono_envio: phone,
            referencia_envio: isDelivery ? datos_envio.referencia_envio : reference,
            direccion_envio: store,
            pais: "Perú",
            departamento: isDelivery ? datos_envio.departamento : department,
            provincia: isDelivery ? datos_envio.provincia : province,
            distrito: isDelivery ? datos_envio.distrito : district,
            dni_envio: datos_envio.dni_envio,
            servicio_envio: isDelivery ? "recojo en tienda" : "programado",
            ubigeo: isDelivery ? datos_envio.ubigeo : locationCode,
            tipo_envio: isDelivery ? "delivery" : "recojo en tienda"
        }

        if (!store) {
            toast.warning("Por favor seleccionar una Tienda")
        }


        try {
            // ACtualizar información envio
            const resultUpdateShippingInfo = await updateShippingInfo(data)


            console.log(resultUpdateShippingInfo)

            if (!resultUpdateShippingInfo.ok) {
                toast.error(resultUpdateShippingInfo.message)
                return
            }

            
            toast.success("Operación exitosa")


            setOpenEdit(false)

            setName("")
            setLastName("")
            setAddress("")
            setProvince("")
            setDepartment("")
            setPhone("")
            setReference("")
            setLocationCode("")
            setDistrict("")
            setStore("")
            setDni("")

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }


    }


    const handleOpenModalEdit = () => {
        setOpenEdit(true);
        // cargar los datos 
        setDepartment(datos_envio.departamento)
        setProvince(datos_envio.provincia)
        setDistrict(datos_envio.distrito)
    }

    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger> <div className="bg-slate-100 text-center rounded-full cursor-pointer hover:bg-slate-300 p-2" onClick={handleOpenModalEdit}><LiaUserEditSolid title="Editar Envío" size={20} /></div></DialogTrigger>
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
                                className=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}

                            />
                        </div>

                        <div className=" items-center gap-4">
                            <Label htmlFor="lastname" className="text-right text-slate-500">
                                Apellidos
                            </Label>
                            <Input
                                id="lastname"
                                className=""
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}

                            />
                        </div>

                        <div className=" items-center gap-4">
                            <Label htmlFor="dni" className="text-right text-slate-500">
                                DNI
                            </Label>
                            <Input
                                id="dni"
                                defaultValue={dni}
                                className=""
                                onChange={e => setDni(e.target.value)}
                            />
                        </div>

                        <div className=" items-center gap-4">
                            <Label htmlFor="cel" className="text-right text-slate-500">
                                Tel. / Cel.
                            </Label>
                            <Input
                                id="cel"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
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
                                    province={datos_envio.provincia.trim()}
                                    setProvince={setProvince}
                                    district={datos_envio.distrito.trim()}
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

    return (
        <>

            <div className="grid gap-4">

                <CascadingSelect
                    department={department.trim()}
                    setDepartment={setDepartment}
                    province={province.trim()}
                    setProvince={setProvince}
                    district={district.trim()}
                    setDistrict={setDistrict}
                    locationCode={locationCode}
                    setLocationCode={setLocationCode}
                />


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