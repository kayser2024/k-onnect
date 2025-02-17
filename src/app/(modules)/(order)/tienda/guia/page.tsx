import React, { Suspense } from 'react'
import { Container } from './container';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Metadata } from 'next'
import { Loader } from '@/components/loader';

export const metadata: Metadata = {
    title: 'Kayser | Recepción GUIA',
    icons: '/kayser.ico'
}
const IncidenciaPage = async () => {

    const session = await auth()
    const data = session!.user
    const rolId = session!.user.RoleID
    console.log(session)

    if (!session) {
        redirect('/api/auth/signin')
    }


    return (
        <div className='px-2 mx-auto max-w-screen-xl'>

            <Suspense fallback={<Loader />}>
                <Container rolId={rolId} />
            </Suspense>
        </div>
    )
}

export default IncidenciaPage