"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { fetchingAllData } from "./fetchingData";
import { format } from "date-fns";
// import SearchComprobante from "./search";
import { Button } from "@/components/ui/button";
// import TableSkeleton from "../pedido/tableSkeleton";
import { toast } from "sonner";
import SearchComprobante from "./comprobante/search";
import TableSkeleton from "./pedido/tableSkeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SearchFilter from "./search-filter";
import SearchMain from "./search";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TableMain() {
  const hoy = new Date();

  const [loading, setLoading] = useState(false);
  const [comprobantes, setComprobantes] = useState(null);
  const [startDate, setStartDate] = useState(hoy);
  const [endDate, setEndDate] = useState(hoy);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchPedido, setSearchPedido] = useState("");
  const [searchBoleta, setSearchBoleta] = useState("");
  const [searchDNI, setSearchDNI] = useState("");
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [data, setData] = useState([]);
  const [statusPayment, setStatusPayment] = useState('pagado');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Cargar datos al montar el componente
  const loadData = async () => {

    setLoading(true);
    try {
      const data = await fetchingAllData(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"), statusPayment);
      setData(data.ordenes);
      setComprobantes(data.ordenes);
      setTotalRegistros(data.totalRegistros);
      return data.ordenes;
    } catch (error: any) {
      console.error("Error al obtener datos:", error);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const queryClient = useQueryClient();

  const { data: data_ordenes, isLoading, isError } = useQuery({
    queryKey: ['data_ordenes'],
    queryFn: loadData,
    initialData: comprobantes,
  })


  useEffect(() => {
    const filters = [];
    if (searchBoleta) {
      filters.push({ id: "estado_facturacion", value: searchBoleta });
    }
    if (searchPedido) {
      filters.push({ id: "numeroOrden", value: searchPedido });
    }
    if (searchDNI) {
      filters.push({ id: "nro_doc", value: searchDNI });
    }
    setColumnFilters(filters);
  }, [searchBoleta, searchPedido, searchDNI]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 24,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchMain
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setData={setData}
        statusPayment={statusPayment}
        setTotalRegistros={setTotalRegistros}
        setStatusPayment={setStatusPayment}
        onLoadData={loadData}
        loading={loading}
      />

      <ScrollArea className="h-[350px] md:h-[450px] w-full rounded-md border p-4">
        <SearchFilter
          setSearchBoleta={setSearchBoleta}
          setSearchPedido={setSearchPedido}
          searchPedido={searchPedido}
          searchBoleta={searchBoleta}
          searchDNI={searchDNI}
          setSearchDNI={setSearchDNI}
        />
        {loading ? (
          <TableSkeleton />
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border p-2 sm:p-1 text-center text-sm">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
        )}
        <ScrollBar orientation="horizontal" />

      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-xs md:text-sm text-muted-foreground">
         Total Registro(s): {totalRegistros}
        </div>


        <div className="space-x-2 flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="" />
          </Button>

          <div className="text-sm text-muted-foreground">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="" />

          </Button>
        </div>
      </div>
    </div>
  );
}
