"use client";

import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    ColumnFiltersState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface DataTableProps {
    orderFilter: any[] | null;
    loading: boolean;
}
export function DataTable({ orderFilter, loading }: DataTableProps) {

    const table = useReactTable({
        data: orderFilter || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        initialState: {
            pagination: {
                pageSize: 20
            },
        },
    });

    return (
        <div className="flex flex-col gap-4">

            {loading ? (
                <Loader />
            ) : (
                <table className="min-w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="border p-2 text-center">
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

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-xs md:text-sm text-muted-foreground">
                    Total Registro(s): {orderFilter?.length}
                </div>

                <div className="space-x-2 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
