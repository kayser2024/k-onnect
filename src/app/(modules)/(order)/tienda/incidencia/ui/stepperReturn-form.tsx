'use client'

import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableCompare } from "./table-compare";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { getIncidenceByID, updateIncidence_ReceiveDispatch } from "@/actions/order/Incidencia";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

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
    IncidenceID: number;
    OrdenID: number;
    InvoiceOriginal: string;
    InvoiceIncidence: string;
    NCIncidence: string;
    TypeIncidenceID: number;
    IsCompleted: boolean;
    Description: string;
    PickupPointID: number;
    CreatedAt: Date;
    Dispatched: boolean;
    DispatchedDate: Date;
    ReceivedDate: Date;
    Received: boolean;
    Comments: string;
    IsConfirmed: boolean;
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
    handleCompare: (productsDb: any, productsList: any) => boolean | undefined;
    validationStep: string
}

const StepperReturn = ({ handleCleanList, cod, setCod, setMessage, productsIncidence, products, setProducts, handleCompare, validationStep }: StepperProps) => {
    const [step, setStep] = useState(1);
    const [comments, setComments] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    console.log({ productsIncidence }, 'PRODUCTS WITH INCIDENCE RETURN')

    // verificar si la incidencia ya tiene productos recibidos y traer la fecha

    const { data, refetch, isLoading } = useQuery({
        queryKey: ["IncidenceId", productsIncidence?.IncidenceID],
        queryFn: () => getIncidenceByID(productsIncidence.IncidenceID),
        enabled: !!productsIncidence?.IncidenceID
    });
    console.log({ data }, 'DATA INCIDENCE BY ID')

    const handleNext = async () => {

        // TODO: Filtrar los productos🚩
        const productsReturned = productsIncidence.IncidenceLogs.filter(f => { f.Description === 'ORIGIN' })


        // ValidationStep==='ORIGIN'
        // si existe discrepancies 
        const discrepancies = handleCompare(productsReturned, products)

        if (!discrepancies) {
            toast.success("Lista de productos son correctos")
        }
        // TODO: actualizar en la tabla inciencia  recibidos, fecha 🚩
        // const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, comments: '', isConfirmed: false })

        // console.log({ result }, 'RESULT DEL UPDATE')
        if (step < 2 && !discrepancies) setStep(step + 1);


        //   ValidationStep==='CHANGE'


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
        const existingIncidenceProduct = productsIncidence.IncidenceLogs.filter((f: IncidentProduct) => f.Description === 'RETURN').find(
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


        console.log(products)
        // Limpiar el campo de código después de agregarlo
        setCod("");
        toast.success("Producto agregado correctamente");
    };


    const handleFinish = async () => {


        // comparar los productos a entregar 
        console.log("Finalizar step")

        // TODO: actualizar en la tabla inciencia  recibidos, fecha, enviar el recibido conforme y comentario 🚩
        const result = await updateIncidence_ReceiveDispatch(productsIncidence.IncidenceID, { type: validationStep, isConfirmed: isChecked, comments: comments })



        console.log(result)
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

export default StepperReturn;
