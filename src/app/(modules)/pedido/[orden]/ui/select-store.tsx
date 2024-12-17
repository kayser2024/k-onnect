'use client'

import React, { useState } from 'react'
import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento';


interface SelectStoreProps {
    setStore: (value: string) => void;
}
interface Option {
    label: string;
    value: string;
}
export const SelectStore = ({ setStore }: SelectStoreProps) => {

    // const [search, setSearch] = useState("");

    const promiseOptions = async (search: string): Promise<Option[]> => {
        try {
            const result = await getAllEstablecimientos(search)
            console.log(result);

            return result
        } catch (error: any) {
            console.log(error.message)
            return []
        }
    }

    const handleChange = (store: SingleValue<Option>) => {
        setStore(store!.label)
    }



    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={false}
            placeholder="Buscar Tienda"
            loadOptions={promiseOptions}
            className='w-full bg-blue-300'
            onChange={handleChange}

        />
    )
}
