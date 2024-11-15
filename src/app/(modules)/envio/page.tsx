"use client";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { onUpdateEnvio } from "@/actions/envio/actualizarEnvio";
import { useSession } from "next-auth/react";
import { FormEvent } from "react"
import { toast } from "sonner";


function EnvioMasivo() {

    const session = useSession()

    if (session.status === 'loading') {
        return <p>Cargando...</p>
    }
    if (session.status === 'unauthenticated') {
        return <p>Sin acceso</p>
    }


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = Object.fromEntries(new FormData(event.currentTarget))
        const { ordenes, estado } = data

        let listaOrdenes = (ordenes as string).split('\n').map(orden => orden.trim()).filter(orden => orden)

        for (let i = 0; i < listaOrdenes.length; i++) {
            // await onUpdateEnvio(listaOrdenes[i], estado as string, '/pedido')
            toast.success(`Orden ${listaOrdenes[i]}`, {
                description: "Actualizada correctamente"
            })
        }
    }

    return (
        <>
            <main>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center">
                    <label htmlFor="message" className="text-sm font-bold">Asunto</label>
                    <Textarea name="ordenes" className="w-[80%]" id="message" placeholder="ss1234567890asdc" />
                    <p className="text-sm text-muted-foreground">
                        Escribe todos las ordenes a actualizar:
                    </p>
                    <Select name="estado" defaultValue="pendiente">
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="en_preparacion">En preparacion</SelectItem>
                            <SelectItem value="enviado">Enviado a tienda</SelectItem>
                            <SelectItem value="recibido">Recibido</SelectItem>
                        </SelectContent>
                    </Select>
                    {
                        session.status === 'authenticated' && <Button type="submit">Cambiar estado</Button>
                    }

                </form>
            </main >

        </>
    )
}

export default EnvioMasivo