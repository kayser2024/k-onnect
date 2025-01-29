import { Checkbox } from "@/components/ui/checkbox"
import { OptionOrder } from "@/types/Option"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"


export const columnsAll: ColumnDef<any>[] = [
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
            return <>{row.original.OrderNumber}</>
        }
    },
    {
        accessorKey: "invoice",
        header: "Boleta",
        cell: ({ row }) => {
            const hasIncidence = row.original.HasIncidence
            return <div className={`relative  text-center `}>

                {row.original.Invoice}
            </div>
        }
    },
    {
        accessorKey: "pickupPoint",
        header: "Destino",
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.PickupPoint}</div>
        }
    },
    {
        accessorKey: "Date",
        header: "Fecha de envío",
        cell: ({ row }) => {
            const originalDate = new Date(row.original.CreatedAt);
            const localDate = new Date(originalDate.getTime() + (originalDate.getTimezoneOffset() * 60000));
            return <>{format(localDate, 'dd/MM/yy HH:mm:ss', { locale: es })}</>;

        }
    },
]