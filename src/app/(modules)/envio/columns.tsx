import { Checkbox } from "@/components/ui/checkbox"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

interface EstatusOrden {
    order: string
    status: string
    fecha: string
}

export const columns: ColumnDef<EstatusOrden>[] = [
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
            return <>{row.original}
            </>
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
            <div className="capitalize">Pendiente</div>
        ),
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => {
            const fecha = new Date();
            return (

                < div className="capitalize" > {format(fecha, 'dd / MM / yy')}</div >
            )
        }

    },

    // {
    //     id: "actions",
    //     header: "Acción",
    //     enableHiding: false,
    //     cell: ({ row }) => {

    //         return (
    //             <>Eliminar</>
    //         )
    //     },
    // },
]