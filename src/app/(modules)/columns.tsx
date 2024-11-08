import { ColumnDef } from "@tanstack/react-table";
import { Orden } from "@/types/Orden";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownIcon, ArrowDownZA, ArrowUp, ArrowUpAZ, ArrowUpDown, ArrowUpIcon } from "lucide-react";

// import { Badge } from 'lucide-react';

// Define las columnas como una constante
export const columns: ColumnDef<Orden>[] = [
  {
    accessorKey: 'nombre_cliente',
    accessorFn: (row) => row.datos_facturacion[0].nombres_facturacion,
    header: ({ column }) => {
      // console.log(column.getIsSorted())
      return <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="w-40 flex gap-2  cursor-pointer" title="ordenar">Nombre cliente  {column.getIsSorted() && <>{column.getIsSorted() === 'asc' ? <ArrowDownAZ /> : <ArrowDownZA />}</>}</div>
    },
    cell: ({ row }) => {
      const nombre = row.original.datos_facturacion[0].nombres_facturacion;

      return (<p className="text-xs text-left">{nombre.toUpperCase()}</p>)
    },
  },
  {
    accessorKey: "nro_doc",
    accessorFn: (row) => row.datos_facturacion[0].id_cliente,
    header: ({ column }) => {
      return <div className="cursor-pointer flex gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>DNI {column.getIsSorted() && <>{column.getIsSorted() === 'asc' ? <ArrowDown01 /> : <ArrowDown10 />}</>}</div>

    },
    cell: ({ row }) => {
      const nro_doc = row.original.datos_facturacion[0].id_cliente;
      return <p className="text-xs text-left">{nro_doc}</p>;
    },
    filterFn: (row, id, value) => {
      const estado = row.original.datos_facturacion[0].id_cliente; // Obtiene el valor de estado_facturacion
      return estado
        ? estado.toLowerCase().includes(value.toLowerCase())
        : false; // Filtra el valor basado en el texto de búsqueda
    },
  },
  {
    accessorKey: "fechaPedido",
    accessorFn: (row) => row.cabecera_pedido[0].fecha_pedido,
    header: ({ column }) => {
      return <div className="cursor-pointer w-28 flex gap-2 items-center justify-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Fec. Pedido {column.getIsSorted() && <>{column.getIsSorted() === 'asc' ? <ArrowDown01 /> : <ArrowDown10 />}</>}</div>
    },
    cell: ({ row }) => {
      let fecha = format(row.original.cabecera_pedido[0].fecha_pedido, "dd / MM / yy hh:mm:ss a");
      return <p className="text-xs">{fecha}</p>;
    },
  },
  {
    accessorKey: "fechaFacturacion",
    accessorFn: (row) => row.situacion_facturacion[0].fecha_envio_facturacion,
    header: ({ column }) => {
      return <div className="cursor-pointer flex gap-2 w-32 items-center justify-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Fec. Fact. {column.getIsSorted() && <>{column.getIsSorted() === 'asc' ? <ArrowDown01 /> : <ArrowDown10 />}</>}</div>
    },
    cell: ({ row }) => {
      let fecha = row.original.situacion_facturacion[0].fecha_envio_facturacion;
      if (fecha === "") {
        fecha = "-- / -- / --";
        return fecha;
      }
      fecha = format(fecha, "dd / MM / yy");

      return <p className="text-xs">{fecha}</p>;
    },
  },
  {
    id: "estado_facturacion",
    accessorKey: "estado_facturacion",
    header: () => <div className="w-32">Boleta</div>,
    cell: ({ row }) => {
      let estado = row.original.situacion_facturacion[0].estado_facturacion;
      let varianteColor:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "success"
        | "warning"
        | "info";

      if (estado === "activo") varianteColor = "info";
      else if (estado === "cancelado") varianteColor = "destructive";
      else if (estado === "pagado") varianteColor = "success";
      else if (estado === "pendiente") varianteColor = "outline";
      else varianteColor = "default";

      return <Badge variant={varianteColor} className="text-xs">{estado}</Badge>;
      // return <>{row.original.situacion_facturacion[0].estado_facturacion}</>
    },
    filterFn: (row, id, value) => {
      const estado = row.original.situacion_facturacion[0]?.estado_facturacion; // Obtiene el valor de estado_facturacion
      return estado
        ? estado.toLowerCase().includes(value.toLowerCase())
        : false; // Filtra el valor basado en el texto de búsqueda
    },
  },
  {
    accessorKey: "numeroOrden",
    header: "Orden",
    cell: ({ row }) => {
      const nro_orden = row.original.cabecera_pedido[0].numero_orden;
      return (
        <Link
          href={`/pedido/${nro_orden}`}
          className="text-blue-700 font-bold text-xs"
        >
          {nro_orden}
        </Link>
      );
    },
    filterFn: (row, id, value) => {
      const estado = row.original.cabecera_pedido[0].numero_orden; // Obtiene el valor de estado_facturacion
      return estado
        ? estado.toLowerCase().includes(value.toLowerCase())
        : false; // Filtra el valor basado en el texto de búsqueda
    },
  },
  {
    accessorKey: 'cupon',
    header: () => <div className="w-32">Cupón</div>,
    cell: ({ row }) => {
      let cupon = row.original.cupon
      if (cupon === '') return <Badge variant='outline'>SIN CUPÓN</Badge>;

      return <Badge variant='warning' className="text-xs">{cupon}</Badge>
    }
  },
  {
    accessorKey: "tipo_envio",
    header: "Tipo Envio",
    cell: ({ row }) => {
      const tipo_envio = row.original.datos_envio[0].tipo_envio;

      return <p className="text-sm">{tipo_envio}</p>;
    },
  },
  {
    accessorKey: "direccion_envio",
    header: "Destino",
    cell: ({ row }) => {
      const direccion_envio = row.original.datos_envio[0].direccion_envio;
      const distrito = row.original.datos_envio[0].distrito;
      const provincia = row.original.datos_envio[0].provincia;
      return <p className="text-xs ">{direccion_envio} - {distrito}, {provincia}</p>;
    },
  },

  {
    accessorKey: "",
    header: "Estado de Pedido",
    cell: ({ row }) => {
      let estado_pedido = row.original.cabecera_pedido[0].estado_pedido;
      let varianteColor:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "success"
        | "warning"
        | "info";

      if (estado_pedido === "activo") varianteColor = "info";
      else if (estado_pedido === "cancelado") varianteColor = "destructive";
      else if (estado_pedido === "pagado") varianteColor = "success";
      else varianteColor = "default";

      return <Badge variant={varianteColor}>{estado_pedido}</Badge>;
    },
  },
  {
    accessorKey: "estado_pago",
    header: "Estado de Pago",
    cell: ({ row }) => {
      let estado = row.original.situacion_pagos[0].estado_pago;
      let varianteColor:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "success"
        | "warning"
        | "info";

      if (estado === "activo") varianteColor = "info";
      else if (estado === "cancelado") varianteColor = "destructive";
      else if (estado === "pagado") varianteColor = "success";
      else if (estado === "pendiente") varianteColor = "outline";
      else varianteColor = "default";

      return <Badge variant={varianteColor}>{estado}</Badge>;
    },
  },
  {
    accessorKey: "estado_envio",
    header: "Estado de Envío",
    cell: ({ row }) => {
      let estado = row.original.situacion_envio[0].estado_envio;
      let varianteColor:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "success"
        | "warning"
        | "info";

      if (estado === "enviado") varianteColor = "info";
      else if (estado === "cancelado") varianteColor = "destructive";
      // else if (estado === 'pagado') varianteColor = 'success';
      else if (estado === "pendiente") varianteColor = "outline";
      else if (estado === "en_preparacion") varianteColor = "warning";
      else if (estado === "recibido") varianteColor = "success";
      else varianteColor = "default";

      return <Badge variant={varianteColor}>{estado}</Badge>;
    },
  },
  {
    accessorKey: "link_doc1",
    header: "PDF",
    cell: ({ row }) => {
      const link = row.original.situacion_facturacion[0].link_doc1;
      return link ? (
        <a
          href={link}
          target="_blank"
          className="bg-black text-white p-2 rounded-lg flex justify-center text-xs"
        >
          Ver Boleta
        </a>
      ) : (
        <span className="flex bg-gray-300 text-gray-500 p-2 rounded-lg pointer-events-none text-xs">
          No Disponible
        </span>
      );
    },
  },
];
