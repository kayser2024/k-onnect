import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence, getIncidenceByEstablishment } from '@/actions/order/Incidencia';
import { auth } from '@/auth.config';


const IncidenciaPage = async () => {

    const session = await auth()
    const data = session?.user

    const EstablishmentID = data!.pickupPointID;
    console.log({ data, EstablishmentID }, '🟢🟢🟢')

    const incidenciaList = await getAllIncidence(EstablishmentID);

    return (
        <div className=''>

            <h2 className='text-2xl'>Lista de Incidencia</h2>
            {/* tabla */}
            <DataTable incidentList={incidenciaList} EstablishmentID={EstablishmentID}/>
        </div>
    )
}

export default IncidenciaPage