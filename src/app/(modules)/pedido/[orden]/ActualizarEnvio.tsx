"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { onUpdateEnvio } from "@/actions/envio/actualizarEnvio"
import { Cog } from "lucide-react"
import { FormEvent, useState } from "react"
import { toast } from "sonner"


interface Params {
    estado_envio: string
    classsname?: string
    orden: string
}

const ActualizarEnvio = ({ classsname, estado_envio, orden }: Params) => {
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        const estado = formData.estado as string
        await onUpdateEnvio(orden, estado, '/pedido/[orden]')
        toast.success('Estado Actualizado a : ' + estado)
        setLoading(false)

    }

    return (

        <>
            <Dialog >
                <DialogTrigger className="flex items-center gap-2">
                    <Cog size={20} />
                    <p className={`${classsname} w-max p-2 rounded-lg text-ellipsis`}>{estado_envio}</p>
                </DialogTrigger>
                <DialogContent aria-describedby="dialogo">
                    <DialogHeader>
                        <DialogTitle>Cambiar el Estado de Pedido?</DialogTitle>
                        <DialogDescription>
                            Esta accion cambiara el estado de envio de este pedido
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-3 items-center" onSubmit={handleSubmit}>
                        <Select defaultValue="pendiente" name="estado">
                            <SelectTrigger>
                                <SelectValue placeholder="pendiente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="en_preparacion">En Preparacion</SelectItem>
                                <SelectItem value="enviado">Enviado</SelectItem>
                                <SelectItem value="recibido">Recibido</SelectItem>
                            </SelectContent>
                        </Select>


                        <Button aria-label="Boton Actualizar" type="submit" className={`${loading && 'animate-pulse'} w-full`}>{loading ? 'Espere...' : 'Actualizar'}</Button>
                    </form>


                </DialogContent>
            </Dialog>
        </>

    )
}

export default ActualizarEnvio