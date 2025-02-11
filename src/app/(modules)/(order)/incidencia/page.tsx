import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence, getOrdersWithIncidence } from '@/actions/order/Incidencia';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kayser | Incidencia',
    icons: '/kayser.ico'
}

const IncidenciaPage = async () => {
    const session = await auth()
    const data = session!.user

    if (!session) {
        redirect('/api/auth/signin')
    }
    const incidenciaList = await getAllIncidence();
    
    return (
        <div className='px-2 mx-auto max-w-screen-xl'>

            <h2 className='text-2xl'>Lista de Incidencia</h2>
            {/* tabla */}
            <DataTable incidentList={incidenciaList} />
        </div>
    )
}

export default IncidenciaPage