import React from 'react'
import { Container } from './container';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kayser | Recepción GUIA',
    icons: '/kayser.ico'
}
const IncidenciaPage = async () => {

    const session = await auth()
    const data = session!.user

    if (!session) {
        redirect('/api/auth/signin')
    }


    return (
        <div className='px-2 mx-auto max-w-screen-xl'>

            <Container />
        </div>
    )
}

export default IncidenciaPage