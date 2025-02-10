import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Detail, ResponseGuia } from "@/types/Guia"
import { ColumnDef } from "@tanstack/react-table"
import { Ellipsis, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export const columns = (handleIncrement: (id: number, increment: number) => void, handleDeleteProduct: (id: number) => void): ColumnDef<Detail, any>[] => [
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => {
            return <div className="flex gap-1 min-w-[150px] justify-start" title={row.original.Description}>
                <Image src={row.original.Image1} width={70} height={60} alt={row.original.ProductCode} className="h-[57px] w-auto object-cover" />
                <div className="flex flex-col gap-1">
                    <span className="text-xs truncate w-[160px] sm:w-[200px] md:w-[500px] font-semibold">{row.original.Description}</span>
                    <p className="text-xs font-semibold truncate w-[160px] sm:w-[200px] md:w-[500px]">Cod. Barra : {" "}
                        <span className="text-xs font-normal ">{row.original.BarCode}</span>
                    </p>
                    <p className="text-xs font-semibold truncate w-[160px] sm:w-[200px] md:w-[500px]">Cod. Prod. : {" "}
                        <span className="text-xs font-normal ">{row.original.ProductCode}</span>
                    </p>
                </div>
            </div>
        }
    },

    {
        accessorKey: "quantity",
        header: "Total",
        cell: ({ row }) => {
            return <div className="text-center text-lg">{Number(row.original.Quantity)}</div>;
        }
    },

    {
        accessorKey: "quantityRecep",
        header: "Total Recep.",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false)
            const [modalType, setModalType] = useState<'add' | 'delete' | null>(null)
            const [dropdownOpen, setDropdownOpen] = useState(false)
            const [qntyEdit, setQntyEdit] = useState("")
            const [error, setError] = useState("");

            const openModal = (type: 'add' | 'delete') => {
                setModalType(type);
                setIsOpen(true);
                setDropdownOpen(false); // Cerrar el dropdown al abrir el modal
            };

            const closeModal = () => {
                setIsOpen(false);
                setModalType(null);
                setDropdownOpen(false); // Reabrir el dropdown al cerrar el modal
            };

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = e.target.value;

                // Validar que solo se ingresen números
                if (/^\d*$/.test(inputValue)) {
                    // Convertir a número y aplicar límites
                    const numericValue = parseInt(inputValue, 10);
                    if (!isNaN(numericValue)) {
                        const maxValue = 1000;
                        if (numericValue >= maxValue) {
                            setError(`El valor no puede ser mayor que ${maxValue}`);
                            // setQntyEdit(maxValue.toString());
                        } else {
                            setError("");
                            setQntyEdit(inputValue);
                        }
                    } else {
                        setError("");
                        setQntyEdit("");
                    }
                }
            };

            const handleSave = async (DetailID: number) => {
                // actualizar en la bd
                try {
                    modalType === 'add'
                        ? handleIncrement(DetailID, Number(qntyEdit))
                        : handleDeleteProduct(DetailID)

                } catch (error: any) {
                    toast.error(error.message)
                } finally {
                    setQntyEdit("");

                }
            }

            return <div className="flex items-center justify-evenly gap-2">
                <span className="text-lg text-center">{row.original.QuantityPicks}</span>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger><Ellipsis size={16} stroke="blue" /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-2" onClick={() => { openModal('add') }}>
                            <Pencil size={16} color="#3B82F6" />Ingresar Items
                        </DropdownMenuItem>
                        {
                            !row.original.ExistInGuide &&
                            <DropdownMenuItem className="flex gap-2" onClick={() => { openModal('delete') }}>
                                <Trash2 size={16} color="#EF4444" />Eliminar Prod.
                            </DropdownMenuItem>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogTitle>{modalType === 'add' ? 'Ingresar Items' : 'Eliminar Producto'}</DialogTitle>
                        <DialogDescription>
                            {modalType === 'add' ? 'Agregar nuevos items a la lista.' : 'Eliminar el producto seleccionado.'}
                        </DialogDescription>

                        {
                            modalType === 'add' &&
                            <>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={Number(qntyEdit)}
                                    className="w-[200px] m-2 my-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={handleChange}
                                />
                                {error && <p className="text-red-500 text-xs">{error}</p>}
                            </>
                        }
                        <div className="mt-4 flex gap-2 justify-end items-center">
                            <Button
                                variant="outline"
                                onClick={closeModal}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onClick={() => handleSave(row.original.NoteGuideDetailsID)}
                                disabled={error.length > 0}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>;
        }
    }
]