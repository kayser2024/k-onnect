'use client'
import { useState } from "react"
import { DataTable } from "./data-table"
import { SearchGuia } from "./ui/search-guia"
import { Loader } from "@/components/loader"
import { Detail, ResponseGuia } from "@/types/Guia"
import { useQuery } from "@tanstack/react-query"

export const Container = () => {

    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState<Detail | []>([])

    return (
        <div className="flex flex-col gap-2">
            {/* FORMUlARIO PARA BUSCAR GUIAS */}
            <SearchGuia setData={setData} setLoading={setLoading} />


            {/* tabla */}
            {
                loading
                    ? <Loader />
                    : <DataTable data={data} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            }

        </div>
    )
}
