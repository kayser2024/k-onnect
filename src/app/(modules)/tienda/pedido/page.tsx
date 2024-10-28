import { Suspense } from "react";
import SearchPedido from "./search";
import TablePedidos from "./table";
import TableSkeleton from "./tableSkeleton";
import TablePaginacion from "./tablePaginacion";
import { Metadata } from "next";
import { getTipoRol } from "@/actions/auth/getTipoRol";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/auth.config";


export const metadata: Metadata = {
    title: 'Pedidos de Clientes',
    icons: '/kayser.ico'
}

export default async function PedidoPage({ searchParams }: {
    searchParams?: {
        search?: string,
        page?: string,
        type?: string
    }
}
) {

    const res = await getTipoRol()
    const session = await auth()
    if (!res.ok || !session) {
        toast.warning(res.message)
        redirect('/home')
    }

    const { name } = session.user


    const search = searchParams?.search || ''
    const currentPage = Number(searchParams?.page) || 1
    const type = searchParams?.type || 'orderNumber'


    return (
        <div className="flex flex-col gap-2">
            <SearchPedido />
            <TablePaginacion />
            <Suspense
                key={search + currentPage + type}
                fallback={<TableSkeleton />}>
                <TablePedidos currentPage={currentPage} search={search} type={type} name={name} />
            </Suspense>
        </div>

    )
}
