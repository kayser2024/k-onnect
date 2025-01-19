'use client'

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableCompare } from "./table-compare";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { getIncidenceByID, updateIncidence_ReceiveDispatch, updateIncidenceDispatched, updateIncidenceReceived } from "@/actions/order/Incidencia";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Incidence, IncidenceLog } from "@/types/IncidenceDB";
import { handleCompareTableProducts } from "@/helpers/compareTableProducts";
import { useQuery } from "@tanstack/react-query";

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
    productsChange: IncidenceLog[]
    setProductsChange: (product: IncidenceLog[]) => void
    validationStep: string
    setValidationStep: (value: "ORIGIN" | "CHANGE" | "RETURN") => void;
    setIsOpenModal: (value: boolean) => void;
    fnRefetch: () => void;
}

const Stepper = ({ handleCleanList, cod, setCod, setMessage, productsIncidence, products, setProducts, validationStep, productsChange, setProductsChange, setValidationStep, setIsOpenModal, fnRefetch }: StepperProps) => {
    const [step, setStep] = useState(productsIncidence.Received ? 2 : 1);
    const [comments, setComments] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ommitReceived, setOmmitReceived] = useState(false);
    const [ommitDispatched, setOmmitDispatched] = useState(false);

    const { IncidenceID } = productsIncidence;
    console.log({ productsIncidence });

    const handleNext = async () => {

        // si se omite la deciciciónde validar en "Recibir" entonces pasamos al siguiente step
        // si se omite la deciciciónde validar  "despachar" entonces pasamos al siguiente step
        if (ommitReceived || ommitDispatched) {
            step === 1 && updateIncidenceReceived(IncidenceID)
            if (step < 3) setStep(step + 1);
            setOmmitReceived(false)
            setValidationStep("CHANGE")

        } else {

            const discrepancies = handleCompareTableProducts(productsIncidence, (step === 1) ? products : productsChange, step === 1 ? "ORIGIN" : "CHANGE");
            console.log({ discrepancies })

            if (discrepancies.error) {
                toast.warning(discrepancies.message)
                return;
            } else {
                console.log({ validationStep })

                step === 1 && updateIncidenceReceived(IncidenceID)
                if (step < 3) setStep(step + 1);
                setValidationStep("CHANGE")
            }
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
        const existingIncidenceProduct = productsIncidence.IncidenceLogs.filter((f: IncidenceLog) => f.Description === (step === 1 ? "ORIGIN" : "CHANGE")).find(
            (item: IncidenceLog) => item.CodProd === cod || item.CodEan === cod
        );

        if (!existingIncidenceProduct) {
            toast.warning("El producto no pertenece a la lista de Incidencia");
            return;
        }
        // Seleccionar la lista a actualizar en función de validationStep
        const targetList = (step === 1) ? products : productsChange;
        const setTargetList = (step === 1) ? setProducts : setProductsChange;

        // Verificar si el producto ya está en la lista de productos ingresados
        const existingProductIndex = targetList.findIndex(
            (product: Product) => product.CodProd === cod || product.CodEan === cod
        );

        if (existingProductIndex !== -1) {
            // Si ya existe, incrementar la cantidad
            const updatedProducts = [...targetList];
            updatedProducts[existingProductIndex].ProdQuantity += 1;
            setTargetList(updatedProducts)

        } else {
            setTargetList([
                ...targetList,
                {
                    ...existingIncidenceProduct,
                    ProdQuantity: 1,
                },
            ]);
        }

        // Limpiar el campo de código después de agregarlo
        setCod("");
        // toast.success("Producto agregado correctamente");
    };


    const handleFinish = async () => {
        setLoading(true);
        try {
            // actualizar en la tabla inciencia  recibidos, fecha, enviar el recibido conforme y comentario 
            const result = await updateIncidenceDispatched(IncidenceID, { isConfirmed: isChecked, comments: comments })
            console.log(result);
            toast.success("Incidencia actualizada correctamente")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false);
            setIsOpenModal(false)
            fnRefetch();
        }

    }


    useEffect(() => {
        step === 2 && setValidationStep("CHANGE")
    }, []);

    return (
        <div className="w-full mx-auto">
            {/* Stepper Header */}
            <div className="mb-8">

                <div className="flex items-center justify-between mb-4">
                    {["Recibir", "Entregar", "Finalizar"].map((label, index) => (
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
                <div className=" flex flex-col">
                    {/* Tabla de "Recibir" */}
                    <TableCompare
                        productsIncidence={productsIncidence}
                        products={products}
                        type="ORIGIN"
                        handleSubmit={handleSubmit}
                        handleCleanList={handleCleanList}
                        cod={cod}
                        setCod={setCod}
                        setMessage={setMessage}
                    />

                    {/* Omitir Validación */}
                    <div className="flex  flex-col items-start space-x-2 mt-4">
                        <div className="flex gap-2 items-center">

                            <Checkbox id="terms" onCheckedChange={(checked) => setOmmitReceived(checked === true)} checked={ommitReceived} aria-label="Omitir Validación" />
                            <label
                                htmlFor="terms"
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${ommitReceived ? 'font-semibold' : ''}`}
                            >
                                Omitir Validación
                            </label>
                        </div>
                        <div className={`transition-opacity duration-300 ${ommitReceived ? 'opacity-100' : 'opacity-0'}`}>
                            {ommitReceived && <span className="text-orange-400 text-xs font-light">Me responsabilizo de los productos a recibir por el cliente.</span>}
                        </div>
                    </div>

                </div>
            )}


            {step === 2 && (
                <div className="space-y-4">
                    {/* Tabla de "Entregar Productos" */}

                    <TableCompare
                        productsIncidence={productsIncidence}
                        products={productsChange}
                        type="CHANGE"
                        handleSubmit={handleSubmit}
                        handleCleanList={handleCleanList}
                        cod={cod}
                        setCod={setCod}
                        setMessage={setMessage}
                    />

                    {/* Omitir validación */}
                    <div className="flex  flex-col items-start space-x-2 mt-4">
                        <div className="flex gap-2 items-center">

                            <Checkbox id="terms" onCheckedChange={(checked) => setOmmitReceived(checked === true)} checked={ommitReceived} aria-label="Omitir Validación" />
                            <label
                                htmlFor="terms"
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${ommitReceived ? 'font-semibold' : ''}`}
                            >
                                Omitir Validación
                            </label>
                        </div>
                        <div className={`transition-opacity duration-300 ${ommitReceived ? 'opacity-100' : 'opacity-0'}`}>
                            {ommitReceived && <span className="text-orange-400 text-xs font-light">Me responsabilizo de los productos que entrego al cliente.</span>}
                        </div>
                    </div>


                </div>
            )}

            {
                step === 3 && (
                    <div className="flex flex-col gap-1 mt-4 border p-2 rounded-md bg-slate-100">

                        {/* Formulario para agregar detalles o foto */}
                        <Label className="mb-1">Comentario:</Label>
                        <Textarea placeholder="Agregar comentario" onChange={(e) => setComments(e.target.value)} value={comments} />
                        <div className="flex items-center space-x-2 mt-4">
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
                        </div>
                    </div>
                )
            }
            {/* {validationStep === "CHANGE" &&
                
            } */}
            {/* Buttons */}
            <div className="flex items-center justify-end  mt-8">
                {/* <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                    Atrás
                </Button> */}
                {step < 3 ? (
                    <Button onClick={handleNext} disabled={step === 3}>
                        Siguiente
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                )}
            </div>
        </div>
    );
};

export default Stepper;
