import React, { useEffect } from 'react'
import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import provinces from '@/mock/data/provincia.json'

interface SelectProvinceProps {
    department: string
    province: string
    setProvince: (value: string) => void
    setDistrict: (value: string) => void
    setLocationCode: (value: string) => void
}

interface Option {
    label: string;
    value: string;
}

export const SelectProvince = ({ department, province, setProvince, setDistrict, setLocationCode }: SelectProvinceProps) => {

    const provincias = provinces.filter(p => { p.departamento === department }).map(pp => ({ value: pp.provincia, label: pp.inei }))

    console.log(province)


    // Filtra las provincias según el valor de búsqueda
    const filterProvinces = (inputValue: string) => {
        return provinces.filter(p =>
            p.departamento.toLocaleLowerCase() === department.toLocaleLowerCase() &&
            p.provincia.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        );
    }

    // Mapea las provincias filtradas a opciones para AsyncSelect
    const promiseOptions = async (search: string): Promise<Option[]> => {
        try {
            const filteredProvinces = filterProvinces(search); // Filtra las provincias con el término de búsqueda
            const data = filteredProvinces.map(p => ({
                label: p.provincia,
                value: p.reniec,
            }));
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Manejador de cambio de selección
    const handleChange = (province: SingleValue<Option>) => {
        if (province) {
            setProvince(province.label); // Establece la provincia seleccionada
            setDistrict("");
            setLocationCode("")
        }
    }


    useEffect(() => {
        setProvince("")
        setDistrict("")
        setLocationCode("")
    }, [department])


    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions={false}
            placeholder="Buscar Provincia"
            loadOptions={promiseOptions}
            className='w-full '
            onChange={handleChange}
            value={province ? { label: province, value: province } : null}
            isDisabled={!department}
        />
    )
}
