'use client'

import React from 'react'
import { CustomAsyncSelect } from './custom-async-select'
import { useQuery } from '@tanstack/react-query';


interface Option {
  value: boolean | number | string | null;
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

const data = [
  {
    label: "Pendiente",
    value: false
  },
  {
    label: "Completado",
    value: true
  }
]
interface SelectStatusIncidenceProps {
  handleFilterChange: (key: keyof FilterProps, value: any) => void
  value: boolean | null
}
export const SelectStatusIncidence = ({ handleFilterChange, value }: SelectStatusIncidenceProps) => {

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
        label="Estado"
        loadOptions={loadTiendaOptions}
        initialValue={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : null}
        value={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : null}
        onChange={(option) => handleFilterChange('isCompleted', option?.value)}

      />
    </div>
  )
}
