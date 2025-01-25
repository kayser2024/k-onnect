import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { CustomAsyncSelect } from './custom-async-select'
import { getAllUsers, getUsersByRol } from '@/actions/usuario/mantenimientoUser'


interface Option {
  value: string | boolean | number | null
  label: string
}
interface FilterProps {
  pickupPointId: number | null;
  typeIncidenceId: number | null;
  isCompleted: boolean | null;
  userId: number | null;
  startDate: Date;
  endDate: Date;
}

interface SelectUserProps {
  handleFilterChange: (key: keyof FilterProps, value: any) => void
  value: number | null
}
export const SelectUser = ({ handleFilterChange, value }: SelectUserProps) => {
  const { data } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const responseUsers = await getUsersByRol(4)

      return responseUsers.map((u: any) => ({ value: u.UserID, label: u.Name }))
    },
    // staleTime: 1000 * 60 * 60 * 24
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
        label="Usuario"
        loadOptions={loadTiendaOptions}

        initialValue={value !== null ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : { value: null, label: '---- TODO ----' }}
        value={value !== null ? { value, label: data?.find((option: Option) => option.value === value)?.label || '---- TODO ----' } : { value: null, label: '---- TODO ----' }}


        onChange={(option) => handleFilterChange('userId', option?.value)}
      />
    </div>
  )
}
