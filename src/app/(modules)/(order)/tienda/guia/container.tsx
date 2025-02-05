'use client'
import { useMemo, useState } from "react"
import { DataTable } from "./data-table"
import { SearchGuia } from "./ui/search-guia"
import { Loader } from "@/components/loader"
import { Detail, ResponseGuia } from "@/types/Guia"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGuiasByValue } from "@/actions/guia/getGuia"

export const Container = () => {

    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [data, setData] = useState<Detail | []>([])

    const { data: dataGuias, isLoading, refetch } = useQuery({
        queryKey: ["AllGuiasBySearchValue",searchValue],
        queryFn: async () => {
            const responseGuia = await getGuiasByValue(searchValue.trim(), 'ALM157')
            if (!responseGuia.ok) {
                toast.error(`${responseGuia.message}`)
                return []
            }
            // setData(responseGuia.data)

            console.log(responseGuia.data)
            return responseGuia.data

        },
        // staleTime: 1000 * 60, // 1 minute
        enabled: false,        
    })



    const tableData = useMemo(() => data || [], [data]);
    return (
        <>
        </>
        // <div className="flex flex-col gap-2">
        //     {/* FORMUlARIO PARA BUSCAR GUIAS */}
        //     <SearchGuia setData={setData} setLoading={setLoading} searchValue={searchValue} setSearchValue={setSearchValue} refetch={refetch}/>


        //     {/* tabla */}
        //     {
        //         loading
        //             ? <Loader />
        //             : <DataTable data={tableData} rowSelection={rowSelection} setRowSelection={setRowSelection} refetch={refetch} />
        //     }

        // </div>
    )
}
