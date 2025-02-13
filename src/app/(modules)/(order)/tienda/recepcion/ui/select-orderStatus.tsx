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
    optionSelect: string
    setOptionSelect: (value: string) => void
}

export const SelectOrderStatus = ({ optionSelect, setOptionSelect }: Props) => {
    return (
        <Select value={optionSelect.toString()} onValueChange={(value) => setOptionSelect(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
                    {/* en_ruta */}
                    <SelectItem value="1">Todo</SelectItem>
                    {/* recibido_tienda */}
                    <SelectItem value="2">Pendiente</SelectItem>
                    <SelectItem value="3">Recepcionado</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
