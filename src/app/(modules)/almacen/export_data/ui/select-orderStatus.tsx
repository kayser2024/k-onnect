'use client'

import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface Props {
    orderStatusId: number,
    setOrderStatusId: (value: number) => void
}
export const SelectOrderStatus = ({ orderStatusId, setOrderStatusId }: Props) => {
    return (
        <Select
            value={orderStatusId.toString()}
            onValueChange={(value) => setOrderStatusId(Number(value))}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Estado" />
            </SelectTrigger>
            <SelectContent >
                <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    <SelectItem value="1">Pendiente</SelectItem>
                    <SelectItem value="2">En Preparación</SelectItem>
                    <SelectItem value="3">En Ruta</SelectItem>
                    <SelectItem value="4">Recibido Tienda</SelectItem>
                    <SelectItem value="5">Entrega Cliente</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select >
    )
}
