"use client"
import { useDebounce } from "@uidotdev/usehooks";
import * as React from "react"
import { Check, ChevronsUpDown, EyeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { OSF_Product_bk } from "@prisma/client";
import AccionCopiar from "@/components/Pedido/AccionCopiar";
import useDebouncer from "@/hooks/useDebouncer";

export default function ComboboxDemo() {
    const [open, setOpen] = React.useState(false)
    const [frameworks, setFrameworks] = React.useState<OSF_Product_bk[]>();
    const [value, setValue] = React.useState("")

    const debouncedValue = useDebouncer(value, 500);


    React.useEffect(() => {

        console.log('ENTRADO A LA PETICION');
        const fetchData = async () => {
            const res = await fetch(`/api/producto/buscador?buscado=${value}`)
            const data = await res.json()
            console.log(data)
            setFrameworks(data)
        }

        if (debouncedValue) {
            fetchData()
        }
    }, [debouncedValue]);

    return (
        <div>
            <div className="mb-2">
                {
                    (() => {
                        if (frameworks && frameworks.length > 0) {
                            const res = frameworks[0];
                            return <div className="flex gap-2">
                                <div>
                                    <img className="max-h-28 rounded-lg" src={`${res.url_foto}`} alt={res.codigoEan} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Codigo Sap</p>
                                    <AccionCopiar className="text-sm " texto={`${res.codigoSap}`} />
                                    <p className="text-sm text-gray-400">Codigo Ean</p>
                                    <AccionCopiar className="text-sm " texto={`${res.codigoEan}`} />
                                    <a className="flex items-center my-2" target="_blank" href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${res.codigoEan}&tab=detail&page=1`}>
                                        <EyeIcon  size={20}/>
                                        Ver stock en Tutati
                                    </a>
                                </div>
                            </div>
                        } else {
                            return <p>No se encontraron resultados</p>
                        }
                    })()
                }
            </div>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            aria-label="Boton Combobox"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value || "Buscar Pedido por Ean"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput className="EanCambiar" onValueChange={(e) => setValue(e)} placeholder="Busqueda Pedido..." />
                            <CommandEmpty>Producto No encontrado</CommandEmpty>
                            <CommandGroup>
                                {frameworks?.map((framework) => (
                                    <CommandItem
                                        key={`${framework.codigoEan}-${framework.codigoSap}`}
                                        value={`${framework.codigoEan}`}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {`${framework.codigoEan} - ${framework.codigoSap}`}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>)
}