'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { onUpdateObservaciones } from '@/actions/observaciones/updateObservacion'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { MessageSquareQuote } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { insertComment } from '@/actions/order/insertComent'
import { getOrder } from '@/actions/order/getOneOrder'

interface Params {
    observaciones: string,
    orden: string
}

const Observacion = ({ observaciones, orden }: Params) => {
    const [isSaiving, setIsSaving] = useState(false)
    const [comment, setComment] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)


    // obtener el ID de la Orden

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSaving(true)
        e.preventDefault();

        try {
            // TODO: AGREGAR COMENTARIO AL ORDEN EN LA BD🚩
            await insertComment(comment, orden)

            setComment("");
            setIsDialogOpen(false)

        } catch (error: any) {
            toast.error(error.message)

        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger aria-label='Crear Observacion' title='Agregar comentario'><MessageSquareQuote size={40} className='bg-slate-100 rounded-full hover:bg-slate-300 p-2' /></DialogTrigger>
            <DialogContent>
                <DialogHeader className='my-2'>
                    <DialogTitle>Agregar Comentario</DialogTitle>

                </DialogHeader>
                <form className='flex flex-col gap-2' onSubmit={handleForm}>

                    <div className='flex flex-col gap-2'>
                        <Textarea placeholder='Comentario...' value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>

                    <Button aria-label='Boton Agregar Comentario' type="submit" variant="default" disabled={isSaiving}>
                        {isSaiving ? <>Guardando...</> : <>Guardar</>}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}



export default Observacion