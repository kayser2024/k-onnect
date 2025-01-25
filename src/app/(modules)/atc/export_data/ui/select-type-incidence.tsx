import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { CustomAsyncSelect } from './custom-async-select'
import { getAllTypeIncidence } from '@/actions/type-incidence/get-type-incidence'


interface Option {
  value: string | number | boolean | null
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

interface SelectTypeIncidenceProps {
  handleFilterChange: (key: keyof FilterProps, value: any) => void
  value: number | null;
}
export const SelectTypeIncidence = ({ handleFilterChange, value }: SelectTypeIncidenceProps) => {
  const { data } = useQuery({
    queryKey: ['TypesIncidence'],
    queryFn: async () => {
      const responseTypesIncidence = await getAllTypeIncidence()

      return responseTypesIncidence.data.map((typeIncidence: any) => ({ value: typeIncidence.TypeIncidenceID, label: typeIncidence.Description }))

    },
    staleTime: 1000 * 60 * 60 * 24
  })
  const loadTiendaOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    // Simula una llamada a la API
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
        label="Tipo"
        loadOptions={loadTiendaOptions}
        initialValue={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : null}
        value={value ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : { value: null, label: '---- TODO ----' }}
        onChange={(option) => handleFilterChange('typeIncidenceId', option?.value)}
      />
    </div>
  )
}
