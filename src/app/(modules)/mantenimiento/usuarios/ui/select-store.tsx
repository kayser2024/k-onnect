'use client'

import React from 'react'
import { loadAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento'
import { useQuery } from '@tanstack/react-query'
import Select from 'react-select'


export const SelectStore = () => {

  const { data: establecimientos, isLoading, refetch } = useQuery({
    queryKey: ['allStores'],
    queryFn: async () => await loadAllEstablecimientos()
  })

  console.log(establecimientos)

  const options = establecimientos?.data?.map((store: any) => ({
    value: store.id,
    label: store.name
  })) || []

  return (
    <div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Select
          options={options}
          placeholder="Seleccione una tienda"
        />
      )}
    </div>
  )
}
