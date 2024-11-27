import React, { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { getAllEstablecimientos } from '@/actions/establecimiento/getEstablecimiento';

interface SelectEstabProps {
    setOptionSelection: (value: Option) => void;
    optionSelection: Option;
}

interface Option {
    value: string;
    label: string;
}
export const SelectEstablec = ({ setOptionSelection, optionSelection }: SelectEstabProps) => {

    const [options, setOptions] = useState<Option[]>([])

    const { data, isLoading } = useQuery({ queryKey: ['establishment'], queryFn: async () => await getAllEstablecimientos() })

    const handleChange = (selectedOption: any) => {
        console.log(selectedOption)
        setOptionSelection(selectedOption);
    }


    useEffect(() => {
        if (data) {
            const formattedOptions = data.map((point: any) => ({
                value: point.PickupPointID,
                label: point.Description,
            }));
            setOptions(formattedOptions);
        }
    }, [data]);


    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderColor: state.isFocused ? 'black' : base.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px black' : base.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? 'black' : base.borderColor,
            },
        }),
    };

    return (
        <>
            <Select
                styles={customStyles}
                className=" min-w-[250px]"
                classNamePrefix="select"
                onChange={handleChange}
                value={options.find(option => option?.label === optionSelection?.label) || null}
                options={options}
                isLoading={isLoading}
                isSearchable
                isClearable
                placeholder='Seleccionar Destino'
            />
        </>
    )
}
