'use client'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'


interface InputInvoiceModalProps {
    isOpen: boolean
    setIsOpenModal: (isOpen: boolean) => void
    handleClose: () => void
    handleSave: (data: any) => void
    isLoading: boolean
}

export const InputInvoiceModal = ({ isOpen, setIsOpenModal, handleClose, handleSave, isLoading }: InputInvoiceModalProps) => {

    const [nc, setNc] = useState('');
    const [invoice, setInvoice] = useState('');
    const [message, setMessage] = useState('');


    const handleAccept = async () => {
        try {
            if (!nc || !invoice) {
                setMessage("La N.C. es obligatorio")
                return;
            } else {
                handleSave({ nc, invoice });
            }



        } catch (error: any) {
            console.log(error.message)
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
                            <Input placeholder='BW17-0001' className={`${message ? 'border-red-500' : ''}`} required value={nc} onChange={(e) => { setNc(e.target.value); setMessage("") }} />

                        </div>

                        <div className="">
                            <Label className='text-sm text-slate-500'>Ingrese Boleta:</Label>
                            <Input placeholder='BW17-0001' value={invoice} onChange={(e) => setInvoice(e.target.value)} />
                        </div>
                        {message && <div className='text-red-500 text-xs'>{message}</div>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="ghost" onClick={() => { setMessage(""); handleClose() }} disabled={isLoading}>Cancelar</Button>
                    <Button variant="default" onClick={handleAccept} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar"}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
