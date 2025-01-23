import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence, getOrdersWithIncidence } from '@/actions/order/Incidencia';


const IncidenciaPage = async () => {

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