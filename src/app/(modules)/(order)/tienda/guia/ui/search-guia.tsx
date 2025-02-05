import { getGuiasByValue } from '@/actions/guia/getGuia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Detail, ResponseGuia } from '@/types/Guia'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'


interface Props {
    searchValue: string,
    setSearchValue: (value: string) => void,
    setData: (value: Detail | []) => void
    setLoading: (value: boolean) => void
    refetch: () => Promise<QueryObserverResult<Detail[]>>
}
export const SearchGuia = ({ setData, setLoading, refetch, searchValue, setSearchValue }: Props) => {

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)
        if (!searchValue.trim()) {
            toast.warning('Ingrese un valor para buscar')
            setLoading(false)
            return
        }

        try {
            const result = await refetch()
            console.log(result)
            // setData(result.data | [])
        } catch (error: any) {
            toast.error(error.message)
            setData([])
        } finally {
            setLoading(false)
        }
    }


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
