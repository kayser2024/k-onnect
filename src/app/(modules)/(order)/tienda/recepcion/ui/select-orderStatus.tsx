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
    optionSelect: number
    setOptionSelect: (value: number) => void
}

export const SelectOrderStatus = ({ optionSelect, setOptionSelect }: Props) => {
    return (
        <Select value={optionSelect.toString()} onValueChange={(value) => setOptionSelect(Number(value))}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
                    {/* en_ruta */}
                    <SelectItem value="3">Pendiente</SelectItem>
                    {/* recibido_tienda */}
                    <SelectItem value="4">Recepcionado</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
