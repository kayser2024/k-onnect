"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { Loader } from "@/components/loader";
import { onUpdateEnvio } from "@/actions/envio/actualizarEnvio";
import { onChangeStatusSend } from "@/actions/envio/changeStatus";

function EnvioMasivo() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const [order, setOrder] = useState("");
    const [orderList, setOrderList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});

    // función para agregar a la tabla
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!order.trim() || order.length < 15 || !order.startsWith("ss")) {
            toast.error("Ingresar una orden válida");
            return;
        }

        // verificar si ya existe una orden dentro de mi orderList
        if (orderList.includes(order.trim())) {
            toast.warning("La orden ya está en la lista");
            return;
        }

        // agregar la orden a la lista
        setOrderList((prevList) => [...prevList, order.trim()]);
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

            // update
            await onChangeStatusSend(orderList, 'enviado', '/envio')

            toast.success(`Enviando órdenes`);
            setOrderList([]);
        } catch (error: any) {
            console.log(error.message);
            toast.error(`Error al cambiar estado: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar ordenes seleccionadas
    const handleDelete = () => {
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

    if (isSessionLoading) {
        return <Loader />;
    }
    if (isUnauthenticated) {
        return <p>Sin acceso</p>;
    }

    return (
        <>
            <main>
                <form onSubmit={handleSubmit} className="bg-blue-50 p-1 rounded-md py-2">
                    <div>
                        <label htmlFor="orden" className="text-sm font-bold">
                            Orden pedido
                        </label>
                        <Input
                            placeholder="ss1234567890asdc"
                            id="orden"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)} // Sin trim aquí
                        />
                    </div>
                </form>

                <br />

                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="text-sm font-bold">
                        Lista de ORDENES
                    </label>
                    <Button onClick={handleDelete} variant='destructive' disabled={Object.keys(rowSelection).length === 0} >Eliminar Seleccionado(s)</Button>
                    <Button onClick={handleChangeStatusOrders} disabled={isLoading}>
                        {isLoading ? "Procesando..." : "Pendiente -> ENVIADO"}
                    </Button>
                </div>

                {/* TABLE */}
                <DataTable orderList={orderList} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            </main>
        </>
    );
}

export default EnvioMasivo;
