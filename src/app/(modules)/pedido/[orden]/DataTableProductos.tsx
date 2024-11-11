"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Orden } from "@/types/Orden"
import { toast } from "sonner"
import { BadgeCent } from "lucide-react"
import { ProductoTable } from "./Columnas"
import { Button } from "@/components/ui/button"
import ComboboxDemo from "./Combobx"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { onUpdateObservaciones } from '@/actions/observaciones/updateObservacion'
import { LiaExchangeAltSolid } from "react-icons/lia";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    orden: Orden,
    comprobante: any,
    persona?: string | null
}

export function DataTableProductos<TData, TValue>({ columns, data, orden, comprobante, persona }: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})
    const [motivoCambio, setMotivoCambio] = useState("")
    const docActual = comprobante ? comprobante.estado_facturacion : orden.cabecera_pedido[0].numero_orden

    let fechaCreacionBoleta = ''

    if (comprobante) {
        fechaCreacionBoleta = new Date(comprobante.fecha_envio_facturacion).toLocaleDateString();
    } else {
        fechaCreacionBoleta = 'AUN SIN CREACION DE BOLETA'
    }


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    })
// x	09918122	Maria Elena  Llanos 	MP	-	TOTAL	5/11/2024	BW17-28782	102.62	-	102.62	-	11/11/2024	21/11/2024	ss1730825678065olge	melenalla@yahoo.com	Janet	-	-	Devolucion Total a pedido del cliente
    const handleReembolso = async () => {

        const pagado = orden.situacion_pagos[0].estado_pago
        console.log(pagado, '👀👀👀')
        if (pagado !== "pagado") {
            toast.error("El pedido no ha sido pagado")
            return
        }


        // construyendo la data para enviar a discord

        const nroOrden = orden.cabecera_pedido[0].numero_orden
        const numeroCelular = orden.datos_facturacion[0].telefono_facturacion
        const observacionTotal = orden.situacion_facturacion[0].link_doc2
        const cantidadComprado = orden.detalle_pedido.reduce((acc, item) => acc + item.quantity_sku, 0)
        const fechaSolicitud = new Date().toLocaleDateString()
        const dni = orden.datos_facturacion[0].id_cliente
        const cliente = orden.datos_facturacion[0].nombres_facturacion
        const formaDevolucion = "MP"
        const operacion = "-"
        const tipoExtorno = table.getSelectedRowModel().rows.length === cantidadComprado ? "TOTAL" : "PARCIAL"
        const fechaVenta = new Date(orden.cabecera_pedido[0].fecha_pedido).toLocaleDateString()
        const boleta = docActual
        const montoPago = orden.resumen_pedido[0].total
        const nc = "-"
        let montoExtorno = 0
        table.getSelectedRowModel().rows.forEach(row => montoExtorno += (row.original as ProductoTable).subTotal)
        montoExtorno = parseFloat(montoExtorno.toFixed(2))
        const plazoMaximo = new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString()
        const ordenCompra = orden.cabecera_pedido[0].numero_orden
        const correoCliente = orden.datos_facturacion[0].email_facturacion
        const encargado = persona ? persona : "Apoyo"
        const notaAdicional = "-"

        console.log('Monto Extorno', montoExtorno)

        let observacion = "A solicitud del cliente: "
        if (tipoExtorno !== "TOTAL") {

            const listaEans = table.getSelectedRowModel().rows.map(row => (row.original as ProductoTable).descripcion.split(',')[2])
            console.log(listaEans, '🖐️')

            const res: string[] = await fetch('/api/producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: listaEans })

            }).then(res => res.json())

            //Creamos objeto que tendra como key el sap y como value la cantidad para evitar duplicados
            const obj = res.reduce((acc: any, sap: string) => {
                if (acc[sap]) {
                    acc[sap]++
                } else {
                    acc[sap] = 1
                }
                return acc
            }, {})

            console.log('Cantidad total : ', obj)
            // lo ponemos en observacion
            for (const key in obj) {
                observacion += `${key} (${obj[key]}) / `
            }

        } else {
            observacion = "Devolucion Total a pedido del cliente"
        }

        // navigator.clipboard.writeText(`x\t${dni}\t${cliente}\t${formaDevolucion}\t${operacion}\t${tipoExtorno}\t${fechaVenta}\t${boleta}\t${montoPago}\t${nc}\t${montoExtorno}\t-\t${fechaSolicitud}\t${plazoMaximo}\t${ordenCompra}\t${correoCliente}\t${encargado}\t${notaAdicional}\t-\t${observacion}`)

        // ACTUALIZAR API
        await onUpdateObservaciones(nroOrden, observacion, 'Devolucion', observacionTotal)

        navigator.clipboard.writeText(`${fechaSolicitud}\t${dni}\t${cliente}\t${formaDevolucion}\t${operacion}\t${tipoExtorno}\t${fechaVenta}\t${boleta}\t${montoPago}\t${nc}\t${montoExtorno}\t${plazoMaximo}\t${ordenCompra}\t${correoCliente}\t${encargado}\t${observacion}\t${notaAdicional}`)
        toast.success("Devolucion Copiada al Portapapeles")


        // ENVIAR NOTIFICACION A DISCORD
        const notificacionDiscord = await fetch('/api/notificacion/devolucion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fechaSolicitud,
                dni,
                cliente,
                formaDevolucion,
                operacion,
                tipoExtorno,
                fechaVenta,
                boleta,
                montoPago,
                nc,
                montoExtorno,
                plazoMaximo,
                ordenCompra,
                correoCliente,
                encargado,
                observacion,
                notaAdicional,
                observacionTotal,
                numeroCelular,
                fechaCreacionBoleta
            })
        })
        const res = await notificacionDiscord.json()
        toast.success('Notificacion Enviada a Discord')


    }

    const handleDescargaCambio = async () => {

        const pagado = orden.situacion_pagos[0].estado_pago

        console.log(pagado);
        if (pagado !== "pagado") {
            toast.error("El pedido no ha sido pagado")
            return
        }

        const eansOriginales = table.getSelectedRowModel().rows.map(row => (row.original as ProductoTable).descripcion.split(',')[2])

        console.log('TABLA DE CAMBIOS ELEGIDA');
        const prendasOriginalesSAP: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: eansOriginales })
        }).then(res => res.json())
        console.log(prendasOriginalesSAP);


        const tabla = document.getElementById("tablaCambios")
        //obetenemos los button
        const buttons = tabla!.getElementsByTagName("button")
        // imprimimos el contenido de los botones
        const prendasCambiadasEAN: string[] = []
        for (let i = 0; i < buttons.length; i++) {

            if (buttons[i].textContent === "Buscar Pedido por Ean") {
                toast.error("Falta seleccionar un producto")
                return
            }
            prendasCambiadasEAN.push(buttons[i].textContent!)
        }

        let titulos = 'Origen,CodProducto,Cantidad,Destino,CodigoTransaccion,Tipo,attr'
        for (let i = 0; i < prendasCambiadasEAN.length; i++) {
            titulos += `\nk033,${prendasCambiadasEAN[i]},1,k001,SEPARADO-${docActual}-C,Venta Externa,1`
        }

        console.log('\n\t============DESCARGANDO SALIDA===========\n\t');
        const blob = new Blob([titulos], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `SEPARADO-${docActual}-C`
        a.click()
        URL.revokeObjectURL(url)


    }

    // Función para Realizar camnbios
    const handleCambio = async () => {

        const pagado = orden.situacion_pagos[0].estado_pago
        // const observacionTotal = orden.situacion_facturacion[0].link_doc1
        const observacionTotal = orden.situacion_facturacion[0].link_doc2
        const numeroCelular = orden.datos_facturacion[0].telefono_facturacion

        console.log(pagado);
        if (pagado !== "pagado") {
            toast.error("El pedido no ha sido pagado")
            return
        }

        const eansOriginales = table.getSelectedRowModel().rows.map(row => (row.original as ProductoTable).descripcion.split(',')[2])


        console.log('TABLA DE CAMBIOS ELEGIDA');
        const prendasOriginalesSAP: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: eansOriginales })
        }).then(res => res.json())


        console.log(prendasOriginalesSAP, '🚩');


        const tabla = document.getElementById("tablaCambios")

        //obetenemos los button
        const buttons = tabla!.getElementsByTagName("button")

        // imprimimos el contenido de los botones
        const prendasCambiadasEAN: string[] = []
        for (let i = 0; i < buttons.length; i++) {

            if (buttons[i].textContent === "Buscar Pedido por Ean") {
                toast.error("Falta seleccionar un producto")
                return
            }
            prendasCambiadasEAN.push(buttons[i].textContent!)
        }

        const prendasCambiadasSAP: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: prendasCambiadasEAN })
        }).then(res => res.json())


        let titulos = 'Origen,CodProducto,Cantidad,Destino,CodigoTransaccion,Tipo,attr'
        for (let i = 0; i < prendasCambiadasEAN.length; i++) {
            titulos += `\nk033,${prendasCambiadasEAN[i]},1,k001,SEPARADO-${docActual}-C,Venta Externa,1`
        }

        let cambioRealizado: { prendaOriginalSap: string, prendaCambiadaEan: string }[] = []
        for (let i = 0; i < prendasOriginalesSAP.length; i++) {
            cambioRealizado.push({
                prendaOriginalSap: prendasOriginalesSAP[i],
                prendaCambiadaEan: prendasCambiadasEAN[i]
            })
        }

        console.log('TRANSACCION REALIZADA');
        console.table(cambioRealizado);

        //GESTIONANDO LINEA DE EXCEL
        const fechaSolicitud = new Date().toLocaleDateString()
        const encargada = persona ? persona : "Apoyo"
        const cliente = orden.datos_facturacion[0].nombres_facturacion
        const nroOrden = orden.cabecera_pedido[0].numero_orden
        const dni = orden.datos_facturacion[0].id_cliente
        const enviado = '-'
        const lugar = orden.datos_envio[0].departamento
        const boleta = docActual
        const nc = '-'
        const nuevaBoleta = '-'
        // Plazo maximo es 10 dias despues de hoy
        const plazoMaximo = new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString()
        const antes = prendasOriginalesSAP.join(' / ')
        const despues = prendasCambiadasSAP.join(' / ')
        const ean = prendasCambiadasEAN.join(' / ')
        const motivo = motivoCambio
        const enviarA = '-'
        const situacionDelCambio = 'Ingresado'

        
        // Copiar al portapapeles
        navigator.clipboard.writeText(`${fechaSolicitud}\t${encargada}\t${cliente}\t${nroOrden}\t${dni}\t${enviado}\t${lugar === "Lima" ? "Lima" : "Provincia"}\t${boleta}\t${nc}\t${nuevaBoleta}\t${plazoMaximo}\t${antes}\t${despues}\t${ean}\t${motivo}\t${enviarA}\t${situacionDelCambio}`)
        toast.success("Copiado al portapapeles")


        // Actualizar Api
        onUpdateObservaciones(nroOrden, motivo, 'Cambio', observacionTotal)


        // Enviar data a DISCORD
        const notificacionDiscord = await fetch('/api/notificacion/cambio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fechaSolicitud,
                encargada,
                cliente,
                nroOrden,
                dni,
                enviado,
                lugar,
                boleta,
                nc,
                nuevaBoleta,
                plazoMaximo,
                antes,
                despues,
                ean,
                motivo,
                situacionDelCambio,
                observacionTotal,
                numeroCelular,
                fechaCreacionBoleta
            })
        })
        const res = await notificacionDiscord.json()
        toast.success('Notificacion Enviada a Discord')

        // await onUpdateObservaciones(nroOrden, antes, 'Cambio', observacionTotal)


        //cerramos eldrawer

        console.log('\n\t============DESCARGANDO SALIDA===========\n\t');
        const blob = new Blob([titulos], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cambio.csv'
        a.click()
        URL.revokeObjectURL(url)


    }


    function TablaRealizarCambio() {

        const datosElegidos = table.getSelectedRowModel().rows.map(row => row.original as ProductoTable)
        const reDatos = []

        for (let i = 0; i < datosElegidos.length; i++) {
            for (let j = 0; j < datosElegidos[i].cantidad; j++) {
                reDatos.push({
                    foto: datosElegidos[i].foto,
                    descripcion: datosElegidos[i].descripcion,
                    cantidad: 1,
                    precio: datosElegidos[i].precio,
                    subTotal: datosElegidos[i].subTotal
                })
            }
        }

        return <Table id="tablaCambios">
            <TableCaption>Tabla de cambios</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead >Actual</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Cambio</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reDatos.map((producto, index) => {
                    const [categoria, title, sku, atributo1_titulo, atributo1_valor, atributo2_titulo, atributo2_valor] = producto.descripcion.split(',')

                    return (
                        <TableRow key={`${producto.cantidad}_${index}`}>
                            <TableCell  >
                                <div className="flex gap-2">
                                    <div>
                                        <img height={"auto"} width={"auto"} className="rounded-lg max-h-28" src={producto.foto} alt="SIN FOTO" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm  text-gray-400">{categoria}</h3>
                                        <h2 className="text-lg">{title}</h2>
                                        <p className="text-sm text-gray-400">{sku}</p>
                                        <p className="text-sm text-gray-400">{atributo1_titulo}: {atributo1_valor}</p>
                                        <p className="text-sm text-gray-400">{atributo2_titulo}: {atributo2_valor}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell ><LiaExchangeAltSolid /></TableCell>
                            <TableCell>

                                <div className="flex flex-col gap-2">
                                    <ComboboxDemo />
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                }
                )}
            </TableBody>
        </Table >
    }

    // Hacemos que recuerde el motivo de cambio

    const manejarCambioMotivo = (value: string) => {
        setMotivoCambio(value)
    }

    return (
        <div >

            <div className="max-h-[500px] overflow-y-auto">
                <Table >
                    <TableCaption>Tabla de Productos</TableCaption>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            {/* Modal Cambio Producto */}
            <div className="my-2 flex flex-col gap-2">
                <Drawer >
                    <DrawerTrigger disabled={table.getSelectedRowModel().rows.length === 0 ? true : false} className={`${table.getSelectedRowModel().rows.length === 0 ? "bg-gray-300" : "bg-black"} text-white p-2 rounded-md transition-all`} >Cambio</DrawerTrigger>
                    <DrawerContent className="max-h-[90%]">
                        <DrawerHeader>
                            <DrawerTitle>Cambio de Productos</DrawerTitle>
                            <DrawerDescription>Accion solicitada para generar linea de excel, salida de cambio, notificacion de discord</DrawerDescription>
                        </DrawerHeader>


                        {/* Seleccionar Motivo de Cambio */}
                        <div className="my-2 flex justify-center w-full ">
                            <Select onValueChange={manejarCambioMotivo}>
                                <SelectTrigger className="w-[50%]">
                                    <SelectValue placeholder="Seleccionar Motivo de Cambio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Cambio a pedido del cliente por talla o modelo">Cambio a pedido del cliente por talla o modelo</SelectItem>
                                        <SelectItem value="Cambio por falta de stock">Cambio por falta de stock</SelectItem>
                                        <SelectItem value="Cambio por prenda fallada">Cambio por prenda fallada</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Tabla de Productos a Cambiar */}
                        <TablaRealizarCambio />

                        <DrawerFooter>
                            <Button onClick={handleCambio}>Realizar Cambio</Button>
                            <Button onClick={handleDescargaCambio}>Descargar Salida de Cambio</Button>
                            <DrawerClose className="bg-purple-400 p-2 rounded-lg  font-bold">Cancelar</DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <DropdownMenu >
                    <DropdownMenuTrigger disabled={table.getSelectedRowModel().rows.length === 0 ? true : false} className={`${table.getSelectedRowModel().rows.length === 0 ? "bg-gray-300" : "bg-black"} text-white p-2 rounded-md transition-all`}>Devolucion</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Realizar Devolucion?</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleReembolso}>
                            <BadgeCent className="mr-2 h-4 w-4" />
                            <span>Copiar Linea excel y<br /> Notificar Discord</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </div>
    )
}

