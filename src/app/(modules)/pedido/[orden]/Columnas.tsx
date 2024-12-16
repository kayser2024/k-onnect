"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { DetallePedido } from "@/types/Orden"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<DetallePedido>[] = [
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
            const img = row.original.url_imagen_sku;
            return <img src={img} alt="foto" className="rounded-lg max-h-28" />
        }
    },
    {
        accessorKey: "descripcion",
        header: "Descripción",
        cell: ({ row }) => {


            const { categoria, title, sku, atributo1_titulo, atributo1_valor, atributo2_titulo, atributo2_valor, sub_categoria } = row.original
            return <div>
                <h3 className="text-xs  text-gray-400">{categoria} / {sub_categoria}</h3>
                <h2 className="text-normal truncate max-w-[200px]" title={title}>{title}</h2>
                <p className="text-xs text-gray-400">{sku}</p>
                <p className="text-xs text-gray-400">{atributo1_titulo}: {atributo1_valor}</p>
                <p className="text-xs text-gray-400">{atributo2_titulo}: {atributo2_valor}</p>
            </div>
        }
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        cell: ({ row }) => {
            const cantidad = row.original.quantity_sku
            return <>{cantidad}</>
        }
    },
    {
        accessorKey: "precio",
        header: "Precio",
        cell: ({ row }) => {
            const price = row.original.price;
            const sale_price = row.original.sale_price;
            return <div className="flex flex-col gap-2">
                <p className="text-xs line-through">S/.{Number(price)?.toFixed(2)}</p>
                <p className="font-xs text-sm">S/.{Number(sale_price)?.toFixed(2)}</p>

            </div>
        }
    },
]
