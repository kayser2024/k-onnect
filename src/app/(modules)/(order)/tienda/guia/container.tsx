'use client'
import { useEffect, useMemo, useState } from "react"
import { DataTable } from "./data-table"
import { SearchGuia } from "./ui/search-guia"
import { Loader } from "@/components/loader"
import { Detail, ResponseGuia } from "@/types/Guia"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getDataGuideOpen, getGuiasByValue } from "@/actions/guia/getGuia"

interface GuideData {
    NoteGuideID: number;
    NumberDoc: string | null;
    UserID: number;
    PickupPointID: number;
    Observation: string | null;
    IsOpen: boolean;
    CreatedAt: Date;
    UpdatedAt: Date | null;
    IsCompleted: boolean;
}
export const Container = () => {

    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [data, setData] = useState<Detail[]>([])
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    // Primero obtener la guia abierta de la tienda


    const { data: dataGuias, isLoading, refetch, isRefetching, isFetching } = useQuery({
        queryKey: ["AllGuiasBySearchValue", searchValue],
        queryFn: async () => {

            if (searchValue.trim() === '') {
                setIsGuideOpen(false);
                return []
            }
            const responseGuia = await getGuiasByValue(searchValue.trim(), 'ALM157')
            if (!responseGuia.ok) {
                toast.error(`${responseGuia.message}`)
                return []
            }

            setData(responseGuia.data)

            if (responseGuia.isCompleted) {
                toast.warning("La Guía ya se ecuentra Completado");
                setData([])
                // setIsGuideCompleted(true)
                setIsGuideOpen(false)
                return [];
            } else {
                // setIsGuideCompleted(false)
                setIsGuideOpen(true)
                return responseGuia.data
            }
            // console.log(responseGuia.data)

        },
        // staleTime: 1000 * 60, // 1 minute
        enabled: false,
        initialData: []
    })

    const { data: DataGuideOpen, isLoading: isLoadingData } = useQuery({
        queryKey: ["InitData"],
        queryFn: async () => {

            const result = await getDataGuideOpen();
            if (result.data && 'NumberDoc' in result.data) {
                setSearchValue(result.data.NumberDoc || "")
                setIsGuideOpen(true)

            } else {
                setIsGuideOpen(false)
            }
            console.log(result.data)

            // setData(result.data)
            return result.data
        },
        // enabled: false
    })


    useEffect(() => {
        if (DataGuideOpen) {
            refetch().finally(() => setIsLoadingInitial(false));
        }
    }, [DataGuideOpen, refetch]);


    const tableData = useMemo(() => data || [], [data]);
    return (

        <div className="flex flex-col gap-2">
            {/* FORMUlARIO PARA BUSCAR GUIAS */}
            {
                isLoadingInitial
                    ? (<Loader />)
                    : (
                        <>
                            <SearchGuia
                                setData={setData}
                                setLoading={setLoading}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                refetch={refetch}
                                isGuideOpen={isGuideOpen}
                            />

                            {/* tabla */}
                            {
                                isLoading
                                    ? <Loader />
                                    : <DataTable
                                        data={tableData}
                                        rowSelection={rowSelection}
                                        setRowSelection={setRowSelection}
                                        refetch={refetch}
                                        guide={searchValue}
                                        setData={setData}
                                        setIsGuideOpen={setIsGuideOpen}
                                    />
                            }

                        </>
                    )
            }

        </div>
    )
}