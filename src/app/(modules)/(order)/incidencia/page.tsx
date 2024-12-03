import React from 'react'
import { DataTable } from './data-table'
import { getAllIncidence } from '@/actions/order/Incidencia';



const incidentList = [
    {},
    {}
]
const IncidenciaPage = async () => {

    const incidenciaList = await getAllIncidence();
    console.log({ incidenciaList }, '🚩')

    return (
        <div>

            <h2 className='text-2xl'>Lista de Incidencia</h2>
            {/* tabla */}
            <DataTable incidentList={incidentList} />
        </div>
    )
}

export default IncidenciaPage