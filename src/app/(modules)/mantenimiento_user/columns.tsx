import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { format } from 'date-fns';
import { User } from '@/types/User';
import { LiaUserEditSolid } from 'react-icons/lia';
import { RiLockPasswordLine } from "react-icons/ri";
import { Switch } from '@/components/ui/switch';

// Define las columnas como una constante, esperando directamente la función handleOpenModal como parámetro
export const columns = (handleOpenModal: (action: string, id: number, currentStatus?: boolean) => void): ColumnDef<any>[] => [
    {
        accessorKey: "index",
        header: "#",
        cell: (info: any) => info.row.index + 1,
    },
    {
        id: "name",
        accessorKey: "user_name",
        header: "Usuario",
        cell: ({ row }: any) => {
            const nombre = row.original.name;
            const apellido = row.original.lastName;
            return <>{nombre}</>;
        }
    },
    {
        id: "email",
        accessorKey: "email_user",
        header: "E-mail",
        cell: ({ row }: any) => {
            const email = row.original.email;
            return <>{email}</>;
        }
    },
    {
        accessorKey: "id_rol",
        header: "Rol",
        cell: ({ row }: any) => {
            const rol = row.original.rolId;
            return <>{rol}</>;
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }: any) => {
            const id = row.original.dni;

            const handleStatusToggle = () => {
                const currentStatus = row.getValue("status");
                handleOpenModal("delete", id, !currentStatus);
            };

            return (
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <Switch onChange={handleStatusToggle} checked={row.getValue("status")} />
                    </label>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Acción",
        cell: ({ row }: any) => {
            const id = row.original.dni;

            return (
                <div className="flex gap-2 justify-center items-center">
                    <LiaUserEditSolid
                        size={20}
                        className="text-warning cursor-pointer"
                        title="Editar"
                        onClick={() => handleOpenModal("edit", id)}
                    />
                    <RiLockPasswordLine
                        size={20}
                        className="text-blue-400 cursor-pointer"
                        title="Resetear Contraseña"
                        onClick={() => handleOpenModal("reset", id)}
                    />
                </div>
            );
        }
    },
];
