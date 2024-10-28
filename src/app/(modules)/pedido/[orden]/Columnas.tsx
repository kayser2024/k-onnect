"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

export type ProductoTable = {
    foto: string
    descripcion: string
    cantidad: number
    precio: number,
    subTotal: number
}

export const columns: ColumnDef<ProductoTable>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "foto",
        header: "Foto",
        cell: ({ row }) => {
            const img = row.getValue("foto") as string
            return <img src={img} alt="foto" className="rounded-lg max-h-28" />
        }
    },
    {
        accessorKey: "descripcion",
        header: "Descripción",
        cell: ({ row }) => {
            const [categoria, title, sku, atributo1_titulo, atributo1_valor, atributo2_titulo, atributo2_valor] = row.original.descripcion.split(',')
            return <div>
                <h3 className="text-sm  text-gray-400">{categoria}</h3>
                <h2 className="text-lg">{title}</h2>
                <p className="text-sm text-gray-400">{sku}</p>
                <p className="text-sm text-gray-400">{atributo1_titulo}: {atributo1_valor}</p>
                <p className="text-sm text-gray-400">{atributo2_titulo}: {atributo2_valor}</p>
            </div>
        }
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
    },
    {
        accessorKey: "precio",
        header: "Precio",
        cell: ({ row }) => {
            const precio = row.getValue("precio") as string
            return <p>S/.{Number(precio)?.toFixed(2)}</p>
        }
    },
    {
        accessorKey: "subTotal",
        header: "Subtotal",
        cell: ({ row }) => {
            const subtotal = row.getValue("subTotal") as string
            return <p>S/.{Number(subtotal)?.toFixed(2)}</p>
        }
    },
]
