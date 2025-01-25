import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';


// Define las columnas como una constante
export const columns: ColumnDef<any>[] = [

    {
        accessorKey: 'numeroOrden',
        header: 'Orden',
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.Orders.OrderNumber}</div>
        },
    },
    {
        id: "estado_facturacion",
        accessorKey: 'estado_facturacion',
        header: 'Boleta',
        cell: ({ row }) => {

            return <div className='text-sm'>{row.original.InvoiceOriginal}</div>
        },
    },
    {
        accessorKey: 'pickupPoint',
        header: 'Tienda',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.PickupPoints.Description}</div>
        },

    },
    {
        accessorKey: 'typeIncidence',
        header: 'Tipo',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.TypesIncidence.Description}</div>
        },

    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.IsCompleted ? "Completo" : "Pendiente"}</div>
        },

    },
    {
        accessorKey: 'User',
        header: 'Usuario',
        cell: ({ row }) => {
            return <div className='text-sm'>{row.original.Users.Name} {row.original.Users.LastName}</div>
        },

    },
    {
        accessorKey: 'Date',
        header: 'Fecha',
        cell: ({ row }) => {
            return <div className='text-sm'>{format(new Date(row.original.CreatedAt), 'dd/MM/yyyy')}</div>
        },

    },

];
