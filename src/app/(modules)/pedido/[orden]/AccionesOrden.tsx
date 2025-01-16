"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { onDropObservaciones } from "@/actions/observaciones/dropObservaciones"

import { OrdenResponse } from "@/types/Orden"
import { ArrowDown, BadgeCent, CircleDot, CircleEllipsis, Dot, Download, EllipsisVertical, Handshake, MessageCircleCode, PlusCircle, Replace, Trash, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { ModalIncidence } from "./ui/modal-incidence"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getIncidenceByOrder } from "@/actions/order/Incidencia"

interface Orden {
    orden: OrdenResponse
    docActual: string
}

export default function AccionesOrden({ orden, docActual }: Orden) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDropMenu, setIsOpenDropMenu] = useState(false)


    const handleDownloadSalida = () => {

        let salida = "Origen;CodProducto;Cantidad;Destino;CodigoTransaccion;Tipo;attr\n"
        const detallePedido = orden.obj.ordenes[0].detalle_pedido

        detallePedido.forEach(prod => {
            salida += `k033;${prod.sku};${prod.quantity_sku};k001;${docActual};Venta Externa;1\n`
        })

        console.log(salida);

        // lo descargamos como csv
        const blob = new Blob([salida], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${docActual}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success("Salida descargada")

    }

    const handleRemovingObservaciones = async () => {
        onDropObservaciones(orden.obj.ordenes[0].cabecera_pedido[0].numero_orden)
        toast.success('Eliminando Observaciones')
    }

    // obtener incidencia de la orden || pedido
    const { data, isLoading, refetch, isPending } = useQuery({
        queryKey: ['incidenceByInvoice', docActual],
        queryFn: async () => await getIncidenceByOrder(orden.obj.ordenes[0].cabecera_pedido[0].numero_orden),
        enabled: false
    })


    // Funcion para mostrar incidencias del pedido/orden
    const handleShowIncidences = async () => {
        setIsOpen(true)
        setIsOpenDropMenu(false)

        refetch()
    }


    return (
        <>
            <DropdownMenu onOpenChange={setIsOpenDropMenu} open={isOpenDropMenu}>
                <DropdownMenuTrigger className=" p-2 rounded-full bg-slate-100 hover:bg-slate-200 aspect-square">
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDownloadSalida} >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Descargar Salida</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRemovingObservaciones} >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Eliminar Observ.</span>
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem onClick={handleRemovingObservaciones} >
                    
                        <Replace className="mr-2 h-4 w-4" />
                        <span>Cambio y Devoluc.</span>
                    </DropdownMenuItem> */}

                    <DropdownMenuItem onClick={handleShowIncidences} >
                        <TriangleAlert className="mr-2 h-4 w-4" />
                        <span>Mostrar Incidencias</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ModalIncidence isOpen={isOpen} setIsOpen={setIsOpen} data={data} isLoading={isPending} />
        </>

    )
}