'use client'

import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./rangeDate"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

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
    const [isExact, setIsExact] = useState(false)

    return (

        <div className="flex flex-col  justify-center gap-2">
            <div className="flex gap-4">
                <DatePickerWithRange startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} isExact={isExact} />
                <Button variant='default' onClick={onLoadData} disabled={loading || isExact}>{loading ? "Cargando ..." : "Cargar Datos"}</Button>
                <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" checked={isExact} onCheckedChange={() => setIsExact(!isExact)} />
                    <Label htmlFor="airplane-mode">Busqueda Exacta</Label>
                </div>
            </div>

            <hr className="divide-x-2"></hr>
            <div className="flex gap-4">

                <Input className="" value={searchBoleta} onChange={(e) => setSearchBoleta(e.target.value.trim())} placeholder="# Boleta ..." disabled={!isExact} />
                <Input className="" value={searchPedido} onChange={(e) => setSearchPedido(e.target.value.trim())} placeholder="# Orden ..." disabled={!isExact} />
                <Input className="" placeholder="# DNI ..." disabled={!isExact} />
                <Button variant='default' onClick={() => { }} disabled={!isExact}>Buscar</Button>


            </div>
        </div>
    )
}
