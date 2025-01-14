import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence } from '@/actions/order/Incidencia';


const IncidenciaPage = async () => {

    const incidenciaList = await getAllIncidence();

    return (
        <div className=''>

            <h2 className='text-2xl'>Lista de Incidencia</h2>
            {/* tabla */}
            <DataTable incidentList={incidenciaList} />
        </div>
    )
}

export default IncidenciaPage