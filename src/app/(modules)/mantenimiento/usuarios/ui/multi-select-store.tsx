'use client'

import React, { useState } from 'react'
import { loadAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento'
import { useQuery } from '@tanstack/react-query'
import Select, { MultiValue, SingleValue } from 'react-select'
import { FanIcon } from 'lucide-react'

interface Props {
  rolId: number,
  setStore: (value: number | number[]) => void
}

interface Option {
  value: string;
  label: string;
  isDisabled?: boolean;
}
export const MultiSelectStore = ({ rolId, setStore }: Props) => {

  const [selectedStores, setSelectedStores] = useState<Option[]>([])

  const { data: establecimientos, isLoading } = useQuery({
    queryKey: ['allStores'],
    queryFn: async () => await loadAllEstablecimientos()
  })

  const options = establecimientos?.data?.map((store: any) => ({
    value: store.PickupPointID,
    label: store.Description,
    isDisabled: store.Description === 'DELIVERY'
  })) || []

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      maxHeight: '100px', // Limitar la altura del control
      overflowY: 'auto' // Habilitar el desplazamiento vertical
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    })
  }
  const handleChange = (selected: MultiValue<Option> | SingleValue<Option>) => {
    if (rolId === 7) {
      const selectedOptions = selected as MultiValue<Option>
      setSelectedStores([...selectedOptions])
      setStore(selectedOptions.map((option: Option) => Number(option.value)))
    } else {
      const selectedOption = selected as SingleValue<Option>
      setSelectedStores(selectedOption ? [selectedOption] : [])
      setStore(selectedOption ? Number(selectedOption.value) : 0)
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Select
          options={options}
          placeholder="Seleccione una tienda"
          isMulti={rolId === 7}
          styles={customStyles}
          onChange={handleChange}
          value={selectedStores}

        />
      )}
    </div>
  )
}
