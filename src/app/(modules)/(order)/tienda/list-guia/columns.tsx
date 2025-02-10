import { getNoteGuideDetailByID } from "@/actions/guia/getGuia";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helpers/convertDate";
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react";
import { TbEyeShare } from "react-icons/tb";
import { toast } from "sonner";
import { ModalGuideDetail } from "./ui/modal-guide-detail";
import { FileDown } from "lucide-react";
import { downloadExcel } from "@/actions/guia/download-excel";



// Componente para manejar la celda del producto
const ProductCell = ({ row }: { row: any }) => {
    const [guideDetails, setGuideDetails] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [resumen, setResumen] = useState<any>([]);
    const [loading, setLoading] = useState(false)

    const noteGuideId = row.original.NoteGuideID;
    const numberDoc = row.original.NumberDoc;

    const handleViewGuideDetail = async () => {
        setLoading(true);
        try {
            const resultNoteGuideDetail = await getNoteGuideDetailByID(noteGuideId);

            if (!resultNoteGuideDetail.ok) {
                toast.warning(resultNoteGuideDetail.message);
                return;
            }
            setGuideDetails(resultNoteGuideDetail.data);
            setResumen(resultNoteGuideDetail?.resumen);
            setOpenModal(true);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDownloadDetail = async () => {
        try {
            await downloadExcel(guideDetails, resumen, numberDoc);
            toast.success("Archivo descargado correctamente.");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="text-xs font-semibold min-w-[150px] flex gap-2 justify-center items-center" title={numberDoc}>
            {numberDoc}
            <ModalGuideDetail guideDetails={guideDetails} open={openModal} onOpenChange={setOpenModal} onOpen={handleViewGuideDetail} resumen={resumen} loading={loading}>
                <TbEyeShare
                    color="blue"
                    size={20}
                    className="hover:bg-blue-100 cursor-pointer"
                />
            </ModalGuideDetail>
            <div className="cursor-pointer" title="Descargar Excel" onClick={handleDownloadDetail}>

                <FileDown color="green" size={20} />
            </div>
        </div>
    );
};



export const columns: ColumnDef<any, any>[] = [
    {
        accessorKey: "product",
        header: "Nro Guía",
        cell: ProductCell
    },

    {
        accessorKey: "quantityTotal",
        header: "Total",
        cell: ({ row }) => {
            return <div className="text-center text-xs">{Number(row.original.Resumen.total)}</div>;
        }
    },
    {
        accessorKey: "quantityMissing",
        header: "Faltantes",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2">
                <span className="text-xs text-center">{row.original.Resumen.missing}</span>

            </div>;
        }
    },
    {
        accessorKey: "quantityPlus",
        header: "Sobrantes",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2">
                <span className="text-xs text-center">{row.original.Resumen.plus}</span>

            </div>;
        }
    },
    {
        accessorKey: "quantityNoList",
        header: "No List.",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2 min-w-[70px]">
                <span className="text-xs text-center">{row.original.Resumen.noList}</span>
            </div>;
        }
    },
    {
        accessorKey: "quantityRecep",
        header: "Tot. Picking",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2 min-w-[80px]">
                <span className="text-xs text-center">{row.original.Resumen.totalpicks}</span>

            </div>;
        }
    },
    {
        accessorKey: "date",
        header: "Fec. completado",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2 min-w-[150px]">
                <span className="text-xs text-center ">{formatDate(row.original.UpdatedAt)}</span>

            </div>;
        }
    },
    {
        accessorKey: "Status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.IsCompleted
            let text = status ? "Completado" : "Pendiente";

            return <div className="flex items-center justify-evenly gap-2">
                <Badge variant={status ? "success" : "outline"}>{text}</Badge>

            </div>;
        }
    },
    {
        accessorKey: "observation",
        header: "Observación",
        cell: ({ row }) => {

            return <div className="flex items-center justify-evenly gap-2">
                <span className="text-xs text-center">{row.original.Observation || "---"}</span>

            </div>;
        }
    }
]