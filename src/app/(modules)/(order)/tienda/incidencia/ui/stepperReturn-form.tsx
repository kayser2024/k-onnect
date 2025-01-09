'use client'

import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableCompare } from "./table-compare";
import { toast } from "sonner";
import { getIncidenceByID, updateIncidence_ReceiveDispatch } from "@/actions/order/Incidencia";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Incidence, IncidenceLog } from "@/types/IncidenceDB";
import { handleCompareTableProducts } from "@/helpers/compareTableProducts";

interface Product {
    CodProd: string,
    CodEan: string,
    ProdQuantity: number,
}


interface StepperProps {
    handleCleanList: () => void;
    cod: string
    setCod: (cod: string) => void;
    setMessage: (message: string) => void;
    productsIncidence: Incidence,
    products: IncidenceLog[]
    setProducts: (products: IncidenceLog[]) => void
    validationStep: string
    setIsOpenModal: (value: boolean) => void;
    fnRefetch: () => void
}

const StepperReturn = ({ handleCleanList, cod, setCod, setMessage, productsIncidence, products, setProducts, validationStep, setIsOpenModal, fnRefetch }: StepperProps) => {
    const [step, setStep] = useState(1);
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false)
    // const [isChecked, setIsChecked] = useState(false);


    const handleNext = async () => {

        // const discrepancies = handleCompare(productsReturned, products, "RETURN")
        const discrepancies = handleCompareTableProducts(productsIncidence, products, "RETURN")

        if (discrepancies.error) {
            toast.warning(discrepancies.message)
        } else {
            // TODO: actualizar en la tabla inciencia  recibidos, fecha 🚩
            // const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, comments: '', isConfirmed: false })
            console.log("ENTRANDO AL SIGUIENTE PASO")
            if (step < 2) setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };


    // Función para insertar codProduct en la tabla comparativa
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cod.trim()) {
            toast.warning("Ingresar un código válido");
            return;
        }

        // Buscar el producto en la lista de incidencias
        const existingIncidenceProduct = productsIncidence.IncidenceLogs.filter((f: IncidenceLog) => f.Description === 'RETURN').find(
            (item: IncidenceLog) => item.CodProd === cod || item.CodEan === cod
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
            setProducts(updatedProducts)

        } else {
            // Si no existe, agregar el producto con la cantidad inicial
            setProducts([
                ...products,
                {
                    ...existingIncidenceProduct,
                    ProdQuantity: 1,
                },
            ])

        }

        // console.log(products)
        // Limpiar el campo de código después de agregarlo
        setCod("");
        // toast.success("Producto agregado correctamente");
    };


    const handleFinish = async () => {
        setLoading(true);

        // comparar los productos a entregar 
        console.log("Finalizar step")
        try {
            // TODO: actualizar en la tabla inciencia  recibidos, fecha, enviar el recibido conforme y comentario 🚩
            const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, isConfirmed: false, comments: comments })
            toast.success("Incidencia Actualizado");
            // enviar una notificación a ATC para indicarle sobre la incidencia fué actualizada


        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsOpenModal(false)
            setLoading(false)
            fnRefetch()
        }




    }


    return (
        <div className="w-full mx-auto">
            {/* Stepper Header */}
            <div className="mb-8">

                <div className="flex items-center justify-between mb-4">
                    {["Recibir", "Finalizar"].map((label, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex-1 text-center py-2 border-b-2",
                                step === index + 1 ? "border-blue-500 font-bold" : "border-gray-300 text-gray-500"
                            )}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>{label}</span>
                            </div>
                        </div>
                    ))}


                </div>

            </div>

            {/* Step Content */}
            {step === 1 && (
                <div className="space-y-4">
                    {/* Tabla de "Recibir" */}
                    <TableCompare
                        productsIncidence={productsIncidence}
                        products={products}
                        type="RETURN"
                        handleSubmit={handleSubmit}
                        handleCleanList={handleCleanList}
                        cod={cod}
                        setCod={setCod}
                        setMessage={setMessage}
                    />


                </div>
            )}



            {
                step === 2 && (
                    <div className="flex flex-col gap-1 mt-4 border p-2 rounded-md bg-slate-100">

                        {/* Formulario para agregar detalles o foto */}
                        <Label className="mb-1">Comentario:</Label>
                        <Textarea placeholder="Agregar comentario" onChange={(e) => setComments(e.target.value)} value={comments} />


                        {/* ADJUNTAR IMAGEN PARA OBSERVACIONES */}




                        {/* <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                                id="terms"
                                onCheckedChange={(prev) => setIsChecked(!!prev)}
                                checked={isChecked}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Recibió conforme
                            </label>
                        </div> */}
                    </div>
                )
            }
            {/* {validationStep === "CHANGE" &&
                
            } */}
            {/* Buttons */}
            <div className="flex items-center justify-between mt-8">
                <Button variant="outline" onClick={handleBack} disabled={step === 1} >
                    Atrás
                </Button>
                {step < 2 ? (
                    <Button onClick={handleNext} disabled={step === 2}>
                        Siguiente
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                )}
            </div>
        </div>
    );
};

export default StepperReturn;
