'use cliente'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface AlertConfirmProps {
    isOpenAlert: boolean
    isSaving: boolean
    setIsOpenAlert: (value: boolean) => void
    handleAccept: (coment: string) => void
}
export const AlertConfirm = ({ isOpenAlert, setIsOpenAlert, handleAccept, isSaving }: AlertConfirmProps) => {

    const [coment, setComent] = useState("")


    return (
        <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro REINICIAR el estado?</AlertDialogTitle>
                    <AlertDialogDescription>
                        La orden cambiará al estado de PREPARACIÓN.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex w-full flex-col gap-2 sm:flex-col'>
                    <Textarea placeholder='Comentario' className='w-full flex' onChange={(e) => setComent(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                        <Button variant='outline' onClick={() => setIsOpenAlert(false)} disabled={isSaving}>Cancelar</Button>
                        <Button variant='default' onClick={() => handleAccept(coment)} disabled={isSaving}>{isSaving ? 'Guardando ...' : `Aceptar`} </Button>

                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
