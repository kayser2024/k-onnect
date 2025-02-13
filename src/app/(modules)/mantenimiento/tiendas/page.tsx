import React from 'react'
import { DataTable } from './data-table'
import { redirect } from 'next/navigation'
import { auth } from '@/auth.config'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kayser | Tiendas',
    icons: '/kayser.ico'
}

const MantenimientoEstablec = async() => {
        const session = await auth()
        const data = session!.user
    
        if (!session) {
            redirect('/api/auth/signin')
        }
    return (
        <div className='w-full mx-auto p-2 max-w-screen-xl' >


            {/* Tabla */}
            <DataTable />

        </div>
    )
}

export default MantenimientoEstablec