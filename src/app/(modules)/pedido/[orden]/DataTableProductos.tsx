"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { onUpdateObservaciones } from '@/actions/observaciones/updateObservacion'
import { insertComment } from "@/actions/order/insertComent"
import { createIncidence, getProductListTotalRefund } from "@/actions/order/Incidencia"
import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { RiFileExcel2Line } from "react-icons/ri"
import { TbStatusChange } from "react-icons/tb";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SelectProductChange } from "./select-product-change"
import { columns } from "./Columnas"
import { ProductToChangeList } from "./product-to-change.list"
import { ProductSelectList } from "./product-select-list"
import { updateStatusPayment } from "@/actions/order/api/PUT-order"
import { CascadingSelect } from "@/components/select/CascadingSelect"
import { SelectStore } from "./ui/select-store"

interface DataTableProps {
    data: any,
    orden: Orden,
    comprobante: any,
    persona?: string | null
}

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: string;
    quantity: number
    price: number;
    priceSale: number;
    size: string;
    color: string;
}

interface ProductSelect {
    sku: string;
    quantity: number
    price: number
}
export function DataTableProductos({ data, orden, comprobante, persona }: DataTableProps) {

    const [rowSelection, setRowSelection] = useState({})
    const [motivoCambio, setMotivoCambio] = useState("")
    const [loading, setLoading] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [invoice, setInvoice] = useState("")
    const [newProducts, setNewProducts] = useState<Product[]>([])
    const [productsSelect, setProductsSelect] = useState<ProductSelect[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [prodOriginSubtotal, setProdOriginSubtotal] = useState(0);
    const [prodChangeSubtotal, setProdChangeSubtotal] = useState(0);
    const [store, setStore] = useState("")
    const [commentDev, setCommentDev] = useState("");
    const [commentCamb, setCommentCamb] = useState("");



    // obtener incidencias "Devoluciones"
    const { data: listDevoluciones, isLoading, refetch } = useQuery({ queryKey: ['listDevoluciones'], queryFn: async () => getProductListTotalRefund(orden.situacion_facturacion[0].estado_facturacion) })
    console.log({ listDevoluciones }, '-----------DEVOLUCIONES----------')

    const docActual = comprobante ? comprobante.estado_facturacion : orden.cabecera_pedido[0].numero_orden

    let fechaCreacionBoleta = ''

    if (comprobante) {
        fechaCreacionBoleta = new Date(comprobante.fecha_envio_facturacion).toLocaleDateString();
    } else {
        fechaCreacionBoleta = 'AUN SIN CREACION DE BOLETA'
    }


    const table = useReactTable({
        data: data.detalle_pedido,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: (row) => {
            const isReembolso = !listDevoluciones?.some((devolucion: any) => devolucion.CodEan === row.original.sku);
            return isReembolso
        },
        state: {
            rowSelection,
        },
    })

    // Función para Devoluciones
    const handleReembolso = async () => {
        setLoading(true);

        // Verificar si la voleta está en estado PAGADO
        const pagado = orden.situacion_pagos[0].estado_pago
        if (pagado !== "pagado") {
            toast.error(`El estado de pago: ${pagado}`)
            return
        }

        // Validar Boleta de inicdencia
        // if (invoice.trim().length < 5) {
        //     toast.warning("Ingresar la Boleta de la Incidencia")
        //     return;
        // }


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
        table.getSelectedRowModel().rows.forEach(row => montoExtorno += (row.original).subtotal_sku)
        montoExtorno = parseFloat(montoExtorno.toFixed(2))
        const plazoMaximo = new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString()
        const ordenCompra = orden.cabecera_pedido[0].numero_orden
        const correoCliente = orden.datos_facturacion[0].email_facturacion
        const encargado = persona ? persona : "Apoyo"
        const notaAdicional = "-"

        let observacion = "A solicitud del cliente: "
        let listCodSap;
        const listaEans = table.getSelectedRowModel().rows.map(row => (row.original).sku)

        const res: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: listaEans })

        }).then(res => res.json())
        listCodSap = res;

        if (tipoExtorno !== "TOTAL") {

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
            console.log("ACTUALIZAR EL ESTADO A CANCELADO")
            observacion = "Devolucion Total a pedido del cliente"
            // Actualizar API situación de Pago CANCELADO 🚩
            await updateStatusPayment(nroOrden, "cancelado");
        }

        // navigator.clipboard.writeText(`x\t${dni}\t${cliente}\t${formaDevolucion}\t${operacion}\t${tipoExtorno}\t${fechaVenta}\t${boleta}\t${montoPago}\t${nc}\t${montoExtorno}\t-\t${fechaSolicitud}\t${plazoMaximo}\t${ordenCompra}\t${correoCliente}\t${encargado}\t${notaAdicional}\t-\t${observacion}`)

        // Agregar Comentario a la BD
        const responseDB = await onUpdateObservaciones(nroOrden, observacion, 'Devolucion', observacionTotal)
        toast.warning(JSON.stringify(responseDB, null, 2))

        navigator.clipboard.writeText(`${fechaSolicitud}\t${dni}\t${cliente}\t${formaDevolucion}\t${operacion}\t${tipoExtorno}\t${fechaVenta}\t${boleta}\t${montoPago}\t${nc}\t${montoExtorno}\t${plazoMaximo}\t${ordenCompra}\t${correoCliente}\t${encargado}\t${observacion}\t${notaAdicional}`)
        toast.success("Devolucion Copiada al Portapapeles")

        const ordenFilter = orden.detalle_pedido.filter(p => {
            return listaEans.includes(p.sku)
        })

        const productSelect = ordenFilter.map((p, index) => ({
            codeEan: p.sku,
            codeSap: listCodSap[index],
            quantity: p.quantity_sku,
            subtotal: p.subtotal_sku,
            text: "RETURN"
        }))


        const data = {
            orden: orden.cabecera_pedido[0].numero_orden,
            invoiceOrigin: orden.situacion_facturacion[0].estado_facturacion,
            invoiceIncidence: invoice.toUpperCase(),
            product: productSelect,
            typeIncidence: tipoExtorno === "PARCIAL" ? 1 : 2,
            pickupPoint: store,
            reason: `Devolución ${tipoExtorno}`
        }


        try {
            const responseIncidencia = await createIncidence(data);
            toast.info(JSON.stringify(responseIncidencia, null, 2));
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false);
            setDropdownOpen(false)
            setStore("")
            setCommentDev("")
        }

        refetch();
        setRowSelection({})


        // ENVIAR NOTIFICACION A DISCORD CANAL DE DEVOLUCIONES
        // const notificacionDiscord = await fetch('/api/notificacion/devolucion', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         fechaSolicitud,
        //         dni,
        //         cliente,
        //         formaDevolucion,
        //         operacion,
        //         tipoExtorno,
        //         fechaVenta,
        //         boleta,
        //         montoPago,
        //         nc,
        //         montoExtorno,
        //         plazoMaximo,
        //         ordenCompra,
        //         correoCliente,
        //         encargado,
        //         observacion,
        //         notaAdicional,
        //         observacionTotal,
        //         numeroCelular,
        //         fechaCreacionBoleta
        //     })
        // })
        // const res = await notificacionDiscord.json()
        // toast.success('Notificacion Enviada a Discord')


    }

    const handleDescargaCambio = async () => {

        const pagado = orden.situacion_pagos[0].estado_pago

        if (pagado !== "pagado") {
            toast.error("El pedido no ha sido pagado")
            return
        }

        // const eansOriginales = table.getSelectedRowModel().rows.map(row => (row.original as ProductoTable))
        const eansOriginales = table.getSelectedRowModel().rows.map(row => (row.original).sku)

        const prendasOriginalesSAP: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: eansOriginales })
        }).then(res => res.json())


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

        setLoading(true)


        if (!motivoCambio.trim()) {
            toast.warning("Debe ingresar un motivo de cambio")
            return
        }

        // Validar Invoice
        // if (invoice.trim().length < 5) {
        //     toast.warning("Ingresar la Boleta de la Incidencia")
        //     return;
        // }


        const pagado = orden.situacion_pagos[0].estado_pago

        if (pagado !== "pagado") {
            toast.error("El pedido no ha sido pagado")
            return
        }

        const prendasOriginalesEans = table.getSelectedRowModel().rows.map(row => (row.original).sku)
        const prendasCambiadasEAN = newProducts.map(p => p.codigoEan)

        const prendasOriginalesSAP: string[] = await fetch('/api/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: prendasOriginalesEans })
        }).then(res => res.json())


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

        let cambioRealizado: { prendaOriginalSap: string, prendaCambiadaEan: string, prendaCambiadaSap: string }[] = []
        for (let i = 0; i < prendasOriginalesSAP.length; i++) {
            cambioRealizado.push({
                prendaOriginalSap: prendasOriginalesSAP[i],
                prendaCambiadaEan: prendasCambiadasEAN[i],
                prendaCambiadaSap: prendasCambiadasSAP[i]
            })
        }

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
        const plazoMaximo = new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString();// Plazo maximo es 10 dias despues de hoy
        const antes = prendasOriginalesSAP.join(' / ')
        const despues = prendasCambiadasSAP.join(' / ')
        const ean = prendasCambiadasEAN.join(' / ')
        const motivo = motivoCambio
        const enviarA = '-'
        const situacionDelCambio = 'Ingresado'


        // Copiar al portapapeles
        navigator.clipboard.writeText(`${fechaSolicitud}\t${encargada}\t${cliente}\t${nroOrden}\t${dni}\t${enviado}\t${lugar === "Lima" ? "Lima" : "Provincia"}\t${boleta}\t${nc}\t${nuevaBoleta}\t${plazoMaximo}\t${antes}\t${despues}\t${ean}\t${motivo}\t${enviarA}\t${situacionDelCambio}`)
        toast.success("Copiado al portapapeles")



        try {
            // Actualizar Api
            // await onUpdateObservaciones(nroOrden, antes + " >> " + despues, 'Cambio', observacionTotal)
            await insertComment(`${antes}  >>  ${despues}`, nroOrden, 1)

            // Enviar Notificacion a DISCORD en el CANAL de de CAMBIO
            // const notificacionDiscord = await fetch('/api/notificacion/cambio', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         fechaSolicitud,
            //         encargada,
            //         cliente,
            //         nroOrden,
            //         dni,
            //         enviado,
            //         lugar,
            //         boleta,
            //         nc,
            //         nuevaBoleta,
            //         plazoMaximo,
            //         antes,
            //         despues,
            //         ean,
            //         motivo,
            //         situacionDelCambio,
            //         observacionTotal,
            //         numeroCelular,
            //         fechaCreacionBoleta
            //     })
            // })


            // const res = await notificacionDiscord.json()

            // toast.success('Notificacion Enviada a Discord')



            const productCombined = [
                ...productsSelect.map((p, index) => ({
                    codeEan: p.sku,
                    quantity: p.quantity,
                    codeSap: prendasOriginalesSAP[index],
                    subtotal: p.quantity * p.price,
                    text: "ORIGIN",
                })),
                ...newProducts.map(p => ({
                    codeEan: p.codigoEan,
                    quantity: p.quantity,
                    codeSap: p.codigoSap,
                    subtotal: p.quantity * p.priceSale,
                    text: "CHANGE",
                })),
            ];

            //TODO: guardar en tabla incidencia para la orden 
            const data = {
                orden: orden.cabecera_pedido[0].numero_orden,
                invoiceOrigin: orden.situacion_facturacion[0].estado_facturacion,
                invoiceIncidence: invoice.toUpperCase(),
                product: productCombined,
                typeIncidence: 3,
                pickupPoint: store,
                reason: motivoCambio

            }

            await createIncidence(data)


        } catch (error) {
            toast.error('Error al actualizar observaciones')
        } finally {
            setLoading(false)
            setMotivoCambio("")
            setRowSelection({})
            setInvoice("")
            setOpenDrawer(false)
            setNewProducts([])
            setStore("");
        }


        console.log('\n\t============DESCARGANDO SALIDA===========\n\t');
        const blob = new Blob([titulos], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cambio.csv'
        a.click()
        URL.revokeObjectURL(url)


        // prendasOriginalesEans = ['"7800010385523"','"7800010385523"','"7800010385523"']
        // prendasOriginalesSap = ["D6058-ROJ-S","D6058-ROJ-S","D6058-ROJ-S"]
        const ordenFilter = orden.detalle_pedido.filter(p => {
            return prendasOriginalesEans.includes(p.sku)
        });




        // Descargar Excel
        // handleDescargaCambio()

    }

    // Hacemos que recuerde el motivo de cambio
    const manejarCambioMotivo = (value: string) => {
        setMotivoCambio(value)
    }


    return (
        <div >
            <ScrollArea className="h-[500px]">
                <Table >
                    {/* <TableCaption>Tabla de Productos</TableCaption> */}
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
                            table.getRowModel().rows.map((row) => {
                                const isDisabled = listDevoluciones?.some((devolucion: any) => devolucion.CodEan === row.original.sku);

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={isDisabled ? "bg-red-50 hover:bg-red-100 cursor-not-allowed" : ""}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            }
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            {/* BUTTONS */}
            <div className="my-2 flex flex-col gap-2">

                {/* Drawer para cambiar producto */}
                <Dialog open={openDrawer} onOpenChange={setOpenDrawer}>
                    <DialogTrigger disabled={table.getSelectedRowModel().rows.length === 0} className={`${table.getSelectedRowModel().rows.length === 0 ? "bg-gray-300" : "bg-black"} text-white p-2 rounded-md transition-all`} >Cambio</DialogTrigger>

                    {/* Modal Cambio Producto */}
                    <DialogContent className=" md:max-w-screen-md lg:w-screen-lg">

                        <DialogHeader>
                            <DialogTitle className="text-xl uppercase text-center mb-4">CAMBIAR PRODUCTO</DialogTitle>
                            {/* <DrawerDescription>Accion solicitada para generar linea de excel, salida de cambio, notificacion de discord</DrawerDescription> */}
                        </DialogHeader>

                        {/* Header Modal Cambiar Producto */}
                        <div className="mb-4 grid grid-cols-2 gap-3 ">

                            {/* RESUMEN Orden */}
                            <div className="w-full rounded-lg border p-4">

                                <h2 className="text-center text-lg font-semibold  mb-3">Resumen Orden: {docActual}</h2>
                                <div className=" flex items-center justify-between">
                                    <p className="">Total Orden: </p>
                                    <span className="">S/ {prodOriginSubtotal.toFixed(2)}</span>
                                </div>
                                <div className=" flex items-center justify-between my-2">
                                    <p className="">Total Cambio: </p>
                                    <span className="">S/ {prodChangeSubtotal.toFixed(2)}</span>
                                </div>

                            </div>

                            <div className=" flex flex-col gap-3">
                                <ScrollArea className="max-h-72 flex flex-col gap-4 px-2">

                                    {/* Ingresar Incidencia */}
                                    {/* <div className="">
                                        <Label htmlFor="invoice" className="text-right">#Boleta Incidencia</Label>
                                        <Input id="invoice" className=" uppercase" placeholder="B001-123" onChange={(e) => setInvoice(e.target.value)} value={invoice} />
                                    </div> */}

                                    {/* Seleccionar Tienda */}
                                    <div className="">
                                        <span className="text-sm font-semibold">Seleccionar Tienda:</span>
                                        <SelectStore setStore={setStore} />
                                    </div>


                                    {/* Seleccionar Motivo de Cambio */}
                                    <div className="my-3">
                                        <Label htmlFor="selectMotivo" className="text-xs font-semibold">Seleccionar Motivo</Label>
                                        <Select onValueChange={manejarCambioMotivo}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Seleccionar..." />
                                            </SelectTrigger>
                                            <SelectContent id="selectMotivo">
                                                <SelectGroup>
                                                    <SelectItem value="Cambio a pedido del cliente por talla o modelo">Cambio a pedido del cliente por talla o modelo</SelectItem>
                                                    <SelectItem value="Cambio por falta de stock">Cambio por falta de stock</SelectItem>
                                                    <SelectItem value="Cambio por prenda fallada">Cambio por prenda fallada</SelectItem>
                                                    <SelectItem value="Otro">Otro</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>


                                    {/* Escoger Productos Nuevos */}
                                    <SelectProductChange setNewProducts={setNewProducts} newProducts={newProducts} />
                                </ScrollArea>

                            </div>

                        </div>


                        {/* Tabla de Productos a Cambiar */}
                        <ScrollArea className="max-h-[500px]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid-cols-1">

                                    {/* <TablaRealizarCambio /> */}
                                    <h3 className="text-lg mb-2">Lista de Productos</h3>
                                    <ProductSelectList productsSelect={table.getSelectedRowModel().rows.map((row) => row.original)} setProductsSelect={setProductsSelect} setProdOriginSubtotal={setProdOriginSubtotal} />
                                </div>
                                <div className="grid-cols-1">
                                    <h3 className="text-lg mb-2"> Nuevos Productos</h3>
                                    <ProductToChangeList newProducts={newProducts} setNewProducts={setNewProducts} setProdChangeSubtotal={setProdChangeSubtotal} />

                                </div>

                            </div>
                        </ScrollArea>

                        <DialogFooter className="flex gap-2 flex-row items-center justify-end my-4">
                            <Button onClick={handleDescargaCambio} variant='secondary'><RiFileExcel2Line size={25} className="text-gren-400" />Descargar Salida de Cambio</Button>

                            <Button onClick={handleCambio} disabled={loading || (prodOriginSubtotal >= prodChangeSubtotal)} variant="default"><TbStatusChange size={25} /> {loading ? 'Guardando...' : 'Realizar Cambio'}</Button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* DropMenu para Devolucion */}
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} >
                    <DropdownMenuTrigger disabled={table.getSelectedRowModel().rows.length === 0} className={`${table.getSelectedRowModel().rows.length === 0 ? "bg-gray-300" : "bg-black"} text-white p-2 rounded-md transition-all`}>Devolucion</DropdownMenuTrigger>

                    {/* Drawer Menu Devolucion */}
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="flex flex-col gap-4">
                            <div className="flex flex-col mb-2">
                                <span>¿Realizar Devolución?</span>
                                <span className="text-xs text-slate-400 font-normal">Copiar Linea Excel y Notificar Discord</span>
                            </div>
                            <div className="">
                                <span>Seleccionar Tienda:</span>
                                <div className="">
                                    <SelectStore setStore={setStore} />
                                </div>

                            </div>
                            <div className="">
                                <span>Comentario:</span>
                                <div className="">
                                    <Input placeholder="Comentario" className="" onChange={(e) => setCommentDev(e.target.value)} value={commentDev} />
                                </div>

                            </div>

                            {/* <span className="text-xs mt-4">Ingresar Nota Cred.:</span> */}
                            {/* <div className="flex gap-2"> */}


                            <Button className="" onClick={handleReembolso} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
                            {/* <Input placeholder="B00-123" className="uppercase" onChange={(e) => setInvoice(e.target.value)} value={invoice} /> */}
                            {/* </div> */}



                        </DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={handleReembolso} className="flex flex-col gap-2"> */}
                        {/* <div> */}
                        {/* <BadgeCent className="mr-2 h-4 w-4" /> */}
                        {/* <span>Copiar Linea excel y<br /> Notificar Discord</span> */}
                        {/* </div> */}
                        {/* </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </div>
    )
}