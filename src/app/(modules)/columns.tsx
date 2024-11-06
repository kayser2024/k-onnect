import { ColumnDef } from '@tanstack/react-table';
import { Orden } from '@/types/Orden';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
// import { Badge } from 'lucide-react';

// Define las columnas como una constante
export const columns: ColumnDef<Orden>[] = [
    {
        header: "Nombre Cliente",
        cell: ({ row }) => {
            const nombre = row.original.datos_facturacion[0].nombres_facturacion
            return <p className='text-sm text-left'>{nombre.toUpperCase()}</p>
        }
    },
    {
        accessorKey: 'nro_doc',
        header: "Nro Doc",
        cell: ({ row }) => {
            const nro_doc = row.original.datos_facturacion[0].id_cliente
            return <p className='text-sm text-left'>{nro_doc}</p>
        },
        filterFn: (row, id, value) => {
            const estado = row.original.datos_facturacion[0].id_cliente; // Obtiene el valor de estado_facturacion
            return estado ? estado.toLowerCase().includes(value.toLowerCase()) : false; // Filtra el valor basado en el texto de búsqueda
        },
    },
    {
        accessorKey: 'fechaPedido',
        header: 'Fecha Pedido',
        cell: ({ row }) => {
            let fecha = format(row.original.cabecera_pedido[0].fecha_pedido, 'dd / MM / yy')
            return (
                <p className='text-sm'>
                    {fecha}
                </p>
            )
        },
    },
    {
        accessorKey: '',
        header: 'Estado Pago',
        cell: ({ row }) => {
            let estado_pago = row.original.situacion_pagos[0].estado_pago;
            let varianteColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";

            if (estado_pago === 'pendiente') varianteColor = 'outline';
            else if (estado_pago === 'cancelado') varianteColor = 'destructive';
            else if (estado_pago === 'pagado') varianteColor = 'success';
            else varianteColor = 'default';

            return (

                <Badge variant={varianteColor}>
                    {estado_pago}
                </Badge>
            )

        }

    },
    {
        accessorKey: 'fechaFacturacion',
        header: 'Fecha Facturación',
        cell: ({ row }) => {
            let fecha = row.original.situacion_facturacion[0].fecha_envio_facturacion
            if (fecha === '') {
                fecha = '-- / -- / --'
                return fecha
            }
            fecha = format(fecha, 'dd / MM / yy');

            return (
                <p className='text-sm'>
                    {fecha}
                </p>
            )
        },
    },
    {
        id: "estado_facturacion",
        accessorKey: 'estado_facturacion',
        header: 'Boleta',
        cell: ({ row }) => {


            let estado = row.original.situacion_facturacion[0].estado_facturacion;
            let varianteColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";

            if (estado === 'activo') varianteColor = 'info';
            else if (estado === 'cancelado') varianteColor = 'destructive';
            else if (estado === 'pagado') varianteColor = 'success';
            else if (estado === 'pendiente') varianteColor = 'outline';
            else varianteColor = 'default';

            return (

                <Badge variant={varianteColor}>
                    {estado}
                </Badge>
            )
            // return <>{row.original.situacion_facturacion[0].estado_facturacion}</>
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
            console.log(row.original)
            const nro_orden = row.original.cabecera_pedido[0].numero_orden;
            return <Link href={`/pedido/${nro_orden}`} className="text-blue-700 font-bold text-sm">
                {nro_orden}
            </Link>
        },
        filterFn: (row, id, value) => {
            const estado = row.original.cabecera_pedido[0].numero_orden; // Obtiene el valor de estado_facturacion
            return estado ? estado.toLowerCase().includes(value.toLowerCase()) : false; // Filtra el valor basado en el texto de búsqueda
        },
    },
    {
        accessorKey: '',
        header: 'Estado de Pedido',
        cell: ({ row }) => {

            let estado_pedido = row.original.cabecera_pedido[0].estado_pedido;
            let varianteColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";

            if (estado_pedido === 'activo') varianteColor = 'info';
            else if (estado_pedido === 'cancelado') varianteColor = 'destructive';
            else if (estado_pedido === 'pagado') varianteColor = 'success';
            else varianteColor = 'default';

            return (

                <Badge variant={varianteColor}>
                    {estado_pedido}
                </Badge>
            )
        }
    },
    {
        accessorKey: '',
        header: 'Estado de Pago',
        cell: ({ row }) => {


            let estado = row.original.situacion_pagos[0].estado_pago;
            let varianteColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";

            if (estado === 'activo') varianteColor = 'info';
            else if (estado === 'cancelado') varianteColor = 'destructive';
            else if (estado === 'pagado') varianteColor = 'success';
            else if (estado === 'pendiente') varianteColor = 'outline';
            else varianteColor = 'default';

            return (

                <Badge variant={varianteColor}>
                    {estado}
                </Badge>
            )
        }
    },
    {
        accessorKey: '',
        header: 'Estado de Envío',
        cell: ({ row }) => {


            let estado = row.original.situacion_envio[0].estado_envio;
            let varianteColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";

            if (estado === 'enviado') varianteColor = 'info';
            else if (estado === 'cancelado') varianteColor = 'destructive';
            // else if (estado === 'pagado') varianteColor = 'success';
            else if (estado === 'pendiente') varianteColor = 'outline';
            else if (estado === 'en_preparacion') varianteColor = 'warning';
            else if (estado === 'recibido') varianteColor = 'success';
            else varianteColor = 'default';

            return (

                <Badge variant={varianteColor}>
                    {estado}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'link_doc1',
        header: 'PDF',
        cell: ({ row }) => {
            const link = row.original.situacion_facturacion[0].link_doc1;
            return link ? (
                <a href={link} target='_blank' className="bg-black text-white p-2 rounded-lg flex justify-center text-sm">
                    Ver Boleta
                </a>
            ) : (
                <span className="flex bg-gray-300 text-gray-500 p-2 rounded-lg pointer-events-none text-sm">
                    No Disponible
                </span>
            );
        },
    },
];
