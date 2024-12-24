import React, { useEffect } from 'react'


import AsyncSelect from 'react-select/async';
import { SingleValue } from 'react-select';
import districts from '@/mock/data/distrito.json'

interface SelectDistricProps {
    province: string
    district: string
    setDistrict: (value: string) => void
    locationCode: string
    setLocationCode: (value: string) => void
}

interface Option {
    label: string;
    value: string;
}
export const SelectDistrict = ({ province, district, setDistrict, locationCode, setLocationCode }: SelectDistricProps) => {

    const distritos = districts.filter(d => { d.provincia === province }).map(dd => ({ value: dd.distrito, label: dd.inei ?? '' }))

    // Filtra las provincias según el valor de búsqueda
    const filterDistricts = (inputValue: string) => {
        return districts.filter(p =>
            p.provincia.toLocaleLowerCase() === province.toLocaleLowerCase() &&
            p.distrito.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        );
    }


    // Mapea las Distritos filtradas a opciones para AsyncSelect
    const promiseOptions = async (search: string): Promise<Option[]> => {
        try {
            const filteredProvinces = filterDistricts(search); // Filtra las distritos con el término de búsqueda
            const data = filteredProvinces.map(p => ({
                label: `${p.inei} - ${p.distrito}`,
                value: p.inei ?? '',
            }));

            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Manejador de cambio de selección
    const handleChange = (district: SingleValue<Option>) => {
        if (district) {
            setLocationCode(district.value);
            setDistrict(district.label.split("-")[1]);
        }
    }

    useEffect(() => {
        setDistrict("")
        setLocationCode("")
    }, [province])


    // valor por defecto
    const defaultDistrict = districts.filter(d =>
        d.provincia.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === province.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") &&
        d.distrito.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === district.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    ).map(d => ({
        label: d.distrito,
        value: d.reniec || "",
    }))


    console.log({ defaultDistrict, province }, '🟡🟡')

    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions={false}
            placeholder="Buscar Provincia"
            // defaultValue={defaultDistrict}
            value={defaultDistrict}
            loadOptions={promiseOptions}
            className='w-full'
            onChange={handleChange}
        // value={district ? { label: `${locationCode} - ${district}`, value: locationCode } : null}
        // isDisabled={!province}
        />
    )
}
