

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// Define las columnas como una constante
export const columns: ColumnDef<any>[] = [

    {
        accessorKey: 'numeroOrden',
        header: 'Orden',
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.OrderNumber}</div>
        },
    },
    {
        id: "estado_facturacion",
        accessorKey: 'estado_facturacion',
        header: 'Boleta',
        cell: ({ row }) => {

            return <div className='text-sm'>{row.original.Invoice}</div>
        },
    },
    {
        accessorKey: 'pickupPoint',
        header: 'Destino',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.PickupPoint}</div>
        },

    },
    {
        accessorKey: 'user',
        header: 'Usuario',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.Users.Name}</div>
        },

    },
    {
        accessorKey: 'date',
        header: 'Fecha Carga',
        cell: ({ row }) => {
            const date = new Date(row.original.CreatedAt);
            // Ajustar la fecha a UTC-5
            const adjustedDate = new Date(date.getTime() + 5 * 60 * 60 * 1000);
            return <div className='text-sm'>{format(adjustedDate, 'dd/MM/yy HH:mm:ss', { locale: es })}</div>
        },

    },

];
