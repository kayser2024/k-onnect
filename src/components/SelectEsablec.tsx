'use client'

import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento';


interface SelectEstablecProps {
    setEstablec: (value: string) => void;
}
interface Option {
    label: string;
    value: string;
}

export const SelectEstablec = ({ setEstablec }: SelectEstablecProps) => {

    const promiseOptions = async (search: string): Promise<Option[]> => {
        try {
            const result = await getAllEstablecimientos(search)

            return result
        } catch (error: any) {
            console.log(error.message)
            return []
        }
    }

    const handleChange = (store: SingleValue<Option>) => {
        setEstablec(store!.label)
    }


    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={false}
            placeholder="Buscar Tienda"
            loadOptions={promiseOptions}
            className='w-full min-w-[200px]'
            onChange={handleChange}
            noOptionsMessage={() => "No se encontraron resultados"}
            loadingMessage={() => "Cargando tiendas..."}

        />
    )
}
