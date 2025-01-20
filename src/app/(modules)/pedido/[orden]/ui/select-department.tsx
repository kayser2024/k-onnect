import React from 'react'

import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import deparments from '@/mock/data/departamento.json'


interface SelectDepartmentProps {
    setDepartment: (value: string) => void
    department: string
    setProvince: (value: string) => void
    setDistrict: (value: string) => void
    setLocationCode: (value: string) => void
}

interface Option {
    label: string;
    value: string;
}

export const SelectDepartment = ({ setDepartment, department, setProvince, setDistrict, setLocationCode }: SelectDepartmentProps) => {


    console.log(department)


    // Filtra las provincias según el valor de búsqueda
    const filterProvinces = (inputValue: string) => {
        return deparments.filter(p =>
            p.departamento.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        );
    }

    // Mapea las provincias filtradas a opciones para AsyncSelect
    const promiseOptions = async (search: string): Promise<Option[]> => {
        try {
            const filteredProvinces = filterProvinces(search); // Filtra las provincias con el término de búsqueda
            const data = filteredProvinces.map(p => ({
                label: p.departamento,
                value: p.reniec,
            }));
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Manejador de cambio de selección
    const handleChange = (departament: SingleValue<Option>) => {
        if (departament) {
            setDepartment(departament.label); // Establece la provincia seleccionada
            setProvince("");
            setDistrict("");
            setLocationCode("");
        }
    }




    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions={false}
            placeholder="Buscar Departamento"
            loadOptions={promiseOptions}
            className='w-full'
            onChange={handleChange}
            value={department ? { label: department, value: department } : null}
        />
    )
}
