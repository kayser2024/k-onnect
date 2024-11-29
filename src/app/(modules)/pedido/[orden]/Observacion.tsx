'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { onUpdateObservaciones } from '@/actions/observaciones/updateObservacion'
import { DialogDescription } from '@radix-ui/react-dialog'

import React from 'react'
import { toast } from 'sonner'
import { MessageSquareQuote } from 'lucide-react'

interface Params {
    observaciones: string,
    orden: string
}

const Observacion = ({ observaciones, orden }: Params) => {

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {

        let resFinal = {}
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.currentTarget))
        const { selectedValue, comentario } = datos

        const res = await onUpdateObservaciones(orden, comentario as string, selectedValue as string, observaciones)

        if (res.error) {
            toast.error(res.mensaje)
        } else {
            toast.success(res.mensaje)
        }

    }

    return (
        <Dialog>
            <DialogTrigger aria-label='Crear Observacion' title='Agregar comentario'><MessageSquareQuote size={40} className='bg-slate-100 rounded-full hover:bg-slate-300 p-2' /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Creacion de comentario</DialogTitle>
                    <DialogDescription>
                        Agrega un comentario para el pedido
                    </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-2' onSubmit={handleForm}>

                    <div>
                        <span className="text-xs text-gray-400">Metodo de Pago</span>
                        <Select defaultValue='otro' name='selectedValue'>
                            <SelectTrigger >
                                <SelectValue placeholder="Selecciona motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='incidente'>Incidente</SelectItem>
                                <SelectItem value='otro'>Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400">Comentario</span>
                        <Input name='comentario' />
                    </div>

                    <DialogClose asChild>
                        <Button aria-label='Boton Agregar Comentario' type="submit" variant="default">
                            Agregar comentario
                        </Button>
                    </DialogClose>
                </form>
            </DialogContent>
        </Dialog>
    )
}



export default Observacion