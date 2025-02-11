import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence, getIncidenceByEstablishment } from '@/actions/order/Incidencia';
import { auth } from '@/auth.config';
import { ResponseAllIncidence } from '@/types/IncidenceDB';
import { redirect } from 'next/navigation';


const IncidenciaPage = async () => {

    const session = await auth()
    const data = session!.user

    if (!session) {
        redirect('/api/auth/signin')
    }

    const EstablishmentID = data!.PickupPointID || 0;

    const incidenciaList: ResponseAllIncidence[] = await getAllIncidence(EstablishmentID);

    return (
        <div className='px-2 mx-auto max-w-screen-xl'>

            <h2 className='text-2xl'>Lista de Incidencia</h2>
            {/* tabla */}
            <DataTable incidentList={incidenciaList || []} EstablishmentID={EstablishmentID} />
        </div>
    )
}

export default IncidenciaPage