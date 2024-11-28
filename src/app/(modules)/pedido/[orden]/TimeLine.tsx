'use client'

import { getOneOrder } from "@/actions/order/getOneOrder"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/helpers/convertDate"
import { useQuery } from "@tanstack/react-query"

interface OrderProps {
    order: string
}


const orderLogs = [
    {
        estado: "PREPARACION",
        fecha: "2023-03-14 11:45:00",
        observaciones: "La orden fue recibida"
    },
    {
        estado: "EN RUTA",
        fecha: "2023-03-14 11:45:00",
        observaciones: "La orden fue recibida"
    },
    {
        estado: "RECIBIDO TIENDO",
        fecha: "2023-03-14 11:45:00",
        observaciones: "La orden fue recibida"
    },
    {
        estado: "RECEPCION TIENDA",
        fecha: "2023-03-14 11:45:00",
        observaciones: "La orden fue recibida"
    },
    {
        estado: "ENTREGA CLIENTE",
        fecha: "2023-03-14 11:45:00",
        observaciones: "La orden fue recibida"
    },
]
interface OrderLogs {
    CommentText: string
    CreatedAt: Date
    ImageURL: string | null
    LogID: number
    OrderNumber: string
    StatusID: number
    StatusOld: number
    UserID: number
    OrderStatus: { OrderID: number, Description: string }
}
export const TimeLine = ({ order }: OrderProps) => {

    const { data, isLoading } = useQuery({
        queryKey: ['orderLogs'],
        queryFn: async () => await getOneOrder(order)
    })


    // Traer todo el historial de cada orden

    console.log({ isLoading, data }, '👀🚩')

    return (
        <ScrollArea className="h-72">
            <div className="p-6 sm:p-10">
                <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-10 dark:after:bg-gray-400/20">

                    {isLoading
                        ? <>Cargando...</>
                        :
                        <>


                            {data.map((log: OrderLogs) =>
                                <div className="grid gap-1 text-sm relative">
                                    <div className="aspect-square w-3 bg-[#009EE3] rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />
                                    <div className="font-semibold uppercase"> <span className="text-sm">{formatDate(new Date(log.CreatedAt).toISOString())}</span> - {log.OrderStatus.Description}</div>
                                    <div className="text-gray-500 dark:text-gray-400 tex-xs">{log.CommentText}</div>
                                </div>

                            )}

                        </>

                    }


                </div>
            </div>
        </ScrollArea>
    )
}