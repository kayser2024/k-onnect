import React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { formatDate } from '@/helpers/convertDate';


interface ModalIncidenceProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    data: any;
    isLoading: boolean;
}
export const ModalIncidence = ({ isOpen, setIsOpen, data, isLoading }: ModalIncidenceProps) => {


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            {!isLoading &&
                <DialogContent className="max-w-screen-lg">
                    <DialogHeader>
                        <DialogTitle>Incidencias - {!isLoading && <>{data[0].Invoice}</>}</DialogTitle>
                        <DialogDescription>
                            {/* Make changes to your profile here. Click save when you're done. */}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className='max-w-screen-lg h-[400px]'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Producto</TableHead>
                                    <TableHead className="w-[200px]">Producto Cambiado</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead className='w-[100px]'>Devolucion</TableHead>
                                    <TableHead className='w-[250px]'>Fecha</TableHead>
                                    <TableHead className='w-[150px]'>Usuario</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((p: any) => (
                                    <TableRow key={p.CodProdOriginEAN}>
                                        <TableCell className="font-medium w-[200px]">{p.CodProd}</TableCell>
                                        <TableCell className="font-medium text-center w-[200px]">{p.CodProdChange || "-"}</TableCell>
                                        <TableCell >{p.Reason}</TableCell>
                                        <TableCell className='text-right flex items-center justify-between'><span>S/</span> {p.TotalRefund || <span>0.00</span>}</TableCell>
                                        <TableCell className='w-[250px]'>{formatDate(new Date(p.CreatedAt).toISOString())}</TableCell>
                                        <TableCell>Administrador(System)</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <DialogFooter>
                        {/* <Button type="submit">Save changes</Button> */}
                    </DialogFooter>
                </DialogContent>
            }
        </Dialog>
    )
}
