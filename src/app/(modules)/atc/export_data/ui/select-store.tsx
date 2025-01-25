'use client'

import React from 'react'
import { CustomAsyncSelect } from './custom-async-select'
import { useQuery } from '@tanstack/react-query';
import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento';


interface Option {
  value: number | boolean | string | null
  label: string
}

interface FilterProps {
  pickupPointId: number | null;
  typeIncidenceId: number | null;
  isCompleted: boolean | null;
  userId: number | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
}
interface SelectStoreProps {
  handleFilterChange: (key: keyof FilterProps, value: any) => void
  value: number | null;
}
export const SelectStore = ({ handleFilterChange, value }: SelectStoreProps) => {

  const { data } = useQuery({
    queryKey: ['tiendas'],
    queryFn: async () => {
      const responseStore = await getAllEstablecimientos("")


      return responseStore.map((store: any) => { return { value: Number(store.value), label: store.label } })
    },
    staleTime: 1000 * 60 * 60 * 24
  })
  const loadTiendaOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    if (data) {
      const filteredOptions = data.filter((option: Option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOptions);
    }
  };


  return (
    <div>

      <CustomAsyncSelect
        label="Tienda"
        loadOptions={loadTiendaOptions}
        initialValue={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : null}
        value={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : { value: null, label: '---- TODO ----' }}
        onChange={(option) => handleFilterChange('pickupPointId', option?.value)}
      />
    </div>
  )
}
