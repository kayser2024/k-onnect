'use client'

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
import { Button } from '@/components/ui/button';



interface ConfirmCompletedProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleClose: () => void;
    handleAccept: () => void;
    isLoading: boolean;
}
export const ModalGuideCompleted = ({ isOpen, setIsOpen, handleAccept, isLoading, handleClose }: ConfirmCompletedProps) => {

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Deseas guardar la GUIA?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta Acción NO podrá ser revertida.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex gap-2 items-center justify-end'>
                    <Button onClick={handleClose} disabled={isLoading} variant="outline">Cancel</Button>
                    <Button onClick={handleAccept} disabled={isLoading} variant="default">{isLoading ? "Guardando..." : "Guardar"}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
