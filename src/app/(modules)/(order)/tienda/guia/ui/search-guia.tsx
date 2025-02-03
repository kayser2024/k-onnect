import { getGuiasByValue } from '@/actions/guia/getGuia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Detail, ResponseGuia } from '@/types/Guia'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'


interface Props {
    setData: (value: any) => void
    setLoading: (value: boolean) => void
}
export const SearchGuia = ({ setData, setLoading }: Props) => {
    const [searchValue, setSearchValue] = useState("")
    const [enabled, setEnabled] = useState(false)


    const { data: dataGuias, isLoading, refetch } = useQuery({
        queryKey: ["AllGuiasBySearchValue"],
        queryFn: async () => {
            const responseGuia = await getGuiasByValue(searchValue.trim(), 'ALM157')
            if (!responseGuia.ok) {
                toast.error(`${responseGuia.message}`)
                return []
            }
            setData(responseGuia.data)
            console.log(responseGuia.data)
            return responseGuia.data

        },
        // staleTime: 1000 * 60, // 1 minute
        enabled: enabled
    })

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)
        if (!searchValue.trim()) {
            toast.warning('Ingrese un valor para buscar')
            setLoading(false)
            return
        }

        try {
            setEnabled(true)
            await refetch()
        } catch (error: any) {
            toast.error(error.message)
            setData([])
        } finally {
            setLoading(false)
        }
    }


    console.log(dataGuias)
    return (
        <div className='bg-slate-100 p-2 rounded-md'>
            <form className="flex gap-2 w-full" onSubmit={(e) => handleSearch(e)}>

                <div className="w-full">
                    <Label>Buscar GUIA</Label>
                    <Input placeholder='T100-1234' onChange={e => setSearchValue(e.target.value)} />
                </div>
                <Button className='mt-6' type='submit'>Buscar</Button>
            </form>


            {/* <div className="">
                <p className='text-sm'>Origen: {dataGuias && dataGuias[0] ? dataGuias[0].NameOriginWarehouse : '---'}</p>
                <p className='text-sm'>Destino: {dataGuias && dataGuias[0] ? dataGuias[0].NameDestinationWarehouse : '---'}</p>
            </div> */}

        </div>
    )
}
