import { Button } from "@/components/ui/button"
import Link from "next/link"


function ModulesPage() {
    return (
        <main className="">

            <div className="flex flex-col items-center gap-8 text-center px-4">

                <div className="flex gap-2 lg:gap-4 items-center">
                    <h1 className="font-black text-4xl md:text-6xl lg:text-7xl">
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">One K-onnect</span>
                    </h1>
                </div>
                <h2 className="font-bold text-2xl max-w-md md:text-3xl lg:text-5xl lg:max-w-2xl">
                    <span className="underline decoration-dashed decoration-yellow-500 decoration-3 underline-offset-2">Sistema</span> para gestionar operaciones &amp; pedidos
                </h2>
                <p className="text opacity-90 max-w-sm lg:text-xl lg:max-w-2xl">
                    Revisas las ordenes de tu tienda, gestiona tus productos, clientes y mucho mas. Con este sistema podras ser capaz de gestionar tu tienda de manera eficiente.
                </p>

                <Link href={'/auth/login'} className="underline">Iniciar Sesion</Link>
            </div>
        </main>
    )
}

export default ModulesPage