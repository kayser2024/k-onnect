'use client'


import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useDebouncedCallback } from "use-debounce"
import { DatePickerWithRange } from "./rangeDate"
import { useState } from "react"

export default function SearchComprobante() {
    const [textSearch, setTextSearch] = useState('')

    // const searchParams = useSearchParams()
    // const pathname = usePathname()
    // const { replace } = useRouter()

    // const handleSearch = useDebouncedCallback((term: string) => {
    //     // const params = new URLSearchParams(searchParams)

    //     // if (term) {
    //     //     params.set('search', term);
    //     // } else {
    //     //     params.delete('search');
    //     // }
    //     // replace(`${pathname}?${params.toString()}`)
    // }, 300)


    // const handleInput = (type: string) => {

    //     const params = new URLSearchParams(searchParams)
    //     if (type) {
    //         if (type === 'estado_facturacion')
    //             params.set('type', 'estado_facturacion')
    //         else {
    //             params.set('type', 'orderNumber')
    //         }
    //     } else {
    //         params.delete('type')
    //     }
    //     console.log(type);
    //     replace(`${pathname}?${params.toString()}`)
    // }

    return (

        <div className="flex  justify-center gap-2">
            {/* <Input className="" onChange={(e) => handleSearch(e.target.value.trim())} placeholder="Numero de orden" /> */}
            <Input className="" onChange={(e) => setTextSearch(e.target.value.trim())} placeholder="Numero de orden" />
            <DatePickerWithRange/>
            {/* <Select defaultValue={searchParams.get('type')?.toString()} onValueChange={(e) => handleInput(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="estado_facturacion">Boleta</SelectItem>
                    <SelectItem value="orderNumber">Orden</SelectItem>
                </SelectContent>
            </Select> */}
        </div>
    )
}
