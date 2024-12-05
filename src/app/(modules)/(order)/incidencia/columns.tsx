import { Checkbox } from "@/components/ui/checkbox"
import { OptionOrder } from "@/types/Option"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";


export const columns = (
    getDetailOrder: (OrderProps: number) => void
): ColumnDef<{ OrderNumber: string, Invoice: string, TypeIncidenceCount: number, TotalRefundSum: number, PickupPoint: string }>[] => [
        {
            id: 'expander',
            header: () => null, // No encabezado para la columna del expander
            cell: ({ row, table }: any) => (
                <button
                    onClick={() => {
                        const isCollapsed = row.getIsExpanded();

                        // Contrae todas las demás filas antes de expandir la actual
                        table.toggleAllRowsExpanded(false);

                        // Solo expande la fila actual si estaba colapsada
                        if (!isCollapsed) {
                            row.toggleExpanded();
                            getDetailOrder(row.original.OrderID);
                        }
                    }}
                    className="text-blue-500 "
                >
                    {row.getIsExpanded() ? '➖' : '➕'}
                </button>
            ),
        },
        {
            accessorKey: "order",
            header: "Orden",
            cell: ({ row }) => {
                return <Link href={`/pedido/${row.original.OrderNumber}`} target="_blank" className="text-blue-500 font-semibold hover:bg-slate-300 p-2 rounded-md" title="Abrir enlace">{row.original.OrderNumber}</Link>
            }
        },
        {
            accessorKey: "invoice",
            header: "Boleta",
            cell: ({ row }) => {
                return <div className="text-center">{row.original.Invoice}</div>
            }
        },
        {
            accessorKey: "quantity",
            header: "# Incidencias",
            cell: ({ row }) => {
                return <div className="text-center">{row.original.TypeIncidenceCount}</div>
            }
        },
        {
            accessorKey: "total",
            header: "Total Rembolso",
            cell: ({ row }) => {
                return <div className="flex items-center justify-between w-[100px]"><span>S/</span> {row.original.TotalRefundSum || <span>0.00</span>}</div>
            }
        },
    ]