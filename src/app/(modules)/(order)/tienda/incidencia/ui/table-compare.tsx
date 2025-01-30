import React, { FormEvent } from 'react'

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
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


interface IncidentProduct {
    CodProd: string,
    CodEan: string,
    ProdQuantity: number,
    ImageURL?: string
}



export interface ProductIncidence {
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
    IncidenceLogs: IncidenceLog[];
}

export interface IncidenceLog {
    CodEan: string;
    CodProd: string;
    ProdQuantity: number;
    ProdSubtotal: number;
    Description: string;
    ImageURL?: string
    CreatedAt: Date;
}


interface TableCompareProps {
    productsIncidence: ProductIncidence,
    products: IncidentProduct[]
    type: string
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void
    handleCleanList: () => void
    cod: string
    setCod: (cod: string) => void
    setMessage: (message: string) => void
}
export const TableCompare = ({ productsIncidence, products, type, handleSubmit, handleCleanList, cod, setCod, setMessage }: TableCompareProps) => {
    console.log(productsIncidence)
    return (
        <div className="flex flex-col gap-2">

            <div className="flex gap-2 w-full">
                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-1'>
                    <label htmlFor="orden" className="text-sm font-semibold">Cod. Producto</label>
                    <Input placeholder='Ingresar Cod. Sap o Cod. Ean' value={cod} onChange={e => { setCod(e.target.value); setMessage("") }} className='w-full' />
                </form>

                <Button variant='destructive' className='mt-6' onClick={handleCleanList}>Limpiar Lista</Button>
            </div>
            <div className="flex flex-row gap-2 mt-2">
                <Table className='max-h-64'>
                    <TableCaption>Lista de Productos Originales.</TableCaption>
                    <TableHeader>
                        <TableRow className='bg-slate-500 hover:bg-slate-600'>
                            <TableHead className='text-white'>PRODUCTO</TableHead>
                            <TableHead className="text-white text-center">CANT.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsIncidence?.IncidenceLogs?.filter((p: any) => p.Description === type).map((p: IncidentProduct) =>
                            <TableRow key={p.CodEan} className='bg-slate-100 border border-red-700'>
                                <TableCell className='flex gap-1'>
                                    <Image height={80} width={80} src={p.ImageURL || `https://www.smarttools.com.mx/wp-content/uploads/2019/05/imagen-no-disponible.png`} alt={p.CodProd} className='object-cover' />
                                    <div className="flex flex-col gap-1">
                                        <p className='text-sm font-semibold'>Cod. Sap:</p>
                                        <span className='text-xs'>{p.CodProd}</span>


                                        <p className='text-sm font-semibold'>Cod. Ean:</p>
                                        <span className='text-xs'>{p.CodEan}</span>

                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-center font-semibold">{p.ProdQuantity}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>

                <Separator orientation='vertical' />


                <Table className='max-h-64'>
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
            </div>

        </div>
    )
}
