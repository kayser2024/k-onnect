"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/actions/order/getOrders";
import { Button } from "@/components/ui/button";

function ResetOrder() {
    const session = useSession();
    const isSessionLoading = session.status === "loading";
    const isUnauthenticated = session.status === "unauthenticated";

    const [order, setOrder] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);


    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['Orders'],
        queryFn: async () => await getOrders()
    });

    const handleSearchOrder = (e: FormEvent) => {
        e.preventDefault();
        if (data) {
            const filtered = data.filter((o: any) => o.OrderNumber.includes(order));
            setFilteredOrders(filtered);
        }

    }

    if (isSessionLoading) { return <Loader /> }
    if (isUnauthenticated) { return <p>Sin acceso</p> }


    return (
        <>
            <main className="max-w-screen-xl mx-auto">
                <h1 className="text-3xl font-bold my-2">Lista de Ordenes</h1>
                <form onSubmit={handleSearchOrder} className="flex gap-2 bg-blue-50 p-1 rounded-md py-2">
                    <div className="w-full">
                        <label htmlFor="orden" className="text-sm font-bold">Buscar Nro Orden:</label>
                        <Input placeholder="ss1234567890abc" id="orden" value={order} onChange={(e) => setOrder(e.target.value)} />
                    </div>
                    <Button variant="default" type="submit" className="mt-6">Buscar</Button>
                </form>

                <br />


                {/* TABLE */}
                {!isFetching && <DataTable orders={filteredOrders.length > 0 ? filteredOrders : data} refetch={refetch} />}
            </main>
        </>
    );
}

export default ResetOrder;
