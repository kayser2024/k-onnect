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
    console.log({ data }, 'DATA INCIDENCIA BY ORDER')

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
                                    <TableHead className="w-[200px]">Motivo</TableHead>
                                    <TableHead className='w-[100px]'>Estado</TableHead>
                                    <TableHead className="w-[200px]">Boleta Incidencia</TableHead>
                                    <TableHead className='w-[150px]'>Usuario</TableHead>
                                    <TableHead className='w-[250px]'>Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((p: any) => (
                                    <TableRow key={p.IncidenceID}>
                                        <TableCell >{p.Description}</TableCell>
                                        <TableCell className='text-right flex items-center justify-between'>{p.IsCompleted ? "Completado" : "Pendiente"}</TableCell>
                                        <TableCell className="font-medium w-[200px]">{p.InvoiceIncidence}</TableCell>
                                        <TableCell>Administrador(System)</TableCell>
                                        <TableCell className='w-[250px]'>{formatDate(new Date(p.CreatedAt).toISOString())}</TableCell>
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
