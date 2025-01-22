'use client'

import React, { useState } from 'react'
import AsyncSelect from 'react-select/async';
import { ActionMeta, SingleValue } from 'react-select';
import { getAllEstablecimientos, getListEstablecimientos } from '@/actions/establecimiento/getEstablecimiento';
import { useQuery } from '@tanstack/react-query';


interface SelectStoreProps {
    setStore: (value: string) => void;
    storeDefault?: string
}
interface Option {
    label: string;
    value: string;
}
export const SelectStore = ({ setStore, storeDefault }: SelectStoreProps) => {
    console.log(storeDefault)

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

    const handleChange = (newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
        if (newValue) {
            setStore(newValue.label!);
        }
    };

    const { data, isLoading } = useQuery(({
        queryKey: ["All Stores"],
        queryFn: async () => {
            const data = await getListEstablecimientos()
            return data
        }
    }))

    console.log(data)

    // valor por defecto

    if (isLoading) return <p>Loading Stores...</p>

    const defaultStore = data
        ? data.filter(s => s.Description === storeDefault)
            .map(s => ({
                label: `${s.Description}`,
                value: `${s.PickupPointID}`,
            }))
        : [{ label: "", value: "" }];


    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions={false}
            placeholder="Buscar Tienda"
            value={defaultStore}
            loadOptions={promiseOptions}
            className='w-full'
            onChange={handleChange}

        />
    )
}
