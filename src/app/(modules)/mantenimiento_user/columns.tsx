import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { format } from 'date-fns';
import { User } from '@/types/User';
import { LiaUserEditSolid } from 'react-icons/lia';
import { RiLockPasswordLine } from "react-icons/ri";
import { Switch } from '@/components/ui/switch';


interface columnsProps {
    handleOpenModal: (action: string, id: number, currentStatus?: boolean) => void;
}


// Define las columnas como una constante

export const columns = (handleOpenModal: columnsProps) => [
    {
        accessorKey: "index",
        header: "#",
        cell: (info: any) => info.row.index + 1,
    },
    {
        key: "name",
        accessorKey: "user_name",
        header: "Usuario",
        cell: ({ row }: any) => {
            const nombre = row.original.name
            const apellido = row.original.lastName
            console.log(row.original)
            return <>{nombre}</>
        }
    },
    {
        key: "email",
        accessorKey: "email_user",
        header: "E-mail",
        cell: ({ row }: any) => {
            const email = row.original.email
            console.log(row.original)
            return <>{email}</>
        }
    },
    {
        accessorKey: "id_rol",
        header: "Rol",
        cell: ({ row }: any) => {
            const rol = row.original.rolId
            return <>{rol}</>
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }: any) => {

            const id = row.original.dni;

            const handleStatusToggle = () => {
                const currentStatus = row.getValue("status");
                console.log(currentStatus, '👀👀')

                handleOpenModal("delete", id, !currentStatus)

            };

            return (
                <div className="form-control">
                    <label className="label cursor-pointer">
                        {/* <input
                            type="checkbox"
                            className="toggle toggle-accent"
                            checked={row.getValue("status")}
                            onChange={handleStatusToggle}
                        /> */}
                        <Switch onChange={handleStatusToggle} />
                    </label>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Acción",
        cell: ({ row }: any) => {
            const id = row.original.dni

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
            )
        }
    },

];
