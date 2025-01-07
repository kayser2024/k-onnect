'use client'

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import React, { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Stepper from './stepper-form'
import { Check, X } from 'lucide-react'

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
    const [cod, setCod] = useState("")
    const [products, setProducts] = useState<IncidentProduct[] | []>([]);
    const [validationStep, setValidationStep] = useState<"ORIGIN" | "CHANGE">("ORIGIN");
    const [productsChange, setProductsChange] = useState<IncidentProduct[] | []>([]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cod.trim()) {
            toast.warning("Ingresar un código válido");
            return;
        }

        // Buscar el producto en la lista de incidencias
        const existingIncidenceProduct = productsIncidence.IncidenceLogs.filter((f: IncidentProduct) => f.Description !== "CHANGE").find(
            (item: IncidentProduct) => item.CodProd === cod || item.CodEan === cod
        );

        if (!existingIncidenceProduct) {
            toast.warning("El producto no pertenece a la lista de Incidencia");
            return;
        }

        // Verificar si el producto ya está en la lista de productos ingresados
        const existingProductIndex = products.findIndex(
            (product: IncidentProduct) => product.CodProd === cod || product.CodEan === cod
        );

        if (existingProductIndex !== -1) {
            // Si ya existe, incrementar la cantidad
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex].ProdQuantity += 1;
            setProducts(updatedProducts);
        } else {
            // Si no existe, agregar el producto con la cantidad inicial
            setProducts([
                ...products,
                {
                    ...existingIncidenceProduct,
                    ProdQuantity: 1,
                },
            ]);
        }


        // Limpiar el campo de código después de agregarlo
        setCod("");
        toast.success("Producto agregado correctamente");
    };



    const handleSave = () => {
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
                        {/* <div className="flex gap-2 w-full">

                            <form onSubmit={handleSubmit} className='w-full'>
                                <label htmlFor="orden" className="text-sm font-bold">Cod. Producto</label>
                                <Input placeholder='Ingresar Cod. Sap o Cod. Ean' value={cod} onChange={e => { setCod(e.target.value); setMessage("") }} className='w-full' />
                            </form>

                            <Button variant='destructive' className='mt-5' onClick={handleCleanList}>Limpiar Lista</Button>
                        </div> */}

                        {/* Mostrar tabla  */}
                        {/* <div className="flex flex-row gap-2">

                            <Table className='min-h-64'>
                                <TableCaption>Lista de Productos Originales.</TableCaption>
                                <TableHeader>
                                    <TableRow className='bg-slate-500 hover:bg-slate-600'>
                                        <TableHead className='text-white uppercase'>Cod. Sap</TableHead>
                                        <TableHead className='text-white uppercase'>Cod. Ean</TableHead>
                                        <TableHead className="text-white text-right uppercase">Cant.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productsIncidence?.IncidenceLogs?.filter((p: any) => p.Description !== 'CHANGE').map((p: IncidentProduct) =>
                                        <TableRow key={p.CodEan} className='bg-slate-100'>
                                            <TableCell className='text-xs'>{p.CodProd}</TableCell>
                                            <TableCell className='text-xs'>{p.CodEan}</TableCell>
                                            <TableCell className="text-xs text-right">{p.ProdQuantity}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>

                            <Separator orientation='vertical' />


                            <Table className='min-h-64'>
                                <TableCaption>Lista de Productos Ingresados.</TableCaption>
                                <TableHeader>
                                    <TableRow className='bg-slate-500 text-white hover:bg-slate-600'>
                                        <TableHead className='text-white uppercase'>Cod. Sap</TableHead>
                                        <TableHead className='text-white uppercase'>Cod. Ean</TableHead>
                                        <TableHead className="text-white text-right uppercase">Cant.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {
                                        products.map((p: IncidentProduct) =>
                                            <TableRow key={p.CodEan} className=''>
                                                <TableCell className='text-xs'>{p.CodProd}</TableCell>
                                                <TableCell className='text-xs'>{p.CodEan}</TableCell>
                                                <TableCell className="text-right">{p.ProdQuantity}</TableCell>
                                            </TableRow>
                                        )
                                    }

                                </TableBody>

                            </Table>
                        </div> */}


                        <Stepper
                            cod={cod}
                            setCod={setCod}
                            setMessage={setMessage}
                            handleCleanList={handleCleanList}
                            productsIncidence={productsIncidence}
                            products={products}
                            setProducts={setProducts}
                            handleCompare={handleSave}
                            validationStep={validationStep}
                        />

                        {message ? <div className='text-red-500 text-xs'>{message}</div> : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {/* <AlertDialogFooter>
                    <Button variant="ghost" onClick={() => { setMessage(""); handleClose() }} disabled={isLoading}>Cancelar</Button>
                    <Button variant="default" onClick={handleSave} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar"}</Button>
                </AlertDialogFooter> */}
            </AlertDialogContent>
        </AlertDialog >
    )
}
