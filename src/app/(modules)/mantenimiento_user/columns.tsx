import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/User';
import { LiaUserEditSolid } from 'react-icons/lia';
import { RiLockPasswordLine } from "react-icons/ri";
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';


// Define las columnas como una constante, esperando directamente la función handleOpenModal como parámetro
export const columns = (handleOpenModal: (action: string, id: string, currentStatus?: boolean) => void): ColumnDef<User>[] => [
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
            const nombre = row.original.name;
            const apellido = row.original.lastName;
            return <>{nombre}</>;
        },
        filterFn: (row, id, value) => {
            const estado = row.original.name; 
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
            const email = row.original.email;
            return <>{email}</>;
        }
    },
    {
        accessorKey: "id_rol",
        header: "Rol",
        cell: ({ row }: any) => {
            const rol = row.original.rolId;
            let result;
            if (rol == 1) result = 'Admin';
            if (rol == 2) result = 'ATC';
            if (rol == 3) result = 'Tienda';
            return <Badge variant='outline'>{result}</Badge>;
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const id = row.original.dni;
            const currentStatus = row.original.status;

            return (
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <Switch onCheckedChange={() => handleOpenModal('delete', id, !currentStatus)} checked={currentStatus} />
                    </label>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Acción",
        cell: ({ row }) => {
            const id = row.original.dni;

            return (
                <div className="flex gap-2 justify-center items-center">
                    <LiaUserEditSolid
                        size={20}
                        className="text-blue-600 cursor-pointer"
                        title="Editar"
                        onClick={() => handleOpenModal("edit", id)}
                    />
                    <RiLockPasswordLine
                        size={20}
                        className="text-orange-300 cursor-pointer"
                        title="Resetear Contraseña"
                        onClick={() => handleOpenModal("reset", id)}
                    />
                </div>
            );
        }
    },
];
