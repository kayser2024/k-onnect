import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import React, { useState } from 'react'


interface InputInvoiceModalProps {
    isOpen: boolean
    setIsOpenModal: (isOpen: boolean) => void
    handleSave: () => void
    handleCancel: () => void
}
export const InputInvoiceModal = ({ isOpen, setIsOpenModal, handleSave,handleCancel }: InputInvoiceModalProps) => {


    const handleAccept = async () => {
        try {
            handleSave();
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setIsOpenModal(false)
        }
    }


    return (
        <AlertDialog onOpenChange={setIsOpenModal} open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>INGRESAR INCIDENCIA</AlertDialogTitle>

                    <AlertDialogDescription className='flex flex-col gap-2'>
                        <div className="">
                            <Label className='text-sm text-slate-500 font-semibold'>Ingrese NC:</Label>
                            <Input placeholder='BW17-0001' required />
                        </div>

                        <div className="">
                            <Label className='text-sm text-slate-500'>Ingrese Boleta:</Label>
                            <Input placeholder='BW17-0001' />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
                    <Button variant="default" onClick={handleAccept}>Aceptar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
