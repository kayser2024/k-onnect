"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { Loader } from "@/components/loader";
import { onChangeStatusSend } from "@/actions/envio/changeStatus";
import { SelectEstablec } from "./ui/select-establec";

function RecepcionOrden() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const [order, setOrder] = useState("");
    const [orderList, setOrderList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [failedOrders, setFailedOrders] = useState<{ order: string, error: string }[]>([]); // Estado para las órdenes fallidas
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [optionSelection, setOptionSelection] = useState("");

    // función para agregar a la tabla
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validar si el input está vacío o no cumple con el formato
        if (!order.trim() || order.length < 10 || !order.startsWith("ss")) {
            toast.error("Ingresar una orden válida");
            return;
        }

        // Procesar bloques de órdenes
        if (order.trim().includes(" ")) {

            const orderBlock = order.trim().split(" ") // Dividir por líneas
                .map((orderItem) => orderItem.trim()) // Recortar espacios
                .filter((orderItem) => orderItem.length > 0); // Eliminar líneas vacías

            // Filtrar órdenes duplicadas
            const newOrders = orderBlock.filter((orderItem) => !orderList.includes(orderItem));

            if (newOrders.length > 0) {
                setOrderList((prevList) => [...prevList, ...newOrders]);
                toast.success(`${newOrders.length} órdenes agregadas correctamente.`);
            } else {
                toast.warning("Todas las órdenes del bloque ya están en la lista.");
            }
        } else {
            // Procesar una sola orden si no contiene saltos de línea
            if (orderList.includes(order.trim())) {
                toast.warning("La orden ya está en la lista.");
                return;
            }

            setOrderList((prevList) => [...prevList, order.trim()]);
            toast.success("Orden agregada correctamente.");
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
            const failedOrdersResult = await onChangeStatusSend(orderList, 'enviado', '/envio');

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
                for (const orderError of failedOrdersResult) {
                    toast.error(`${orderError.order}`, { description: `${orderError.error}`, dismissible: false, closeButton: true });

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


    if (isSessionLoading) { return <Loader /> }
    if (isUnauthenticated) { return <p>Sin acceso</p> }

    return (
        <>
            <main>
                <form onSubmit={handleSubmit} className="flex gap-2 bg-blue-50 p-1 rounded-md py-2">
                    <div className="w-full">

                        <label htmlFor="orden" className="text-sm font-bold">Orden pedido</label>
                        <Input placeholder="ss1234567890asdc" id="orden" value={order} onChange={(e) => setOrder(e.target.value)} />
                    </div>
                    {/* <div>
                        <label htmlFor="destino" className="text-sm font-bold" >Destino:</label>
                        <SelectEstablec setOptionSelection={setOptionSelection} />
                    </div> */}
                </form>

                <br />

                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="text-sm font-bold">Lista de ORDENES</label>
                    <Button onClick={handleDeleteRows} variant='destructive' disabled={Object.keys(rowSelection).length === 0} >Eliminar Seleccionado(s)</Button>
                    <Button onClick={handleChangeStatusOrders} disabled={isLoading}>{isLoading ? "Procesando..." : "Recepcionar"}</Button>
                </div>


                {/* TODO: Mostrar las ordenes que tienen el estado Recepción y filtrar por tienda 🚩 */}


                {/* TABLE */}
                <DataTable orderList={orderList} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            </main>
        </>
    );
}

export default RecepcionOrden;
