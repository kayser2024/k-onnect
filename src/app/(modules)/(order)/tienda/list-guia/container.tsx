'use client'

import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { getAllGuidesByEstablec, getNoteGuideByText } from '@/actions/guia/getGuia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Container = () => {

  const [searchGuide, setSearchGuide] = useState("")
  const [dataGuide, setDataGuide] = useState({})
  const [loading, setLoading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['allGuides'],
    queryFn: async () => {
      try {

        const result = await getAllGuidesByEstablec()
        if (!result.ok) {
          return []
        }
        setDataGuide(result.data)
        return result.data
      } catch (error: any) {
        toast.error(error.message)
        return []
      }
    },
    // staleTime: 1000 * 60 * 5//5minutos
  })


  const handleSearchGuide = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    try {
      const resultDataGuide = await getNoteGuideByText(searchGuide.toUpperCase().trim());

      if (!resultDataGuide.ok) {
        toast.warning('Guía no encontrada')
        return
      }
      setDataGuide(resultDataGuide.data)
      // setSearchGuide('')

      toast.success('Guía encontrada')


    } catch (error: any) {
      toast.error(error.message)
      return []
    } finally {
      setLoading(false)
    }

  }


  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-xl'>Listado de GUÍAS</h1>
      <form className="flex gap-2 shadow-md border rounded-md p-2" onSubmit={handleSearchGuide}>
        <Input placeholder='T100-1234' value={searchGuide} onChange={(e) => setSearchGuide(e.target.value)} className='uppercase' disabled={loading} />
        <Button type='submit' disabled={loading} >{loading ? "Buscando ..." : "Buscar"}</Button>
      </form>

      <DataTable data={dataGuide} setData={() => { }} />
      {isLoading && <Loader />}
      {loading && <Loader />}
    </div>
  )
}

