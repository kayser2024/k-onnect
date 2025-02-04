import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Detail, ResponseGuia } from "@/types/Guia"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
// import Image from "next/image"



export const columns: ColumnDef<Detail, any>[] = [
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => {
            return <div className="flex gap-1 min-w-[150px] items-center justify-start" title={row.original.Description}>
                <Image src={row.original.Image1} width={70} height={70} alt={row.original.ProductCode} className="h-[70px] w-auto object-cover" />
                <div className="flex flex-col gap-1">
                    <span className="text-xs truncate w-[150px] sm:w-[200px] md:w-[500px] font-semibold">{row.original.Description}</span>
                    <p className="text-xs font-semibold">Cod. Barra : {" "}
                        <span className="text-xs font-normal">{row.original.BarCode}</span>
                    </p>
                    <p className="text-xs font-semibold">Cod. Prod. : {" "}
                        <span className="text-xs font-normal">{row.original.ProductCode}</span>
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

            return <div className="flex items-center justify-center gap-1">
                <Button size="sm" variant="outline">-</Button>

                <span className="text-lg text-center">{row.original.QuantityPicks}</span>

                <Button size="sm" variant="outline">+</Button>
            </div>;

        }
    }
]