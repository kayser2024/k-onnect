import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Detail, ResponseGuia } from "@/types/Guia"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
// import Image from "next/image"



export const columns = (handleIncrement: (id: number, increment: number) => void): ColumnDef<Detail, any>[] => [
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

            return <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" disabled={row.original.QuantityPicks < 1} onClick={() => handleIncrement(row.original.NoteGuideDetailsID, -1)}>-</Button>

                <span className="text-lg text-center">{row.original.QuantityPicks}</span>

                <Button size="sm" variant="outline" onClick={() => handleIncrement(row.original.NoteGuideDetailsID, 1)}>+</Button>
            </div>;

        }
    }
]