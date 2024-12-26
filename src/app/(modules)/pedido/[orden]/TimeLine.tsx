'use client'

import { getOneOrderLogs } from "@/actions/order/getOneOrder"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"

interface OrderProps {
    order: string,
    created_at: string
}

interface OrderLogs {
    CommentText: string
    CreatedAt: string
    ImageURL?: string | null
    LogID?: number
    OrderNumber: string
    StatusID?: number
    StatusOld?: number
    UserID?: number
    OrderStatus: { OrderID?: number, Description: string }
    Users: { Name: string, Roles: { Description: string } }
}
export const TimeLine = ({ order, created_at }: OrderProps) => {

    const orderInit: OrderLogs[] = [
        {
            CommentText: 'Orden Registrado en WINWIN',
            CreatedAt: new Date(created_at).toLocaleString(),
            ImageURL: null,
            LogID: undefined,
            OrderNumber: order,
            UserID: undefined,
            StatusID: undefined,
            StatusOld: undefined,
            OrderStatus: { OrderID: undefined, Description: 'PENDIENTE' },
            Users: { Name: "", Roles: { Description: "" } }

        },
    ]

    const { data, isLoading } = useQuery({
        queryKey: ['orderLogs'],
        queryFn: async () => {
            const orderLogs = await getOneOrderLogs(order)

            // Asegurarse de que las fechas de getOneOrder se mantengan como están
            return orderInit.concat(
                orderLogs.map((log: any) => ({
                    ...log,
                    CreatedAt: new Date(log.CreatedAt).toLocaleString('es-ES', { timeZone: 'UTC', hour12: true }), // Convertir a objeto Date sin cambiar zona
                }))
            )
        },
    })

    return (

        <ScrollArea className="h-72 ">
            <div className="p-6 sm:p-10 ">
                <div className="after:absolute flex flex-col-reverse after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0  gap-10 dark:after:bg-gray-400/20">

                    {isLoading
                        ? <>Cargando...</>
                        : <>
                            {data?.map((log: OrderLogs, i: number) =>
                                <div className="grid gap-1 text-sm relative" key={i}>
                                    <div className="aspect-square w-3 bg-[#009EE3] rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />
                                    <div className="font-semibold uppercase"> <span className="text-sm">{log.CreatedAt}</span>  ─  {log.OrderStatus.Description}</div>
                                    <div className="text-gray-500 dark:text-gray-400 tex-xs"> <span className=" "> {log?.Users?.Name || "WIN-WIN"} ({log?.Users?.Roles.Description || <>API</>})</span>: <span className="font-light italic">"{log.CommentText}"</span></div>
                                </div>

                            )}
                        </>
                    }
                </div>
            </div>
        </ScrollArea>

    )
}