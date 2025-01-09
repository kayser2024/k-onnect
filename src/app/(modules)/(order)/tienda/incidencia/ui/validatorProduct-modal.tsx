'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import Stepper from './stepper-form'
import { X } from 'lucide-react'
import StepperReturn from './stepperReturn-form'
import { Incidence, IncidenceLog } from '@/types/IncidenceDB'

interface ValidatorProductModalProps {
    isOpen: boolean
    setIsOpenModal: (isOpen: boolean) => void
    handleAccept: () => void
    handleClose: () => void
    isLoading: boolean
    productsIncidence: any
    fnRefetch: () => void
}

export const ValidatorProductModal = ({ setIsOpenModal, isOpen, handleAccept, handleClose, isLoading, productsIncidence,fnRefetch }: ValidatorProductModalProps) => {

    const [message, setMessage] = useState("");
    const [cod, setCod] = useState("");
    const [products, setProducts] = useState<IncidenceLog[] | []>([]);
    const [validationStep, setValidationStep] = useState<"ORIGIN" | "CHANGE" | "RETURN">("ORIGIN");
    const [productsChange, setProductsChange] = useState<IncidenceLog[]>([]);




    const handleCleanList = () => {

        if (validationStep === "ORIGIN") {
            setProducts([]);

        }

        if (validationStep === "CHANGE") {
            setProductsChange([])
        }
        setMessage("");
        setCod("");
    };


    // Efecto para limpiar productos y mensajes al abrir/cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            // Limpia el estado cuando el modal se cierra
            setProducts([]);
            setProductsChange([]);
            setMessage("");
            setCod("");
            setValidationStep("ORIGIN")
        }
    }, [isOpen]);

    return (
        <AlertDialog onOpenChange={setIsOpenModal} open={isOpen} >
            <AlertDialogContent className='max-w-screen-md'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>Validar Productos</AlertDialogTitle>
                    <div className="absolute right-4 top-2 cursor-pointer" onClick={handleClose}><X /></div>

                    <AlertDialogDescription className='flex flex-col gap-4'>


                        {
                            productsIncidence.TypeIncidenceID == 3  //typeIncidenceID 1 => Cambio Product
                                ? <Stepper
                                    cod={cod}
                                    setCod={setCod}
                                    setMessage={setMessage}
                                    handleCleanList={handleCleanList}
                                    productsIncidence={productsIncidence}
                                    products={products}
                                    setProducts={setProducts}
                                    productsChange={productsChange}
                                    setProductsChange={setProductsChange}
                                    validationStep={validationStep}
                                    setValidationStep={setValidationStep}
                                    setIsOpenModal={setIsOpenModal}
                                    fnRefetch={fnRefetch}
                                />
                                : <StepperReturn
                                    cod={cod}
                                    setCod={setCod}
                                    setMessage={setMessage}
                                    handleCleanList={handleCleanList}
                                    productsIncidence={productsIncidence}
                                    products={products}
                                    setProducts={setProducts}
                                    validationStep={validationStep}
                                    setIsOpenModal={setIsOpenModal}
                                    fnRefetch={fnRefetch}
                                />
                        }

                        {message ? <div className='text-red-500 text-xs'>{message}</div> : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog >
    )
}
