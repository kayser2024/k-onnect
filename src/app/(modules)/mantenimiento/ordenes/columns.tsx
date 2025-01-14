import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/helpers/convertDate"
import { Order } from "@/types/OrderDb"

import { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { RotateCcw } from "lucide-react"


export const columns = (handleOpenAlert: (oderId: number, orderNumber: string) => void): ColumnDef<Order>[] => [

    {
        accessorKey: "order",
        header: "Orden",
        cell: ({ row }) => {
            console.log(row.original)
            return <>{row.original.OrderNumber}</>
        }
    },
    {
        accessorKey: "status",
        header: "Estado Actual",
        cell: ({ row }) => {
            type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "info";
            let badge: BadgeVariant = "outline";
            let estado = row.original.StatusID as number
            let estadoName = ""
            if (estado == 1) { estadoName = "Pendiente"; badge = 'default' }
            if (estado == 2) { estadoName = "Preparación"; badge = 'outline' }
            if (estado == 3) { estadoName = "En Ruta"; badge = 'info' }
            if (estado == 4) { estadoName = "Recepción"; badge = 'warning' }
            if (estado == 5) { estadoName = "Entregado"; badge = 'success' }

            return (
                <Badge variant={badge}>{estadoName}</Badge>
            )
        }
    },
    {
        accessorKey: "pickupPoint",
        header: "Destino",
        cell: ({ row }) => {
            const destino = row.original.PickupPoint;
            return <div className="text-xs md:text-sm w-[200px]  md:w-[300px] truncate">{destino}</div>
        }
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Fec. Creación",
    //     cell: ({ row }) => {

    //         // Crear el objeto Date directamente con la fecha de la base de datos
    //         const date = new Date(row.original.CreatedAt);

    //         const created = format(date, "dd-MMM-yy hh:mm a");
    //         return <>{created}</>
    //     }
    // },
    {
        accessorKey: "UpdateAt",
        header: "Fec. Actualización",
        cell: ({ row }) => {
            const date = new Date(row.original.UpdatedAt); // Crear un objeto Date
            const formattedDate = date.toISOString(); // Convertirla a una cadena ISO nuevamente
            const fecha = formatDate(formattedDate)
            return <div className="text-xs md:text-sm w-[150px] truncate md:w-[200px]">{fecha}</div>
        }
    },
    {
        accessorKey: "action",
        header: "Acción",
        cell: ({ row }) => {
            const orderId = row.original.OrderID
            const status = row.original.StatusID
            const orderNumber = row.original.OrderNumber
            const disabled = status == 2
            console.log({ disabled, status })
            return (
                <>
                    <Button variant='destructive' onClick={() => handleOpenAlert(orderId, orderNumber)} disabled={status == 2} title="Resetear"> <RotateCcw />Resetear</Button >

                </>
            )
        }
    },
]