import { ColumnDef } from '@tanstack/react-table';
import { Orden } from '@/types/Orden';
import Link from 'next/link';
import { format } from 'date-fns';

// Define las columnas como una constante
export const columns: ColumnDef<Orden>[] = [
    {
        accessorKey: 'fechaPedido',
        header: 'Fecha Pedido',
        cell: ({row})=>{

            return <>
            {format(row.original.cabecera_pedido[0].fecha_pedido,'dd / MM / yy')}
            </>
        },
    },
    {
        accessorKey: 'fechaFacturacion',
        header: 'Fecha Facturación',
        cell: ({ row }) => {
            const fecha = row.original.situacion_facturacion[0].fecha_envio_facturacion;
            if (fecha) {
                return format(fecha, 'dd / MM / yy');
            } else {
                return '-- / -- / --';
            }
        },
    },
    {
        id:"estado_facturacion",
        accessorKey: 'estado_facturacion',
        header: 'Boleta',
        cell: ({ row }) => {
            return <>{row.original.situacion_facturacion[0].estado_facturacion}</>
        },
        filterFn: (row, id, value) => {
            const estado = row.original.situacion_facturacion[0]?.estado_facturacion; // Obtiene el valor de estado_facturacion
            return estado ? estado.toLowerCase().includes(value.toLowerCase()) : false; // Filtra el valor basado en el texto de búsqueda
        },
    },
    {
        accessorKey: 'numeroOrden',
        header: 'Orden',
        cell: ({ row }) => {
            const nro_orden=row.original.cabecera_pedido[0].numero_orden;
            return <Link href={`/pedido/${nro_orden}`} className="text-blue-700 font-bold">
                {nro_orden}
            </Link>
        },
        filterFn: (row, id, value) => {
            const estado = row.original.cabecera_pedido[0].numero_orden; // Obtiene el valor de estado_facturacion
            return estado ? estado.toLowerCase().includes(value.toLowerCase()) : false; // Filtra el valor basado en el texto de búsqueda
        },
    },
    {
        accessorKey: 'link_doc1',
        header: 'PDF',
        cell: ({row}) => {
            const link = row.original.situacion_facturacion[0].link_doc1;
            return link ? (
                <a href={link} target='_blank' className="bg-black text-white p-2 rounded-lg flex justify-center">
                    Ver Boleta
                </a>
            ) : (
                <span className="bg-gray-300 text-gray-500 p-2 rounded-lg pointer-events-none">
                    No Disponible
                </span>
            );
        },
    },
];
