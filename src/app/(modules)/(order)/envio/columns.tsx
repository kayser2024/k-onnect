import { Checkbox } from "@/components/ui/checkbox"
import { OptionOrder } from "@/types/Option"

import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<{order:string,destino:OptionOrder}>[] = [
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
            console.log(row.original)
            return <>{row.original.order}</>
        }
    },
]