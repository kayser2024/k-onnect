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


    // valor por defecto
    const defaultProvince = provinces.filter(d => (
        d.departamento.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === department.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) &&
        d.provincia.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === province.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    ).map(d => ({
        label: d.provincia,
        value: d.reniec,
    }))


    console.log({ provinces, defaultProvince, department, province }, '🔴🔴🔴')

    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions={false}
            // defaultValue={defaultProvince}
            value={defaultProvince}
            placeholder="Buscar Distrito"
            loadOptions={promiseOptions}
            className='w-full '
            onChange={handleChange}
        // value={province ? { label: province, value: province } : null}
        // isDisabled={!department}
        />
    )
}
