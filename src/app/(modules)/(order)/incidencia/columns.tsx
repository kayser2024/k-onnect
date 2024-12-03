import { Checkbox } from "@/components/ui/checkbox"
import { OptionOrder } from "@/types/Option"

import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<{ }>[] = [

    {
        accessorKey: "order",
        header: "Orden",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
    {
        accessorKey: "invoice",
        header: "Boleta",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
    {
        accessorKey: "date",
        header: "Fecha",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
    {
        accessorKey: "user",
        header: "Usuario",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
    {
        accessorKey: "type_incidence",
        header: "Motivo",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original}</>
        }
    },
]