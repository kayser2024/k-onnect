
import React from 'react'
import { redirect } from 'next/navigation'
import { OrdenResponse } from '@/types/Orden'
import { auth } from '@/auth.config';

async function fetchingData(dni: string) {

    const data: OrdenResponse = await fetch(`${process.env.WIN_WIN_URL}?documentNumber=${dni}&limit=100`, {
        method: 'GET',
        headers: {
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        }
    }).then(res => res.json())

    console.log(data);
    return data

}

async function ClientePage({ searchParams }: { searchParams: { dni?: string } }) {

    // Primero obtenemos la sesion del usuario
    const user = await auth()


    if (!user) {
        redirect('/api/auth/signin')
    }

    // Si no hay dni, retornamos un mensaje de error
    if (!searchParams.dni) {
        return <div>Sin informacion</div>
    }

    const data = await fetchingData(searchParams.dni)

    if (!data.obj) {
        return <div>Ningun DNI encontrado</div>
    }

    return (
        <>
            <p>{JSON.stringify(user)}</p>
            <div>
                Maria merino
            </div>

        </>
    )
}

export default ClientePage