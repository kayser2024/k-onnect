import { ColumnDef } from '@tanstack/react-table';
import { PickupPoint } from '@/types/Establec';
import { LuPencilLine } from "react-icons/lu";

export const columns = (handleOpenModal: (action: string, id: number) => void): ColumnDef<PickupPoint>[] => [
    {
        accessorKey: "PickupPointID",
        header: "#",
        cell: (info: any) => info.row.index + 1,
    },
    {
        id: "name",
        accessorKey: "Description",
        header: "Nombre Tienda",
        cell: ({ row }) => {
            const nombre = row.original.Description;
            return <div className='text-xs md:text-sm w-[300px] md:[350px] truncate'>{nombre}</div>;
        },
        filterFn: (row, id, value) => {
            const estado = row.original.Description;
            return estado
                ? estado.toLowerCase().includes(value.toLowerCase())
                : false;
        },
    },
    {
        id: "address",
        accessorKey: "Address",
        header: "Dirección",
        cell: ({ row }) => {
            const email = row.original.Address;
            return <div className='w-[300px] truncate md:w-[500px]'>{email}</div>;
        }
    },
    {
        id: "district",
        accessorKey: "District",
        header: "Distrito",
        cell: ({ row }) => {
            const email = row.original.District;
            return <>{email}</>;
        }
    },
    {
        id: "province",
        accessorKey: "Province",
        header: "Provincia",
        cell: ({ row }) => {
            const email = row.original.Province;
            return <>{email}</>;
        }
    },
    {
        id: "department",
        accessorKey: "Department",
        header: "Departamento",
        cell: ({ row }) => {
            const email = row.original.Department;
            return <>{email}</>;
        }
    },
    {
        id: "locationCode",
        accessorKey: "LocationCode",
        header: "Ubigeo",
        cell: ({ row }) => {

            return <>{row.original.LocationCode}</>;
        }
    },
    {
        id: "actions",
        header: "Acción",
        cell: ({ row }) => {
            const id = row.original.PickupPointID;

            return (
                <div className="flex gap-2 justify-center items-center">
                    <LuPencilLine
                        size={20}
                        className="text-blue-600 cursor-pointer"
                        title="Editar"
                        onClick={() => handleOpenModal("edit", id)}
                    />
                </div>
            );
        }
    },
];
