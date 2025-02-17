import React from 'react'
import { DataTable } from './table'
import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Kayser | Mant. Usuario',
    icons: '/kayser.ico'
}
const MantenimientoUsers = async () => {
    const session = await auth()

    console.log(session)

    if (!session) {
        redirect('/api/auth/signin')
    }


    return (
        <div className='p-2 mx-auto w-full max-w-screen-xl'>


            {/* Tabla */}
            <DataTable />

        </div>
    )
}

export default MantenimientoUsers