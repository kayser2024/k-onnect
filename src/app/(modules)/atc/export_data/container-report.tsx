'use client'

import React, { useState } from 'react'
import { FilterForm } from './ui/filter-form'
import { DataTable } from './data-table'

export const ContainerReport = () => {

  const [orderFilter, setOrderFilter] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <FilterForm setIncidenceFilter={setOrderFilter} setLoading={setLoading} />


      <DataTable incidenceFilter={orderFilter} loading={loading} />
    </div>
  )
}
