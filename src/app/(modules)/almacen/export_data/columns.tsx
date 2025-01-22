

import { ColumnDef } from '@tanstack/react-table';

// Define las columnas como una constante
export const columns: ColumnDef<any>[] = [

    {
        accessorKey: 'numeroOrden',
        header: 'Orden',
        cell: ({ row }) => {
            return <div className="">
                {row.original.OrderNumber}
            </div>
        },
    },
    {
        id: "estado_facturacion",
        accessorKey: 'estado_facturacion',
        header: 'Boleta',
        cell: ({ row }) => {

            return <>{row.original.Invoice}</>
        },
    },
    {
        accessorKey: 'pickupPoint',
        header: 'Destino',
        cell: ({ row }) => {
            return <div>{row.original.PickupPoint}</div>
        },

    },

];
