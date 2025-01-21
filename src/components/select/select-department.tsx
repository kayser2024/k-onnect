import React from 'react'

import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import deparments from '@/mock/data/departamento.json'


interface SelectDepartmentProps {
    department: string
    setDepartment: (value: string) => void
    setProvince: (value: string) => void
    setDistrict: (value: string) => void
    setLocationCode: (value: string) => void
}

interface Option {
    label: string;
    value: string;
}

export const SelectDepartment = ({ department, setDepartment, setProvince, setDistrict, setLocationCode }: SelectDepartmentProps) => {

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


    // valor por defecto
    const defaultDepartment = deparments.filter(d => d.departamento.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === (department.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))).map(d => ({
        label: d.departamento,
        value: d.reniec,
    }))


    console.log({ defaultDepartment }, 'DEFAULT DEPARTMENT')

    return (
        <AsyncSelect
            defaultOptions={false}
            placeholder="Buscar Departamento"
            value={defaultDepartment}
            loadOptions={promiseOptions}
            className='w-full'
            onChange={handleChange}
        />
    )
}
