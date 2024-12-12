
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";


interface RowData {
    OrderNumber: string;
    Invoice: string;
    TypeIncidenceCount: number;
    TotalRefundSum: number;
    PickupPoint: string;
    OrderID: number;
}

export const columns = (getDetailOrder: (OrderProps: number) => void): ColumnDef<RowData, any>[] => [
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
                        getDetailOrder(Number(row.original.OrderID));
                    }
                }}
                className="text-blue-500 "
            >
                {row.getIsExpanded() ? '➖' : '➕'}
            </button>
        ),
    },
    {
        id: 'OrderNumber',
        accessorFn: (row) => row.OrderNumber,
        header: "Orden",
        cell: ({ row }) => {
            console.log({ data: row.original }, 'ORIGINAL')
            return <Link href={`/pedido/${row.original.OrderNumber}`} target="_blank" className="text-blue-500 font-semibold hover:bg-slate-300 p-2 rounded-md" title="Abrir enlace">{row.original.OrderNumber}</Link>
        }
    },
    {
        id: 'Invoice',
        accessorFn: (row) => row.Invoice,
        header: "Bol. / Fact. Original",
        cell: ({ row }) => {
            return <div className="text-center w-[100px]">{row.original.Invoice}</div>
        }
    },
    {
        id: 'TypeIncidenceCount',
        accessorFn: (row) => row.TypeIncidenceCount,
        header: "# Incidencias",
        cell: ({ row }) => {
            return <div className="text-center">{row.original.TypeIncidenceCount}</div>
        }
    },
    {
        id: 'PickupPoint',
        accessorFn: (row) => row.PickupPoint,
        header: "Destino",
        cell: ({ row }) => {
            return <div className="text-center">{row.original.PickupPoint}</div>
        }
    },
    {
        id: 'TotalRefundSum',
        accessorFn: (row) => row.TotalRefundSum,
        header: "Total Rembolso",
        cell: ({ row }) => {
            return <div className="flex items-center justify-between w-[100px]"><span>S/</span> {row.original.TotalRefundSum || <span>0.00</span>}</div>
        }
    },
]