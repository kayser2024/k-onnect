'use client'
import React, { useEffect, useState } from 'react'
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
    NcIncidence: string,
    InvoiceIncidence: string
}

export const InputInvoiceModal = ({ isOpen, setIsOpenModal, handleClose, handleSave, isLoading, NcIncidence, InvoiceIncidence }: InputInvoiceModalProps) => {
    const [nc, setNc] = useState(NcIncidence);
    const [invoice, setInvoice] = useState(InvoiceIncidence);
    const [message, setMessage] = useState('');

    const handleAccept = async () => {
        try {
            if (!nc) {
                setMessage("La N.C. es obligatorio")
                return;
            } else {
                handleSave({ nc, invoice });
            }

        } catch (error: any) {
            console.log(error.message)
        }
    }

    // Sincronizar estados locales con las props
    useEffect(() => {
        setNc(NcIncidence);
        setInvoice(InvoiceIncidence);
    }, [NcIncidence, InvoiceIncidence]);

    return (
        <AlertDialog onOpenChange={setIsOpenModal} open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>INGRESAR INCIDENCIA</AlertDialogTitle>

                    <AlertDialogDescription className='flex flex-col gap-2'>
                        <div className="">
                            <Label className='text-sm text-slate-500 font-semibold'>Ingrese NC:</Label>
                            <Input placeholder='BW17-0001' className={`uppercase ${message ? 'border-red-500' : ''}`} required value={nc} onChange={(e) => { setNc(e.target.value.toUpperCase()); setMessage("") }} />

                        </div>

                        <div className="">
                            <Label className='text-sm text-slate-500'>Ingrese Boleta:</Label>
                            <Input placeholder='BW17-0001' className='uppercase' value={invoice} onChange={(e) => setInvoice(e.target.value.toUpperCase())} />
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
