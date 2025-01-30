import { Checkbox } from "@/components/ui/checkbox"

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
        header: "ORDEN",
        cell: ({ row }) => {
            return <>{row.original.OrderNumber}</>
        }
    },
    {
        accessorKey: "invoice",
        header: "BOL. / FACT.",
        cell: ({ row }) => {
            return <div className={`relative  text-center `}>{row.original.Invoice}</div>
        }
    },
    {
        accessorKey: "pickupPoint",
        header: "DESTINO ORIGINAL",
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.PickupPoint}</div>
        }
    },
    {
        accessorKey: "status",
        header: "RECEPCIÓN",
        cell: ({ row }) => {
            // console.log(row.original)
            let statusLabel = row.original.StatusID
            if (row.original.StatusID === 2) {
                statusLabel = "Preparación"
            }
            if (row.original.StatusID === 3) {
                statusLabel = "Pendiente"
            }
            if (row.original.StatusID === 4) {
                statusLabel = "Recepcionado"
            }

            return <div className="text-sm">{statusLabel}</div>
        }
    },
    {
        accessorKey: "Date",
        header: "FEC. ENVÍO",
        cell: ({ row }) => {
            const originalDate = new Date(row.original.CreatedAt);
            const localDate = new Date(originalDate.getTime() + (originalDate.getTimezoneOffset() * 60000));
            return <>{format(localDate, 'dd/MM/yy HH:mm:ss', { locale: es })}</>;
        }
    },
    {
        accessorKey: "DateRegister",
        header: "FEC. RECEP.",
        cell: ({ row }) => {
            const originalDate = new Date(row.original.SReceivedDate);
            if (!row.original.SReceivedDate) {
                return <>--/--/--</>;
            }
            const localDate = new Date(originalDate.getTime() + (originalDate.getTimezoneOffset() * 60000));
            return <>{format(localDate, 'dd/MM/yy HH:mm:ss', { locale: es })}</>;
        }
    },
]