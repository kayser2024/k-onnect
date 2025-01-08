'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import Stepper from './stepper-form'
import { X } from 'lucide-react'
import StepperReturn from './stepperReturn-form'

interface ValidatorProductModalProps {
    isOpen: boolean
    setIsOpenModal: (isOpen: boolean) => void
    handleAccept: () => void
    handleClose: () => void
    isLoading: boolean
    productsIncidence: any
}

interface IncidentProduct {
    CodEan: string,
    CodProd: string,
    ProdQuantity: number,
    ProdSubtotal: number,
    Description: string,
    CreatedAt: Date
}

export const ValidatorProductModal = ({ setIsOpenModal, isOpen, handleAccept, handleClose, isLoading, productsIncidence }: ValidatorProductModalProps) => {

    const [message, setMessage] = useState("");
    const [cod, setCod] = useState("");
    const [products, setProducts] = useState<IncidentProduct[] | []>([]);
    const [validationStep, setValidationStep] = useState<"ORIGIN" | "CHANGE" | "RETURN">("ORIGIN");
    const [productsChange, setProductsChange] = useState<IncidentProduct[] | []>([]);

    // TypeIncidenceID=
    // 1->Devolución Parcial
    // 2->Devolución Total
    // 3->Cambio Producto

    console.log({ id: productsIncidence.TypeIncidenceID }, 'productsIncidence')

    const handleCompareProducts = (productsDB: any, productsList: any) => {
        // Validar que las cantidades ingresadas coincidan con las originales
        const discrepancies = products.filter((product: IncidentProduct) => {

            const originalProduct = productsIncidence.IncidenceLogs.filter((f: any) => f.Description === validationStep).find(
                (item: IncidentProduct) => item.CodProd === product.CodProd
            );

            console.log({ originalProduct }, 'filter')
            // Si no encuentra el producto original, lo marca como discrepancia
            if (!originalProduct) {
                console.error(`Producto original no encontrado para: ${product.CodProd}`);
                return true;
            }

            // Verificar que las cantidades sean iguales
            return product.ProdQuantity !== originalProduct.ProdQuantity;
        });


        if (discrepancies.length > 0) {
            setMessage("Algunas cantidades ingresadas no coinciden con las cantidades originales. Verifique e intente de nuevo.");
            return;
        }


        // Si todas las cantidades coinciden, proceder con éxito
        toast.success(validationStep === "ORIGIN"
            ? "Productos 'origin' validados correctamente."
            : "Productos 'change' validados correctamente.");

        setProducts([]);
        setMessage("");

        if (validationStep === "ORIGIN") {
            // Pasar al siguiente paso
            setValidationStep("CHANGE")
        } else {
            // handleAccept();

        }
        setMessage("");

        return discrepancies.length > 0 ? true : false
    };


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
                                    handleCompare={handleCompareProducts}
                                    validationStep={validationStep}
                                />
                                : <StepperReturn
                                    cod={cod}
                                    setCod={setCod}
                                    setMessage={setMessage}
                                    handleCleanList={handleCleanList}
                                    productsIncidence={productsIncidence}
                                    products={products}
                                    setProducts={setProducts}
                                    handleCompare={handleCompareProducts}
                                    validationStep={validationStep}
                                />
                        }

                        {message ? <div className='text-red-500 text-xs'>{message}</div> : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog >
    )
}
