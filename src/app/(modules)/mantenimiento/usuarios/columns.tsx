import { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/types/User';
import { LiaUserEditSolid } from 'react-icons/lia';
import { RiLockPasswordLine } from "react-icons/ri";
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';


// Define las columnas como una constante, esperando directamente la función handleOpenModal como parámetro
export const columns = (handleOpenModal: (action: string, userID: number, currentStatus?: boolean, dni?: string) => void): ColumnDef<User>[] => [
    {
        accessorKey: "index",
        header: "#",
        cell: (info: any) => info.row.index + 1,
    },
    {
        id: "name",
        accessorKey: "user_name",
        // accessorFn: (row) => row.name,
        header: "Nombre",
        cell: ({ row }) => {
            const nombre = row.original.Name;
            const apellido = row.original.LastName;
            return <div className='truncate text-xs w-[100px]  md:text-sm md:w-[200px]'>{nombre} {apellido}</div>;
        },
        filterFn: (row, id, value) => {
            const estado = row.original.Name;
            return estado
                ? estado.toLowerCase().includes(value.toLowerCase())
                : false;
        },
    },
    {
        id: "email",
        accessorKey: "email_user",
        header: "Usuario",
        cell: ({ row }) => {
            const email = row.original.Email;
            return <>{email}</>;
        }
    },
    {
        accessorKey: "id_rol",
        header: "Rol",
        cell: ({ row }: any) => {
            const rol = row.original.RoleID;
            let result;
            if (rol == 1) result = 'ADMIN';
            if (rol == 2) result = 'SOPORTE';
            if (rol == 3) result = 'WEB MASTER';
            if (rol == 4) result = 'ATC';
            if (rol == 5) result = 'ALMACEN';
            if (rol == 6) result = 'TIENDA';
            return <Badge variant='outline'>{result}</Badge>;
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const userID = row.original.UserID;
            const currentStatus = row.original.Status;

            return (
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <Switch onCheckedChange={() => handleOpenModal('delete', userID, !currentStatus)} checked={currentStatus} />
                    </label>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Acción",
        cell: ({ row }) => {
            const userID = row.original.UserID;
            const dni = row.original.NroDoc;

            return (
                <div className="flex gap-2 justify-center items-center">
                    <LiaUserEditSolid
                        size={20}
                        className="text-blue-600 cursor-pointer"
                        title="Editar"
                        onClick={() => handleOpenModal("edit", userID)}
                    />
                    <RiLockPasswordLine
                        size={20}
                        className="text-orange-300 cursor-pointer"
                        title="Resetear Contraseña"
                        onClick={() => handleOpenModal("reset", userID, false, dni)}
                    />
                </div>
            );
        }
    },
];
