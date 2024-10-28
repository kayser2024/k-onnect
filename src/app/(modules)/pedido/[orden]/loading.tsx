import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {

    return (

        <main className="p-2" >

            <section className="grid grid-cols-2 gap-5">

                <div className="flex flex-col gap-2 w-full">

                    {
                        Array(5).fill(0).map(index => (
                            <Skeleton key={index} className='h-[250px] ' />
                        ))
                    }
                </div>
                {/* SECCION */}
                <div className='flex flex-col gap-2 w-full'>
                    {
                        Array(6).fill(0).map(index => (
                            <Card key={index} className="flex flex-col  gap-2 p-1">

                                <Skeleton className=' mx-2 h-[25px]' />

                                <Skeleton className=' mx-2 h-[15px] ' />
                                <Skeleton className=' mx-2 h-[25px] ' />
                                <Skeleton className=' mx-2 h-[15px] ' />
                                <Skeleton className=' mx-2 h-[25px] ' />

                                <Skeleton className=' mx-2 h-[45px] ' />
                            </Card>
                        ))
                    }
                </div>

            </section>


        </main >
    )
}

export default Loading