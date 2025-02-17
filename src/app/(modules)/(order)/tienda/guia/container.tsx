'use client'
import { useEffect, useMemo, useState } from "react"
import { DataTable } from "./data-table"
import { SearchGuia } from "./ui/search-guia"
import { Loader } from "@/components/loader"
import { Detail, ResponseGuia } from "@/types/Guia"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getDataGuideOpen, getGuiasByValue } from "@/actions/guia/getGuia"
import { useSession } from "next-auth/react"

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

interface Props {
    rolId: number
}
export const Container = ({ rolId }: Props) => {
    const session = useSession()
    const whCode = session.data?.user.PickupPoints?.CodWareHouse || "";

    console.log(whCode)

    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [data, setData] = useState<Detail[]>([])
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);


    const canSelectStore = [1, 2, 7].includes(rolId)
    const [selectStore, setSelectStore] = useState(canSelectStore ? "" : whCode);
    console.log(selectStore)

    // Primero obtener la guia abierta de la tienda
    console.log(rolId)
    // const canSelectStore = [1, 2, 7].includes(rolId)


    const { data: DataGuideOpen, isLoading: isLoadingData, error: errorDataGuideOpen } = useQuery({
        queryKey: ["InitData", selectStore],
        queryFn: async () => {
            if (!selectStore) return null;


            try {
                const result = await getDataGuideOpen(selectStore);
                if (result.data?.NumberDoc && result.data?.IsOpen) {
                    setSearchValue(result.data.NumberDoc);
                    setIsGuideOpen(true);
                    return result.data;
                }
                // if (result.data && 'NumberDoc' in result.data) {
                //     setSearchValue(result.data.NumberDoc || "")
                //     setIsGuideOpen(true)
                //     return result.data;
                // }

                // Si no hay guía abierta, limpiar input y tabla
                setSearchValue("");
                setIsGuideOpen(false);
                setData([]);

            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
                return null
            }
        },
        // enabled: false
        enabled: !!selectStore, // Solo se ejecuta si selectStore está definido o el rol no es 1, 2 o 7
    })


    console.log(errorDataGuideOpen)


    const { data: dataGuias, isLoading, refetch } = useQuery({
        queryKey: ["AllGuiasBySearchValue", searchValue, selectStore],
        queryFn: async () => {

            if (!selectStore || !searchValue) {
                setIsGuideOpen(false);
                return [];
            }

            try {
                const responseGuia = await getGuiasByValue(searchValue.trim(), selectStore);
                if (!responseGuia.ok) {
                    toast.error(`${responseGuia.message}`)
                    return []
                }
                setData(responseGuia.data)

                if (responseGuia.isCompleted) {
                    toast.warning("La Guía ya se ecuentra Completado");
                    setSearchValue(""); // Limpiar el input
                    setData([]); // Limpiar la tabla
                    setIsGuideOpen(false)
                    return [];
                } else {
                    setIsGuideOpen(true)
                    return responseGuia.data
                }

            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
                setData([])
                setIsGuideOpen(false)
                return []
            }

        },
        enabled: !!selectStore && !!searchValue,
    })


    useEffect(() => {
        if (selectStore) refetch();
    }, [selectStore, refetch]);

    useEffect(() => {
        if (!isLoading && !isLoadingData) {
            setIsLoadingInitial(false);
        }
    }, [isLoading, isLoadingData]);





    const tableData = useMemo(() => data || [], [data]);


    return (

        <div className="flex flex-col gap-2">

            {/* FORMUlARIO PARA BUSCAR GUIAS */}
            {

                (
                    <>
                        <SearchGuia
                            setData={setData}
                            setLoading={setLoading}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            refetch={refetch}
                            isGuideOpen={isGuideOpen}
                            canSelectStore={canSelectStore}
                            setSelectStore={setSelectStore}
                            selectStore={selectStore}
                        />

                        {/* tabla */}
                        {
                            (isLoading || isLoadingData || isLoadingInitial)
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

                        {loading && <Loader />}
                    </>
                )
            }



        </div>
    )
}