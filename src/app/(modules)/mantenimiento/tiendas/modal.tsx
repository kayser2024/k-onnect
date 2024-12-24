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
    handleSave: (action: string, data: PickupPoint) => void,
    setIsOpenModal: (value: boolean) => void,
    data: PickupPoint
    isSaving: boolean
}
export const Modal = ({ isOpenModal, handleSave, setIsOpenModal, action, data, isSaving }: ModalProps) => {


    const initialData = {
        PickupPointID: 0,
        Description: '',
        District: '',
        Province: '',
        Department: '',
        LocationCode: '',
        Place: '',
        Address: '',

    }

    const [dataPickupPoint, setDataPickupPoint] = useState<PickupPoint>({
        PickupPointID: data.PickupPointID,
        Description: data.Description,
        District: data.District,
        Province: data.Province,
        Department: data.Department,
        LocationCode: data.LocationCode,
        Place: data.Place,
        Address: data.Address,
    });


    const handleChange = (field: keyof PickupPoint, value: string) => {
        setDataPickupPoint((prev) => ({ ...prev, [field]: value }));
    };


    useEffect(() => {
        if (data) {
            setDataPickupPoint({
                PickupPointID: data.PickupPointID,
                Description: data.Description,
                District: data.District,
                Province: data.Province,
                Department: data.Department,
                LocationCode: data.LocationCode,
                Place: data.Place,
                Address: data.Address,
            });
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

        // enviar data 
        handleSave(action, dataPickupPoint)
    }

    console.log({ data, dataPickupPoint }, '🟢🟢')

    return (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}  >
            <DialogContent onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{action === 'create' ? 'Crear' : 'Editar'} Tienda</DialogTitle>

                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

                    {/* Dni */}
                    <div className="">
                        <Label htmlFor="dni" className="text-right">
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
                        department={`${dataPickupPoint.Department}`}
                        setDepartment={(value) => handleChange('Department', value)}
                        province={dataPickupPoint.Province || ""}
                        setProvince={(value) => handleChange('Province', value)}
                        district={dataPickupPoint.District || ""}
                        setDistrict={(value) => handleChange('District', value)}
                        locationCode={dataPickupPoint.LocationCode || ""}
                        setLocationCode={(value) => handleChange('LocationCode', value)}
                    />

                    {/* Ubigeo */}
                    <div className="">
                        <Label htmlFor="lastName" className="text-right">Ubigeo:</Label>
                        <Input
                            id="lastName"
                            className="col-span-3"
                            value={dataPickupPoint.LocationCode || ""}
                            onChange={e => setDataPickupPoint({ ...dataPickupPoint, LocationCode: e.target.value })}
                            required
                        />
                    </div>

                    {/* Dirección */}
                    <div className="">
                        <Label htmlFor="lastName" className="text-right">Dirección:</Label>
                        <Input
                            id="lastName"
                            className="col-span-3"
                            value={dataPickupPoint.Address || ""}
                            onChange={e => setDataPickupPoint({ ...dataPickupPoint, Address: e.target.value })}
                            required
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
