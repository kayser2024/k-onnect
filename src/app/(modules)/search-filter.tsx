'use client';

import { Input } from '@/components/ui/input';
import React from 'react'
interface SearchFilterProps {
    searchPedido: string;
    setSearchPedido: (pedido: string) => void;
    searchBoleta: string;
    setSearchBoleta: (boleta: string) => void;
    searchDNI: string;
    setSearchDNI: (dni: string) => void;
}
const SearchFilter = ({ searchBoleta, searchPedido, setSearchBoleta, setSearchPedido, searchDNI, setSearchDNI }: SearchFilterProps) => {
    return (
        <div className='flex gap-4 mb-4 mt-4 mx-2'>
            <Input className="" value={searchBoleta} onChange={(e) => setSearchBoleta(e.target.value.trim())} placeholder="Filtrar por Boleta..." />
            <Input className="" value={searchPedido} onChange={(e) => setSearchPedido(e.target.value.trim())} placeholder="Filtrar por Orden..." />
            <Input className="" value={searchDNI} onChange={(e) => setSearchDNI(e.target.value.trim())} placeholder="Filtrar por DNI..." />
        </div>
    )
}

export default SearchFilter