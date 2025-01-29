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
    userId: number
    setUserId: (value: number) => void
}
export const SelectUser = ({ userId, setUserId }: Props) => {


    return (
        <Select
            value={userId.toString()}
            onValueChange={(value) => setUserId(Number(value))}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Usuario" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Usuarios</SelectLabel>
                    <SelectItem value="1">ADMIN</SelectItem>
                    <SelectItem value="4">Felipe</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
