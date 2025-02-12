'use client'
import { getIncidenceByOrder } from '@/actions/order/Incidencia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/helpers/convertDate'
import { useQuery } from '@tanstack/react-query'
// import { format } from 'date-fns'
import React, { useEffect } from 'react'
import { useUpdateContext } from '../UpdateContext'


interface Props {
    order: string
}
export const IncidenceComments = ({ order }: Props) => {

    console.log(order)
    const { setRefetch } = useUpdateContext()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['IncidenceComments'],
        queryFn: () => getIncidenceByOrder(order)
    })

    console.log(data)

    useEffect(() => {
        setRefetch(() => refetch);
    }, [refetch, setRefetch]);

    return (
        <Card className='mb-4'>
            <CardHeader>
                <CardTitle>Commentarios</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className='h-[150px]'>


                    <div className="bg-red flex flex-col gap-2">
                        {
                            isLoading
                                ? "Loading"
                                : data?.map((comentario: any, index: number) => (
                                    <div key={index} className='flex flex-col gap-1'>
                                        {/* {JSON.stringify(comentario, null, 2)} */}
                                        <span className="font-bold text-sm">{formatDate(comentario.CreatedAt)} - {comentario.TypesIncidence.Description}</span>
                                        <span className="text-gray-400 text-xs">{comentario.Users.Name} ({comentario.Users.Roles.Description}): {comentario.IncidenceComments || " --- "}</span>

                                    </div>
                                ))
                        }

                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
