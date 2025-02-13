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

import { PickupPoint } from '@/types/Establec'
import { CascadingSelect } from '@/components/select/CascadingSelect'

interface ModalProps {
    action: string,
    isOpenModal: boolean,
    handleSave: (action: string, data: PickupPoint, id: number) => void,
    setIsOpenModal: (value: boolean) => void,
    data: PickupPoint
    isSaving: boolean
}
export const Modal = ({ isOpenModal, handleSave, setIsOpenModal, action, data, isSaving }: ModalProps) => {

    console.log(data)
    // const [dataPickupPoint, setDataPickupPoint] = useState({
    //     PickupPointID: data.PickupPointID,
    //     Description: data.Description,
    //     District: data.District,
    //     Province: data.Province,
    //     Department: data.Department,
    //     LocationCode: data.LocationCode,
    //     Place: data.Place,
    //     Address: data.Address,
    //     CodWareHouse: data.CodWareHouse,
    //     IsActive: data.IsActive,
    //     Lat: data.Lat,
    //     Lon: data.Lon,
    //     IsAvailablePickup: data.IsAvailablePickup

    // });

    const [dataPickupPoint, setDataPickupPoint] = useState({
        ...data,
        Department: data.Department || '',
        Province: data.Province || '',
        District: data.District || '',
        LocationCode: data.LocationCode || ''
    });

    useEffect(() => {
        setDataPickupPoint({
            ...data,
            Department: data.Department || '',
            Province: data.Province || '',
            District: data.District || '',
            LocationCode: data.LocationCode || ''
        });
    }, [data]);

    const handleChange = (field: keyof PickupPoint, value: string) => {
        setDataPickupPoint((prev) => ({
            ...prev,
            [field]: value || prev[field]
        }));
    };


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
        // TODO:validar data 🚩

        // enviar data 
        handleSave(action, dataPickupPoint, data.PickupPointID)
    }

    console.log({ data, dataPickupPoint }, '🟢🟢')
    console.log({ province: dataPickupPoint.Province, district: dataPickupPoint.District })

    return (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}  >
            <DialogContent onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{action === 'create' ? 'Crear' : 'Editar'} Tienda</DialogTitle>

                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

                    {/* Dni */}
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Nombre:
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={dataPickupPoint.Description || ""}
                            onChange={e => setDataPickupPoint({ ...dataPickupPoint, Description: e.target.value })}
                            required
                        />
                    </div>


                    <CascadingSelect
                        department={dataPickupPoint.Department}
                        setDepartment={(value) => handleChange('Department', value)}
                        province={dataPickupPoint.Province}
                        setProvince={(value) => handleChange('Province', value)}
                        district={dataPickupPoint.District}
                        setDistrict={(value) => handleChange('District', value)}
                        locationCode={dataPickupPoint.LocationCode}
                        setLocationCode={(value) => handleChange('LocationCode', value)}
                    />

                    {/* Ubigeo */}
                    <div className="">
                        <Label htmlFor="locationCode" className="text-right">Ubigeo:</Label>
                        <Input
                            id="locationCode"
                            className="col-span-3"
                            value={dataPickupPoint.LocationCode || ""}
                            onChange={e => handleChange('LocationCode', e.target.value)}
                            required
                        />
                    </div>

                    {/* Dirección */}
                    <div className="">
                        <Label htmlFor="Address" className="text-right">Dirección:</Label>
                        <Input
                            id="Address"
                            className="col-span-3"
                            value={dataPickupPoint.Address || ""}
                            onChange={e => handleChange('Address', e.target.value)}
                        />
                    </div>

                    {/* Latitud */}
                    <div className="">
                        <Label htmlFor="lat" className="text-right">Latitud:</Label>
                        <Input
                            id="lat"
                            className="col-span-3"
                            value={dataPickupPoint.Lat || ""}
                            placeholder='-12.3456789'
                            onChange={e => handleChange('Lat', e.target.value)}
                        />
                    </div>

                    {/* Longitud */}
                    <div className="">
                        <Label htmlFor="lon" className="text-right">Longitud:</Label>
                        <Input
                            id="lon"
                            className="col-span-3"
                            value={dataPickupPoint.Lon || ""}
                            placeholder='-12.3456789'
                            onChange={e => handleChange('Lon', e.target.value)}
                        />
                    </div>
                    {/* Codigo Almacén */}
                    <div className="">
                        <Label htmlFor="codwhouse" className="text-right">Cod. Almacén:</Label>
                        <Input
                            id="codwhouse"
                            className="col-span-3"
                            value={dataPickupPoint.CodWareHouse || ""}
                            onChange={e => handleChange('CodWareHouse', e.target.value)}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button onClick={() => setIsOpenModal(false)} variant='outline' disabled={isSaving}>Cerrar</Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
