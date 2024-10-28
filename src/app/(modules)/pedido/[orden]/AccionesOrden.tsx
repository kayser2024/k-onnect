"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { onDropObservaciones } from "@/actions/observaciones/dropObservaciones"

import { OrdenResponse } from "@/types/Orden"
import { ArrowDown, BadgeCent, Dot, Download, Handshake, MessageCircleCode, PlusCircle, Trash } from "lucide-react"
import { toast } from "sonner"

interface Orden {
    orden: OrdenResponse
    docActual: string
}

export default function AccionesOrden({ orden, docActual }: Orden) {


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

    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="bg-black text-white p-2 rounded-md">
                <ArrowDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acerca..</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownloadSalida} >
                    <Download className="mr-2 h-4 w-4" />
                    <span>Descargar Salida</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemovingObservaciones} >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Eliminar Observaciones</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}