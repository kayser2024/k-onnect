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

const PickUpPoints = [
    {
        PickupID: "1",
        PickupUpName: 'Establecimiento 1',
    },
    {
        PickupID: "2",
        PickupUpName: 'Establecimiento 2',
    },
    {
        PickupID: "3",
        PickupUpName: 'Establecimiento 3',
    }
]

interface SelectEstabProps {
    setOptionSelection: (value: string) => void;
    optionSelection: string;
}

export const SelectEstablec = ({ setOptionSelection, optionSelection }: SelectEstabProps) => {


    return (
        <Select onValueChange={setOptionSelection} value={optionSelection}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Destino" />
            </SelectTrigger>
            <SelectContent >
                <SelectGroup>
                    {
                        PickUpPoints.map(point => (
                            <SelectItem key={point.PickupID} value={point.PickupID}>
                                {point.PickupUpName}
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
