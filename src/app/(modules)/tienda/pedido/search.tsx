'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from 'use-debounce'

export default function SearchPedido() {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()


    const handleSearch = useDebouncedCallback((term: string) => {

        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleInput = (type: string) => {

        const params = new URLSearchParams(searchParams)
        if (type) {
            if (type === 'documentNumber')
                params.set('type', 'documentNumber')
            else if (type === 'customerPhone') {
                params.set('type', 'customerPhone')
            }
            else {
                params.set('type', 'orderNumber')
            }
        } else {
            params.delete('type')
        }
        console.log(type);
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap justify-center gap-2">
            <Input className="w-[90vh]" defaultValue={searchParams.get('search')?.toString()} onChange={(e) => handleSearch(e.target.value)} placeholder="Numero de orden" />
            <Select defaultValue={searchParams.get('type')?.toString()} onValueChange={(e) => handleInput(e.trim())}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="orderNumber">Orden</SelectItem>
                    <SelectItem value="documentNumber">Dni</SelectItem>
                    <SelectItem value="customerPhone">Telefono</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )

}