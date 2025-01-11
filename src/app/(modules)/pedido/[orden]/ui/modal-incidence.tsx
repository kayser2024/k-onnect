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
import { Check } from 'lucide-react';


interface ModalIncidenceProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    data: any;
    isLoading: boolean;
}
export const ModalIncidence = ({ isOpen, setIsOpen, data, isLoading }: ModalIncidenceProps) => {

    console.log(data, '💀💀💀')
    // Users: {
    //     Name: 'Dummy',
    //     LastName: 'Dummy',
    //     Roles: { Description: 'ADMIN' }
    //   },
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            {!isLoading &&
                <DialogContent className="max-w-screen-lg">
                    <DialogHeader>
                        <DialogTitle>Listado de Incidencias </DialogTitle>
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
                                    <TableHead className="w-[200px]">N.C.</TableHead>
                                    <TableHead className="w-[200px]">Nva. Boleta</TableHead>
                                    <TableHead className='w-[150px]'>Usuario</TableHead>
                                    <TableHead className='w-[250px]'>Lugar Recepción</TableHead>
                                    <TableHead className='w-[250px]'>Fec. Creación</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                {data.length > 0 ? <>
                                    {data?.map((p: any) => (
                                        <TableRow key={p.IncidenceID} className={`${p.IsCompleted ? 'bg-green-200 hover:bg-green-100' : ''}`}>
                                            <TableCell >{p.Description}</TableCell>
                                            <TableCell className='text-center flex items-center justify-center '>{(p.TypeIncidenceID == 3) ? (p.IsCompleted ? <Check size={20} className='text-white bg-green-500 rounded-full' /> : "Pendiente") : (<>─</>)}</TableCell>
                                            <TableCell className="font-medium w-[200px]">{p.NCIncidence}</TableCell>
                                            <TableCell className="font-medium w-[200px]">{p.InvoiceIncidence}</TableCell>
                                            <TableCell>{p.Users.Name}({p.Users.Roles.Description})</TableCell>
                                            <TableCell className='w-[250px]'>{p.PickupPoints?.Description}</TableCell>
                                            <TableCell className='w-[250px]'>{formatDate(p.CreatedAt)}</TableCell>
                                        </TableRow>
                                    ))}
                                </>
                                    : <TableRow >
                                        <TableCell colSpan={5} className='text-center h-28'>
                                            Aún no cuenta con Incidencias
                                        </TableCell>
                                    </TableRow>
                                }
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
