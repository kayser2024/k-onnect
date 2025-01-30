
import { ResponseAllIncidence } from "@/types/IncidenceDB";
import { ColumnDef } from "@tanstack/react-table"
import { Download } from "lucide-react";
import Link from "next/link";


interface RowData {
    OrderID: number;
    OrderNumber: string;
    Invoice: string;
    TypeIncidenceCount: number;
    TotalRefundSum: number;
    PickupPoint: string;
}

export const columns = (getDetailOrder: (OrderProps: number) => void, handleDownLoadDetail: (id: number) => void): ColumnDef<ResponseAllIncidence, any>[] => [
    {
        id: 'expander',
        header: () => null, // No encabezado para la columna del expander
        cell: ({ row, table }: any) => {
            console.log(row.original)
            const StoreReceived = row.original.SReceivedDate
            if (!StoreReceived) {
                return <></>
            }
            return <button
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
            </button >

        }
    },
    {
        id: 'OrderNumber',
        accessorFn: (row) => row.OrderNumber,
        header: "ORDEN",
        cell: ({ row }) => {
            // console.log({ data: row.original }, 'ORIGINAL')
            return <Link href={`/pedido/${row.original.OrderNumber}`} target="_blank" className="text-blue-500 font-semibold hover:bg-slate-300 p-2 rounded-md" title="Abrir enlace">{row.original.OrderNumber}</Link>
        }
    },
    {
        id: 'Invoice',
        accessorFn: (row) => row.Invoice,
        header: "BOL./FACT. Original",
        cell: ({ row }) => {
            return <div className="text-xs text-center w-[200px]">{row.original.Invoice}</div>
        }
    },
    {
        id: 'TypeIncidenceCount',
        accessorFn: (row) => row.TypeIncidenceCount,
        header: "# CANT.",
        cell: ({ row }) => {
            return <div className="text-center w-[100px] md:w-[100px]">{row.original.TypeIncidenceCount}</div>
        }
    },
    {
        id: 'PickupPoint',
        accessorFn: (row) => row.PickupPoint,
        header: "DESTINO",
        cell: ({ row }) => {
            return <div className="text-xs w-[200px] md:w-[250px] truncate">{row.original.PickupPoint}</div>
        }
    },
    {
        id: 'Received',
        header: "RECEPCIÓN",
        cell: ({ row }) => {
            const isReceived = row.original.SReceivedDate;
            let textLabel
            if (isReceived) {
                textLabel = "RECIBIDO"
            } else {
                textLabel = "PENDIENTE"
            }

            return <div className="text-xs text-center w-[100px] md:[100px] truncate">{textLabel}</div>
        }
    },
    {
        id: 'TotalRefundSum',
        // accessorFn: (row) => row.TotalRefundSum,
        header: "",
        cell: ({ row }) => {
            const id = Number(row.original.OrderID);




            return <div className="flex items-center justify-between cursor-pointer" title="Descargar Detalle" onClick={() => handleDownLoadDetail(id)}> <Download color="green" size={20} /></div >
        }
    },

]