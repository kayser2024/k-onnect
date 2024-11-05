'use client'

import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./rangeDate"
import { Button } from "@/components/ui/button"


interface SearchComprobanteProps {
    startDate: Date;
    setStartDate: (date: Date) => void;
    endDate: Date;
    setEndDate: (date: Date) => void;
    onLoadData: () => void;
    loading: boolean;
    searchPedido: string;
    setSearchPedido: (pedido: string) => void;
    searchBoleta: string;
    setSearchBoleta: (boleta: string) => void;
}
export default function SearchComprobante({ startDate, setStartDate, endDate, setEndDate, onLoadData, loading, searchPedido, setSearchPedido, searchBoleta, setSearchBoleta }: SearchComprobanteProps) {


    return (

        <div className="flex  justify-center gap-2">
            <Input className="" value={searchBoleta} onChange={(e) => setSearchBoleta(e.target.value.trim())} placeholder="Buscar Boleta..." />
            <Input className="" value={searchPedido} onChange={(e) => setSearchPedido(e.target.value.trim())} placeholder="Buscar Orden..." />
            <DatePickerWithRange startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            <Button variant='default' onClick={onLoadData} disabled={loading}>{loading ? "cargando..." : "Cargar Datos"}</Button>
        </div>
    )
}
