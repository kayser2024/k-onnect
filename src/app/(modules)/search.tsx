"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { DatePickerWithRange } from "./rangeDate";
import { toast } from "sonner";
import { fetchMain } from "@/actions/fetch";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SearchMainProps {
    startDate: Date;
    setStartDate: (date: Date) => void;
    endDate: Date;
    setEndDate: (date: Date) => void;
    onLoadData: () => void;
    loading: boolean;
    setData: (data: any) => void;
    setTotalRegistros: (data: number) => void;
    statusPayment: string;
    setStatusPayment: (data: string) => void;
}
export default function SearchMain({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onLoadData,
    loading,
    setData,
    statusPayment,
    setStatusPayment,
    setTotalRegistros,
}: SearchMainProps) {
    const [isExact, setIsExact] = useState(false);
    const [boleta, setBoleta] = useState("");
    const [orden, setOrden] = useState("");
    const [dni, setDni] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // llamar a la api por la busqueda exacta

    const handleSearchExact = async (boleta = "", orden = "", dni = "") => {
        if (boleta.trim() === "" && orden.trim() === "" && dni.trim() === "") {
            toast.error("Ningún campo debe ser vacío");
            return;
        }

        if (boleta.trim().length > 0 && boleta.trim().length < 8) {
            toast.error("El número de boleta debe tener al menos 8 dígitos");
            return;
        }

        if (orden.trim().length > 0 && orden.trim().length < 4) {
            toast.error("El número de orden debe tener al menos 4 dígitos");
            return;
        }

        if (dni.trim().length > 0 && dni.trim().length < 8) {
            toast.error("El número de dni debe tener al menos 8 dígitos");
            return;
        }

        if (orden.startsWith('ss17') && orden.length < 8) {
            toast.error('Por favor intente ingresar otro tipo de boleta')
            return;
        }

        try {
            setIsFetching(true);
            const data = await fetchMain(boleta.toUpperCase(), orden, dni);
            setData(data);
            setTotalRegistros(data.length);
        } catch (error: any) {
            toast.error("No se encontraron resultados para la búsqueda");
            setTotalRegistros(0);
            return setData([]);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="flex flex-col  justify-center gap-2 border p-4 bg-blue-50 rounded-md">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-4 md:flex md:flex-row ">
                    <div className="flex items-center space-x-2">
                        <Select
                            defaultValue="pagado"
                            value={statusPayment}
                            onValueChange={setStatusPayment}
                            disabled={loading || isExact}

                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Seleccionar estado de Pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Estado de Pago</SelectLabel>
                                    <SelectItem value="pagado">Pagado</SelectItem>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DatePickerWithRange
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        isExact={isExact}
                        loading={loading}
                        className="w-full"
                    />

                    {/* Button Cargar Datos */}
                    <Button
                        variant="default"
                        onClick={onLoadData}
                        disabled={loading || isExact}
                    >
                        {loading ? (<><Loader2 className="animate-spin" /> Cargando ...</>) : ("Cargar Datos")}
                    </Button>
                </div>
                {/* SWITCH Busqueda Exacta */}
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Switch
                        id="airplane-mode"
                        checked={isExact}
                        onCheckedChange={() => setIsExact(!isExact)}
                    />
                    <Label htmlFor="airplane-mode">Busqueda Exacta</Label>
                </div>
            </div>

            <hr className="divide-x-2"></hr>
            <div className="flex flex-col md:flex-row gap-4">

                {/* Input Boleta */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="boleta">Boleta :</Label>
                    <Input
                        className=""
                        id="boleta"
                        value={boleta}
                        onChange={(e) => setBoleta(e.target.value)}
                        placeholder="# Boleta ..."
                        disabled={!isExact}
                    />
                </div>

                {/* Input Nro Orden */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="orden">Orden :</Label>
                    <Input
                        className=""
                        id="orden"
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                        placeholder="# Orden..."
                        disabled={!isExact}
                    />
                </div>
                {/* <Input className="" value={orden} onChange={(e) => setOrden(e.target.value)} placeholder="# Orden ..." disabled={!isExact} /> */}

                {/* Input DNI */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="dni">DNI :</Label>
                    <Input
                        className=""
                        id="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="# DNI ..."
                        disabled={!isExact}
                    />
                </div>

                {/* Button Buscar */}
                <Button
                    className="mt-5"
                    variant="default"
                    onClick={() => handleSearchExact(boleta, orden, dni)}
                    disabled={!isExact || isFetching}
                >
                    {isFetching ? (<><Loader2 className="animate-spin" />Buscando...</>) : ("Buscar")}
                </Button>
            </div>
        </div>
    );
}
