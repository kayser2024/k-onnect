import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import { ProductSelectList } from './product-select-list'
import { ProductToChangeList } from './product-to-change.list'
import { RiFileExcel2Line } from 'react-icons/ri'
import { TbStatusChange } from 'react-icons/tb'
import { SelectProductChange } from './select-product-change'
import { toast } from 'sonner'


interface ProductChangeModalProps {
    openModal: boolean,
    setOpenModal: (openModal: boolean) => void
    handleDescargaCambio: () => void
    handleCambio: () => void
    table: any
}

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: number;
}
export const ProductChangeModal = ({ openModal, setOpenModal, handleDescargaCambio, handleCambio, table }: ProductChangeModalProps) => {

    const [motivoCambio, setMotivoCambio] = useState("")
    const [loading, setLoading] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [invoice, setInvoice] = useState("")
    const [newProducts, setNewProducts] = useState<Product[] | []>([])


    // Hacemos que recuerde el motivo de cambio
    const manejarCambioMotivo = (value: string) => {
        setMotivoCambio(value)
    }



    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>

            {/* Modal Cambio Producto */}
            <DialogContent className="max-h-[90%] md:max-w-screen-md lg:max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl uppercase text-center">CAMBIAR PRODUCTO</DialogTitle>
                    {/* <DrawerDescription>Accion solicitada para generar linea de excel, salida de cambio, notificacion de discord</DrawerDescription> */}
                </DialogHeader>


                {/* Seleccionar Motivo de Cambio */}
                <div className="m-4 grid grid-cols-2 gap-2 ">
                    <div className="">
                        <Label htmlFor="selectMotivo">Seleccionar Motivo</Label>
                        <Select onValueChange={manejarCambioMotivo}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent id="selectMotivo">
                                <SelectGroup>
                                    <SelectItem value="Cambio a pedido del cliente por talla o modelo">Cambio a pedido del cliente por talla o modelo</SelectItem>
                                    <SelectItem value="Cambio por falta de stock">Cambio por falta de stock</SelectItem>
                                    <SelectItem value="Cambio por prenda fallada">Cambio por prenda fallada</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ingresar Incidencia */}
                    <div className="">
                        <Label htmlFor="invoice" className="text-right">#Boleta Incidencia</Label>
                        <Input id="invoice" className=" uppercase" placeholder="B001-123" onChange={(e) => setInvoice(e.target.value)} value={invoice} />
                    </div>

                    {/* Escoger Productos Nuevos */}

                    <SelectProductChange setNewProducts={setNewProducts} newProducts={newProducts} />
                </div>


                {/* Tabla de Productos a Cambiar */}

                <div className="grid grid-cols-2 ">
                    <div className="grid-cols-1">

                        {/* <TablaRealizarCambio /> */}
                        <h3 className="text-lg mb-2">Lista de Productos</h3>
                        <ProductSelectList productsSelect={table.getSelectedRowModel().rows.map((row) => row.original as ProductoTable)} />
                    </div>
                    <div className="grid-cols-1">
                        <h3 className="text-lg mb-2"> Nuevos Productos</h3>
                        <ProductToChangeList newProducts={newProducts} setNewProducts={setNewProducts} />
                    </div>
                </div>

                <DialogFooter className="flex gap-2 flex-row items-center justify-end my-4">
                    <Button onClick={handleDescargaCambio} variant='secondary'><RiFileExcel2Line size={25} className="text-gren-400" />Descargar Salida de Cambio</Button>
                    <Button onClick={handleCambio} disabled={loading} variant="default"><TbStatusChange size={25} /> {loading ? 'Guardando...' : 'Realizar Cambio'}</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
