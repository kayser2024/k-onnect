"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { Loader } from "@/components/loader";
import { onChangeStatusSend } from "@/actions/envio/changeStatus";
import { OptionOrder } from "@/types/Option";
import { useQuery } from "@tanstack/react-query";
import { getOrderByPickupPoint } from "@/actions/order/getOrderByPickupPoint";
import { getAllOrderReceived } from "@/actions/order/getOrderAllReceived";
import { DataTableAll } from "./data-table-all";

function EntregaOrder() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const PickupPointID = session.data?.user.PickupPointID

    const [order, setOrder] = useState("");
    const [orderList, setOrderList] = useState<{ order: string, destino: OptionOrder }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [failedOrders, setFailedOrders] = useState<{}>([]); // Estado para las órdenes fallidas
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});


    const { data, isLoading: orderReceivedLoading, isRefetching, isError, refetch } = useQuery({
        queryKey: ["getAllOrderReceived", PickupPointID],
        queryFn: async () => {
            if (PickupPointID) {
                const resulOrdersReceived = await getAllOrderReceived(4, PickupPointID)//4=>recibido_tienda
                return resulOrdersReceived.data
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    })


    const getSelectedRows = () => {
        if (!data) return [];
        const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[parseInt(key)]);
        const selectedRows = selectedIds.map(id => data[parseInt(id, 10)]);
        return selectedRows;
    };

    // Cambiar estado de las ordenes de las celdas seleccionadas
    const handleChangeStatusOrders = async () => {
        // Obtener todos los productos seleccionados. 🚩
        const selectedRows = getSelectedRows();
        // console.log(selectedRows)

        if (selectedRows.length === 0) {
            toast.warning("No hay órdenes seleccionadas");
        }

        // Crear orderList con el formato correcto
        const orderList = selectedRows.map(row => ({
            order: row.OrderNumber,
            destino: { value: row.PickupPointID!.toString(), label: row.PickupPoint || "" }
        }));

        try {
            setIsLoading(true);
            // console.log("cambiando estado del pedido");

            // Obtén las órdenes fallidas
            const failedOrdersResult = await onChangeStatusSend(orderList, 'entregado_cliente', '/tienda/entrega');
            console.log(failedOrdersResult, '🔴🟡🟢');

            // Actualizar el estado de las órdenes fallidas
            setFailedOrders(failedOrdersResult);

            if (failedOrdersResult.length === 0) {
                toast.success("Todas las órdenes se enviaron correctamente");
                refetch();
                setRowSelection({});
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


    // función para agregar a la tabla
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //  validar si está dentro de la tabla cargada🚩
        const newSelection = { ...rowSelection }

        const existInDataTable = data?.some((o, index) => {
            if (o.OrderNumber === order || o.Invoice === order) {
                newSelection[index] = true; // Seleccionar la fila correspondiente
                return true;
            }
            return false;
        })

        // si encuentra la orden ingresada pintar seleccionar la celda🚩
        if (existInDataTable) {
            setRowSelection(newSelection);
        } else {
            toast.warning('Orden no encontrada');
            return
        }

        // Limpiar el campo de entrada
        setOrder("");
    };


    if (orderReceivedLoading) { return <Loader /> }
    if (isSessionLoading) { return <Loader /> }
    if (isUnauthenticated) { return <p>Sin acceso</p> }


    return (
        <>
            <main className="mx-auto max-w-screen-xl">
                <form onSubmit={handleSubmit} className="flex gap-2 bg-blue-50 p-1 rounded-md py-2">
                    <div className="w-full">

                        <label htmlFor="orden" className="text-sm font-bold">Orden pedido</label>
                        <Input placeholder="ss1234567890asdc" id="orden" value={order} onChange={(e) => setOrder(e.target.value)} />
                    </div>

                </form>

                <br />

                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="text-sm font-bold">Lista de ORDENES</label>
                    <Button onClick={handleDeleteRows} variant='destructive' disabled={Object.keys(rowSelection).length === 0} >Quitar Selección</Button>
                    <Button onClick={handleChangeStatusOrders} disabled={isLoading}>{isLoading ? "Procesando..." : "Entregar Cliente"}</Button>
                </div>

                {
                    orderReceivedLoading
                        ? <Loader />
                        : <DataTableAll data={data} rowSelection={rowSelection} setRowSelection={setRowSelection} />

                }


                {/* TABLE */}
                {/* <DataTable orderList={orderList} rowSelection={rowSelection} setRowSelection={setRowSelection} /> */}
            </main>
        </>
    );
}

export default EntregaOrder;
