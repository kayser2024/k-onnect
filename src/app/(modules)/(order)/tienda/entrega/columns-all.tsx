import { Checkbox } from "@/components/ui/checkbox"
import { OptionOrder } from "@/types/Option"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

interface responseData {
    OrderID: number,
    OrderNumber: string,
    Invoice: string,
    OrderCreatedAtUTC: Date,
    StatusID: number,
    UserID: number,
    PickupPointID: number,
    PickupPoint: string,
    InfoShippingID: number,
    DataFacturationID: number,
    HasIncidence: boolean,
    QtyIncidence: number,
    UserUpdaterID: number,
    CreatedAt: Date,
    UpdatedAt: Date,
    WHSendDate: Date | null,
    SReceivedDate: Date | null,
    SDispatchedDate: Date | null,
}
export const columnsAll: ColumnDef<responseData>[] = [
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
        header: "NRO. ORDEN",
        cell: ({ row }) => {
            return <>{row.original.OrderNumber}</>
        }
    },
    {
        accessorKey: "invoice",
        header: "BOLETA",
        cell: ({ row }) => {
            return <>{row.original.Invoice}</>
        }
    },
    {
        accessorKey: "receivedDate",
        header: "FEC. RECEPCIÓN",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{format(new Date(row.original.SReceivedDate || ""), 'dd-MM-yyyy hh:mm')}</>
        }
    },
    {
        accessorKey: "dispatechedDate",
        header: "FEC. ENTREGA",
        cell: ({ row }) => {
            const dispatechedDate = row.original.SDispatchedDate;
            if (!dispatechedDate) {
                return <>--/--/--</>
            }
            return <>{format(new Date(row.original.SDispatchedDate || ""), 'dd-MM-yyyy hh:mm')}</>

        }
    },
]