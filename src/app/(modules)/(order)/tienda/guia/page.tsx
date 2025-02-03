import React from 'react'
import { getAllIncidence, getIncidenceByEstablishment } from '@/actions/order/Incidencia';
import { auth } from '@/auth.config';
import { ResponseAllIncidence } from '@/types/IncidenceDB';
import { DataTable } from './data-table';
import { Container } from './container';


const IncidenciaPage = async () => {

    const session = await auth()
    const data = session!.user

    return (
        <div className='px-2 mx-auto max-w-screen-xl'>

            <Container />
        </div>
    )
}

export default IncidenciaPage