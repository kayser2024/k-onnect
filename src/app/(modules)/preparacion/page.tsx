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

interface Option {
    value: string;
    label: string;
}

function PreparacionOrden() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const [order, setOrder] = useState("");
    const [orderList, setOrderList] = useState<{ order: string, destino: Option }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [failedOrders, setFailedOrders] = useState<{}>([]); // Estado para las órdenes fallidas
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
    const [optionSelection, setOptionSelection] = useState<Option>({ value: '', label: '' });

    // función para agregar a la tabla
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validar si el destino fue seleccionado
        if (!optionSelection.label) {
            toast.warning("Por favor, selecciona un destino antes de agregar órdenes.");
            return;
        }

        // Validar si el input está vacío o no cumple con el formato
        if (!order.trim() || order.length < 10 || !order.startsWith("ss")) {
            toast.error("Ingresar una orden válida");
            return;
        }

        // Procesar bloques de órdenes
        if (order.trim().includes(" ")) {

            // Procesar bloques de órdenes
            const orderBlock = order.trim().split(" ")
                .map((orderItem) => orderItem.trim())
                .filter((orderItem) => orderItem.length > 0);

            const newOrders = orderBlock.filter((orderItem) => !orderList.some((o) => o.order === orderItem));

            if (newOrders.length > 0) {
                const ordersWithDestino = newOrders.map((orderItem) => ({
                    order: orderItem,
                    destino: optionSelection,
                }));
                setOrderList((prevList) => [...prevList, ...ordersWithDestino]);
                toast.success(`${newOrders.length} órdenes agregadas correctamente.`);
            } else {
                toast.warning("Todas las órdenes del bloque ya están en la lista.");
            }
        } else {
            // Procesar una sola orden
            if (orderList.some((o) => o.order === order.trim())) {
                toast.warning("La orden ya está en la lista.");
                return;
            }

            setOrderList((prevList) => [
                ...prevList,
                { order: order.trim(), destino: optionSelection },
            ]);
            toast.success("Orden agregada correctamente.");
        }

        // Limpiar el campo de entrada
        setOrder("");
        setOptionSelection({ value: '', label: '' });
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

            const failedOrdersResult = await onChangeStatusSend(orderList, "en_preparacion", "/peparacion");

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

                    toast.error(`${orderError.order.order}`, { description: `${orderError.error}`, dismissible: false, closeButton: true });

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



    console.log({ optionSelection })

    if (isSessionLoading) { return <Loader /> }
    if (isUnauthenticated) { return <p>Sin acceso</p> }

    return (
        <>
            <main>
                <form onSubmit={handleSubmit} className="flex gap-2 bg-blue-50 p-1 rounded-md py-2"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                        }
                    }}
                >
                    <div>
                        <label htmlFor="destino" className="text-sm font-bold" >Destino:</label>
                        <SelectEstablec setOptionSelection={setOptionSelection} optionSelection={optionSelection} />
                    </div>
                    <div className="w-full">
                        <label htmlFor="orden" className="text-sm font-bold">Orden pedido</label>
                        <Input placeholder="ss1234567890abcd" id="orden" value={order} onChange={(e) => setOrder(e.target.value)} />
                    </div>
                </form>

                <br />

                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="text-sm font-bold">Lista de ORDENES</label>
                    <Button onClick={handleDeleteRows} variant='destructive' disabled={Object.keys(rowSelection).length === 0} >Eliminar Seleccionado(s)</Button>
                    <Button onClick={handleChangeStatusOrders} disabled={isLoading}>{isLoading ? "Procesando..." : "Pendiente --> PREPARACION"}</Button>
                </div>

                {/* TABLE */}
                <DataTable orderList={orderList} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            </main>
        </>
    );
}

export default PreparacionOrden;
