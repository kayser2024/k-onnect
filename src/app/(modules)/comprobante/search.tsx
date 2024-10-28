'use client'


import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useDebouncedCallback } from "use-debounce"

export default function SearchComprobante() {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)

        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`)
    }, 150)


    const handleInput = (type: string) => {

        const params = new URLSearchParams(searchParams)
        if (type) {
            if (type === 'OSF_SERIE_DOCUMENTO')
                params.set('type', 'OSF_SERIE_DOCUMENTO')
            else {
                params.set('type', 'SS_NUMERO_ORDEN')
            }
        } else {
            params.delete('type')
        }
        console.log(type);
        replace(`${pathname}?${params.toString()}`)
    }

    return (

        <div className="flex flex-wrap justify-center gap-2">
            <Input className="w-[90vh]" onChange={(e) => handleSearch(e.target.value.trim())} placeholder="Numero de orden" />
            <Select defaultValue={searchParams.get('type')?.toString()} onValueChange={(e) => handleInput(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="OSF_SERIE_DOCUMENTO">Boleta</SelectItem>
                    <SelectItem value="SS_NUMERO_ORDEN">Orden</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
