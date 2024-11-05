"use client";
import React, { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    ColumnFiltersState,
    getPaginationRowModel,


} from "@tanstack/react-table";
import { columns } from "./columns";
import { fetchingAllData } from "./fetchingData";
import { format } from "date-fns";
import SearchComprobante from "./search";
import { Button } from "@/components/ui/button";

export function TableComprobantes() {
    const hoy = format(new Date(), "yyyy-MM-dd");

    const [loading, setLoading] = useState(false);
    const [comprobantes, setComprobantes] = useState(null);
    const [startDate, setStartDate] = useState(hoy);
    const [endDate, setEndDate] = useState(hoy);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [searchPedido, setSearchPedido] = useState("");
    const [searchBoleta, setSearchBoleta] = useState("");

    // Cargar datos al montar el componente
    const loadData = async () => {
        setLoading(true);
        try {
            console.log({ startDate, endDate }, "🚩🚩");
            const data = await fetchingAllData(startDate, endDate);
            setComprobantes(data.ordenes);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(); // Cargar datos al montar el componente
    }, []); // Dependencias para cargar datos cuando cambian las fechas

    useEffect(() => {
        const filters = [];
        if (searchBoleta) {
            filters.push({ id: "estado_facturacion", value: searchBoleta });
        }
        if (searchPedido) {
            filters.push({ id: "numeroOrden", value: searchPedido });
        }
        setColumnFilters(filters);
    }, [searchBoleta, searchPedido]);

    const table = useReactTable({
        data: comprobantes || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getFilteredSelectedRowModel:getFilteredRowModel(),

        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 20, // Set the default page size to 20
            },
        },
    });

    if (loading) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga
    }


    console.log({ searchBoleta, searchPedido });

    return (
        <div className="flex flex-col gap-4">
            <SearchComprobante
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onLoadData={loadData}
                loading={loading}
                setSearchBoleta={setSearchBoleta}
                setSearchPedido={setSearchPedido}
                searchPedido={searchPedido}
                searchBoleta={searchBoleta}
            />

            <table className="min-w-full border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="border p-2 text-center">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border p-2 text-center">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="flex items-center justify-end space-x-2 py-4">

                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
