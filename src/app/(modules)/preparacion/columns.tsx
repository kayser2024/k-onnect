import { Checkbox } from "@/components/ui/checkbox"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"


interface Option {
    value: string;
    label: string;
}

export const columns: ColumnDef<{ order: string, destino: Option }>[] = [
    {
        id: "select",
        header: ({ table }: any) => (
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
        accessorKey: "order",
        header: "Orden",
        cell: ({ row }) => {
            return <>{row.original.order}</>
        }
    },
    {
        accessorKey: "pickupPoint",
        header: "Destino",
        cell: ({ row }) => {

            const destino = row.original.destino.label;
            return < div className="capitalize" > {destino}</div >
        }
    },
    // {
    //     accessorKey: "fecha",
    //     header: "Fecha",
    //     cell: ({ row }) => {
    //         const fecha = new Date();
    //         return (

    //             < div className="capitalize" > {format(fecha, 'dd / MM / yy')}</div >
    //         )
    //     }

    // },

]