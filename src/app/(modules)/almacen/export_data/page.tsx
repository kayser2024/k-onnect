
import React from 'react'

import { Metadata } from 'next'
import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { FilterForm } from './ui/filter-form'
import { ContainerReport } from './container-report'


export const metadata: Metadata = {
    title: 'ALMACEN | Reporte de órdenes',
    icons: '/kayser.ico'
}
const ExportDataPage = () => {

    const session = auth()

    if (!session) {
        redirect('/api/auth/signin')
    }

    // solo debería ver almacén y admin

    // TODO: redirecicionar una página si el rol no le pertenece🚩

    return (
        <div className='mx-auto max-w-screen-xl'>

            <ContainerReport />

        </div>
    )
}

export default ExportDataPage