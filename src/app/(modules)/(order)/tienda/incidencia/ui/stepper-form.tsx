'use client'

import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TableCompare } from "./table-compare";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateIncidence_ReceiveDispatch } from "@/actions/order/Incidencia";
import { IncidenceLogs } from "@prisma/client";

interface Product {
    CodProd: string,
    CodEan: string,
    ProdQuantity: number,
}

interface IncidentProduct {
    CodEan: string,
    CodProd: string,
    ProdQuantity: number,
    ProdSubtotal: number,
    Description: string,
    CreatedAt: Date
}

interface Incident {
    IncidenceID: number,
    OrdenID: number,
    InvoiceOriginal: string,
    InvoiceIncidence: string,
    NCIncidence: string,
    TypeIncidenceID: number,
    IsCompleted: boolean,
    Description: string,
    PickupPointID: number,
    CreatedAt: Date,
    IncidenceLogs: IncidentProduct[]
}

interface StepperProps {
    handleCleanList: () => void;
    cod: string
    setCod: (cod: string) => void;
    setMessage: (message: string) => void;
    productsIncidence: Incident,
    products: IncidentProduct[]
    setProducts: (products: IncidentProduct[]) => void
    handleCompare: () => boolean | undefined;
    validationStep: string
}

const Stepper = ({ handleCleanList, cod, setCod, setMessage, productsIncidence, products, setProducts, handleCompare, validationStep }: StepperProps) => {
    const [step, setStep] = useState(1);
    const [comments, setComments] = useState("");
    // traer de la bd los datos de la incidencia🚩

    console.log({ productsIncidence }, 'OBTENER EL ID')
    const handleNext = async () => {

        // si existe discrepancies 
        const discrepancies = handleCompare()

        if (!discrepancies) {
            toast.success("Lista de productos son correctos")
        }
        // TODO: actualizar en la tabla inciencia  recibidos, fecha 🚩
        const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, comments: '', isConfirmed: false })

        console.log({ result }, 'RESULT DEL UPDATE')
        if (step < 2 && !discrepancies) setStep(step + 1);


    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cod.trim()) {
            toast.warning("Ingresar un código válido");
            return;
        }

        // Buscar el producto en la lista de incidencias
        const existingIncidenceProduct = productsIncidence.IncidenceLogs.filter((f: IncidentProduct) => f.Description === validationStep).find(
            (item: IncidentProduct) => item.CodProd === cod || item.CodEan === cod
        );

        if (!existingIncidenceProduct) {
            toast.warning("El producto no pertenece a la lista de Incidencia");
            return;
        }

        // Verificar si el producto ya está en la lista de productos ingresados
        const existingProductIndex = products.findIndex(
            (product: Product) => product.CodProd === cod || product.CodEan === cod
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


        console.log(products)
        // Limpiar el campo de código después de agregarlo
        setCod("");
        toast.success("Producto agregado correctamente");
    };


    const handleFinish = async () => {


        // comparar los productos a entregar 
        console.log("Finalizar step")

        // TODO: actualizar en la tabla inciencia  recibidos, fecha, enviar el recibido conforme y comentario 🚩
        const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, isConfirmed: false, comments: comments })



        console.log(result)
    }


    return (
        <div className="w-full mx-auto">
            {/* Stepper Header */}
            <div className="mb-8">

                <div className="flex items-center justify-between mb-4">
                    {["Recibir", "Entregar"].map((label, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex-1 text-center py-2 border-b-2",
                                step === index + 1 ? "border-blue-500 font-bold" : "border-gray-300 text-gray-500"
                            )}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Check className="text-white rounded-full p-[1px] font-bold text-center bg-green-500" size={15} />
                                <span>{label}</span>
                            </div>
                        </div>
                    ))}


                </div>
                <div className="flex gap-2 w-full">

                    <form onSubmit={handleSubmit} className='w-full'>
                        <label htmlFor="orden" className="text-sm font-bold">Cod. Producto</label>
                        <Input placeholder='Ingresar Cod. Sap o Cod. Ean' value={cod} onChange={e => { setCod(e.target.value); setMessage("") }} className='w-full' />
                    </form>

                    <Button variant='destructive' className='mt-5' onClick={handleCleanList}>Limpiar Lista</Button>
                </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
                <div className="space-y-4">
                    {/* Tabla de "Recibir" */}
                    <TableCompare productsIncidence={productsIncidence} products={products} type={validationStep} />
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    {/* Tabla de "Entregar Productos" */}

                    <TableCompare productsIncidence={productsIncidence} products={products} type={validationStep} />



                </div>
            )}
            {validationStep === "CHANGE" &&
                <div className="">

                    <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id="terms" />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Recibió conforme
                        </label>
                    </div>
                    <Input placeholder="Agregar comentario" onChange={(e) => setComments(e.target.value)} value={comments} />
                </div>
            }
            {/* Buttons */}
            <div className="flex items-center justify-between mt-8">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                    Atrás
                </Button>
                {step < 2 ? (
                    <Button onClick={handleNext} disabled={step === 2}>
                        Siguiente
                    </Button>
                ) : (
                    <Button onClick={handleFinish}>Guardar</Button>
                )}
            </div>
        </div>
    );
};

export default Stepper;
