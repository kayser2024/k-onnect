"use client";

import { ChangeEvent, FormEvent, MouseEvent, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { Loader } from "@/components/loader";
import { onChangeStatusSend } from "@/actions/envio/changeStatus";
import { OptionOrder } from "@/types/Option";
import { SelectEstablec } from "@/components/SelectEsablec";
// import { getDataOrderByInvoice } from "@/actions/order/api/GET-order";
import { Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import ExcelJS from "exceljs";
import { Separator } from "@/components/ui/separator";
import { getDataOrderByInvoice } from "@/actions/order/getOrders";

function EnvioMasivo() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const [order, setOrder] = useState("");
    const [orderList, setOrderList] = useState<{ order: string, destino: OptionOrder }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [failedOrders, setFailedOrders] = useState<{}>([]); // Estado para las órdenes fallidas
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [optionSelection, setOptionSelection] = useState({ value: '', label: '' });
    const [establecSelect, setEstablecSelect] = useState({ value: '', label: '' })

    const [fileData, setFileData] = useState<any[]>([])

    const [error, setError] = useState(false);

    const VERIFY_OPTIONS = {
        RECOJO_TIENDA: "recojo en tienda",
        DELIVERY: "DELIVERY",
    };

    // función para verificar que tienda es la orden
    const verifyOrderEstablec = useCallback(async (invoice: string, establec: string) => {
        try {
            const dataInvoice = await getDataOrderByInvoice(invoice);
            // Verifica que `dataInvoice.data` no sea un array vacío y tenga la propiedad `PickupPoint`
            if (!dataInvoice.data || Array.isArray(dataInvoice.data) || !('PickupPoint' in dataInvoice.data)) {
                setError(true);
                return false;
            }


            if (dataInvoice.data?.PickupPoint !== establec) {
                setError(true);
                return;
            }


            return dataInvoice.ok

        } catch (error: any) {
            toast.error(error.message)
            return false;
        }


        // const { tipo_envio, direccion_envio } = dataInvoice.datos_envio[0] || {};
        // return (
        //     (tipo_envio === VERIFY_OPTIONS.RECOJO_TIENDA && establec === direccion_envio) ||
        //     (tipo_envio === 'delivery' && establec === VERIFY_OPTIONS.DELIVERY)
        // );
    }, []);

    // función para agregar a la tabla
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        // verificar si hay una tienda seleccionada
        if (!establecSelect) {
            toast.warning("Por favor, selecciona una tienda antes de agregar órdenes.");
            return;
        }

        // Procesar bloques de órdenes si contienen saltos de línea
        if (order.trim().includes(" ")) {

            const orderBlock = order.trim().split(" ") // Dividir por líneas
                .map((orderItem) => orderItem.trim()) // Recortar espacios
                .filter((orderItem) => orderItem.length > 0); // Eliminar líneas vacías

            // Filtrar órdenes duplicadas
            const newOrders = orderBlock.filter((orderItem) => !orderList.some((o) => o.order === orderItem));

            // const newOrders = orderBlock.filter((orderItem) => !orderList.includes(orderItem));

            if (newOrders.length > 0) {
                const ordersWithDestino = newOrders.map((orderItem) => ({
                    order: orderItem,
                    destino: establecSelect,
                }));
                setOrderList((prevList) => [...prevList, ...ordersWithDestino]);
                toast.success(`${newOrders.length} órdenes agregadas correctamente.`);
            } else {
                toast.warning("Todas las órdenes del bloque ya están en la lista.");
            }
        } else {
            // Procesar una sola orden si no contiene saltos de línea
            if (orderList.some((o) => o.order === order.trim())) {
                toast.warning("La orden ya está en la lista.");
                return;
            }


            // agregar solo si corresponde a la tienda seleccionada
            const isOrderValid = await verifyOrderEstablec(order, establecSelect.label)

            if (isOrderValid) {
                setOrderList((prevList) => [
                    ...prevList,
                    { order: order.trim(), destino: establecSelect },
                ]);
                setError(false)
            } else {
                // toast.warning("El destino no coincide")
                setError(true)
                return;
            }

        }

        // Limpiar el campo de entrada
        setOrder("");
    };


    // Cambiar estado de las ordenes
    const handleChangeStatusOrders = async () => {
        if (orderList.length === 0) {
            toast.error("No hay ordenes para actualizar");
            return;
        }

        try {
            setIsLoading(true);
            console.log("cambiando estado del pedido");

            // Obtén las órdenes fallidas
            const failedOrdersResult = await onChangeStatusSend(orderList, 'en_ruta', '/almacen/envio_orden');
            // Actualizar el estado de las órdenes fallidas
            setFailedOrders(failedOrdersResult);

            if (failedOrdersResult.length === 0) {
                toast.success("Todas las órdenes se enviaron correctamente");
                setOrderList([]);

            } else {
                const orderFiled = failedOrdersResult.map(failedOrder => failedOrder.order)

                // asignamos a nuestra lista de orden con las ordenes Fallidas para que se muestre en la tabla
                setOrderList(orderFiled)

                // mostrar errores con el nro de Orden
                for (const { order, error } of failedOrdersResult) {
                    toast.error(`${order.order}`, { description: `${error}`, dismissible: false, closeButton: true });

                }
            }

        }
        catch (error: any) { toast.error(`Error INTERNO: ${error.message}`); }
        finally { setIsLoading(false); }
    };

    // Eliminar ordenes seleccionadas
    const handleDeleteRows = () => {
        // Obtén los IDs de las filas seleccionadas
        const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[parseInt(key)]);

        // Convertir selectedIds a enteros (si es necesario)
        const selectedIndices = selectedIds.map(id => parseInt(id, 10));

        // Filtrar orderList para eliminar los índices seleccionados
        const updatedOrderList = orderList.filter((_, index) => !selectedIndices.includes(index));

        // Actualiza el estado de orderList con el array filtrado
        setOrderList(updatedOrderList);

        // Limpiar la selección de filas después de eliminar
        const updatedRowSelection = { ...rowSelection };
        selectedIndices.forEach((index) => {
            delete updatedRowSelection[index];
        });

        // Actualizar el estado de rowSelection
        setRowSelection(updatedRowSelection);
    };



    const handleLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log(file);
        }
    };



    // Función para obtener la información del File
    const handleUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
        const input = document.getElementById('file') as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        try {
            const workbook = new ExcelJS.Workbook();
            const reader = new FileReader();

            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;

                await workbook.xlsx.load(arrayBuffer);

                const worksheet = workbook.getWorksheet(1); // Selecciona la primera hoja

                if (!worksheet) {
                    toast.error("No se encontró la hoja de trabajo.");
                    return;
                }

                const rows: any[] = [];
                const headers: any[] = [];

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        // Leer las cabeceras
                        row.eachCell((cell, colNumber) => {
                            headers.push(cell.value);
                        });
                    } else {
                        // Leer los datos
                        const rowData: any = {};
                        row.eachCell((cell, colNumber) => {
                            rowData[headers[colNumber - 1]] = cell.value;
                        });
                        rows.push(rowData);
                    }
                });


                // Verificar si las columnas "Bol./Fact." y "Destino" existen
                if (!headers.includes("BOL./FACT.") || !headers.includes("DESTINO")) {
                    toast.error("El archivo no cumple con el formato de la plantilla para cargar las boletas en bloque.");
                    return;
                }

                // Obtener la columna "Bol./Fact." y "Destino"
                const filteredData = rows.map(row => ({
                    Invoice: row["BOL./FACT."],
                    PickupPoint: row["DESTINO"]
                }))


                // Verificar si ya existen en orderList
                const newOrders = filteredData.filter(data =>
                    !orderList.some(order => order.order === data.Invoice)
                );

                if (newOrders.length < filteredData.length) {
                    toast.warning("Algunas boletas ya existen en la lista actual.");
                }

                setFileData(filteredData)
                setOrderList((prevList) => [
                    ...prevList,
                    ...newOrders.map(data => ({ order: data.Invoice, destino: { label: data.PickupPoint, value: data.PickupPoint } }))
                ]);
                setError(false)

                // Limpiar el input type file
                input.value = ""
            };



            reader.readAsArrayBuffer(file);
        } catch (error: any) {
            console.error("Error al procesar el archivo:", error.message);
            toast.error(error.message)
            setError(true)
        }

    }


    if (isSessionLoading) { return <Loader /> }
    if (isUnauthenticated) { return <p>Sin acceso</p> }


    return (
        <>
            <main className="max-w-screen-xl mx-auto">

                <div className="grid md:grid-cols-2 gap-2">

                    {/* Formulario para agregar registro por registro */}
                    <div className="grid sm:grid-cols-4 gap-2 bg-blue-50 p-2  rounded-md">

                        <form onSubmit={handleSubmit} className="flex flex-col col-span-2">
                            <label htmlFor="orden" className="text-sm font-bold"># Boleta/ Factura:</label>
                            <Input
                                placeholder="B001-ABC"
                                id="orden"
                                value={order}
                                onChange={(e) => {
                                    setOrder(e.target.value);
                                    if (error) setError(false);
                                }}
                                className={`border ${error ? "border-red-500" : ""}`}
                            />
                            {error && (
                                <span className="text-red-500 text-xs mt-1">
                                    El destino no coincide con la Boleta.
                                </span>
                            )}
                        </form>

                        <div className="flex flex-col col-span-2">
                            <label htmlFor="" className="text-sm font-bold">Destino:</label>
                            <SelectEstablec setEstablec={setEstablecSelect} />
                        </div>
                    </div>


                    {/* formularion para importar excel */}
                    <div className="gap-2 flex bg-blue-50 p-2 rounded-md">
                        <div className="grid max-w-sm items-center">
                            <Label htmlFor="file" className="text-sm font-bold">Cargar EXCEL</Label>
                            <Input id="file" type="file" accept=".xls,.xlsx" onChange={handleLoadFile} />

                        </div>
                        <Button onClick={(e) => handleUploadFile(e)} className="mt-5 flex-1">Cargar</Button>
                    </div>

                </div>


                <br />

                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="text-sm font-bold">Lista de ORDENES</label>
                    <Button className="" onClick={handleDeleteRows} variant='destructive' disabled={Object.keys(rowSelection).length === 0} > <Trash /> <span className="hidden sm:inline">Eliminar Seleccionado(s)</span></Button>
                    <Button onClick={handleChangeStatusOrders} disabled={isLoading}>{isLoading ? "Procesando..." : "Enviar Destino"}</Button>
                </div>

                {/* TABLE */}
                <DataTable orderList={orderList} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            </main>
        </>
    );
}

export default EnvioMasivo;
