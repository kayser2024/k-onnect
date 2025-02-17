'use client'
import React, { useState } from 'react'
import { getStoreByUser } from '@/actions/establecimiento/getEstablecimiento'
import { useQuery } from '@tanstack/react-query'
import Select, { MultiValue, SingleValue } from 'react-select'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/loader'


interface Props {
  setStore: (value: string) => void
}

interface Option {
  value: string;
  label: string;
}
export const SelectStore = ({ setStore }: Props) => {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga


  const { data: storeByRoles, isLoading: isFetchingStores } = useQuery({
    queryKey: ['storeByUser'],
    queryFn: async () => await getStoreByUser()
  })

  const options = storeByRoles?.data?.map((store: any) => ({
    value: store.CodWareHouse,
    label: store.Description,
  })) || []


  const handleChange = (selected: MultiValue<Option> | SingleValue<Option>) => {

    const selectedOption = selected as SingleValue<Option>
    setStore(selectedOption ? selectedOption.value : "")
  }

  // console.log(storeByRoles);

  return (
    <>


      <Select
        options={options}
        placeholder="Seleccione una tienda"
        onChange={handleChange}
        defaultValue={options[0]}
        isLoading={isLoading}

      />

      {isLoading && <Loader />} {/* Mostrar el loader */}
    </>

  )
}
