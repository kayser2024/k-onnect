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
import { updateIsActive } from '@/actions/establecimiento/updateIsActive';
import { updateIsAvailable } from '@/actions/establecimiento/updateIsAvailable';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    type: string
    onClose: () => void;
    isLoading: boolean;
    setIsLoading(value: boolean): void;
    pickupID: number
    status: boolean
    onRefetch: () => void;
}
export const ModalAccept = ({ isOpen, type, onClose, isLoading, setIsLoading, pickupID, status, onRefetch }: Props) => {

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            if (type === 'isActive') {
                await updateIsActive(pickupID, status);
            }
            if (type === 'isAvailablePickup') {

                await updateIsAvailable(pickupID, status)
            }
            await onRefetch();
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false);
            onClose();
        }

    }

    return (
        <AlertDialog open={isOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro que deseas realizar el cambio?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esto Desactivará la Tienda
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='outline' onClick={onClose} disabled={isLoading}>Cancelar</Button>
                    <Button onClick={handleAccept} disabled={isLoading}>{isLoading ? 'Cargando...' : 'Aceptar'}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
