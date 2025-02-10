'use client'

import React from 'react'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { getAllGuidesByEstablec } from '@/actions/guia/getGuia'

export const Container = () => {


  const { data, isLoading } = useQuery({
    queryKey: ['allGuides'],
    queryFn: async () => {
      try {

        const result = await getAllGuidesByEstablec()
        if (!result.ok) {
          return []
        }
        return result.data
      } catch (error: any) {
        toast.error(error.message)
        return []
      }
    },
    // staleTime: 1000 * 60 * 5//5minutos
  })

  console.log(data)
  return (
    <div>


      <DataTable data={data} setData={() => { }} />
      {isLoading && <Loader />}
    </div>
  )
}
