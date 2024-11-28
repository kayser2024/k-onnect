'use cliente'
import React from 'react'
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

interface AlertConfirmProps {
    isOpenAlert: boolean
    isSaving: boolean
    setIsOpenAlert: (value: boolean) => void
    handleAccept: () => void
}
export const AlertConfirm = ({ isOpenAlert, setIsOpenAlert, handleAccept, isSaving }: AlertConfirmProps) => {


    return (
        <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de de Cambiar el estado: PREPARACION de la Orden?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no podrá ser revertida.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='outline' onClick={() => setIsOpenAlert(false)} disabled={isSaving}>Cancelar</Button>
                    <Button variant='default' onClick={handleAccept} disabled={isSaving}>{isSaving ? 'Guardando ...' : `Aceptar`} </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
