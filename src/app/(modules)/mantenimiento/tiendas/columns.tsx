import { ColumnDef } from '@tanstack/react-table';
import { PickupPoint } from '@/types/Establec';
import { LuPencilLine } from "react-icons/lu";
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { ModalAccept } from './ui/modal-accept';

export const columns = (handleOpenModal: (action: string, id: number) => void, handleRefetch: () => void): ColumnDef<PickupPoint>[] => [
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
            return <div className='text-xs md: w-[300px] md:[350px] truncate'>{nombre}</div>;
        },
        filterFn: (row, id, value) => {
            const estado = row.original.Description;
            return estado
                ? estado.toLowerCase().includes(value.toLowerCase())
                : false;
        },
    },
    // {
    //     id: "address",
    //     accessorKey: "Address",
    //     header: "Dirección",
    //     cell: ({ row }) => {
    //         const email = row.original.Address;
    //         return <div className='w-[250px] truncate  text-xs '>{email}</div>;
    //     }
    // },
    {
        id: "district",
        accessorKey: "District",
        header: "Dist.",
        cell: ({ row }) => {
            const email = row.original.District;
            return <div className='text-xs'>{email}</div>;
        }
    },
    {
        id: "province",
        accessorKey: "Province",
        header: "Prov.",
        cell: ({ row }) => {
            const email = row.original.Province;
            return <div className='text-xs'>{email}</div>;
        }
    },
    {
        id: "department",
        accessorKey: "Department",
        header: "Depart.",
        cell: ({ row }) => {
            const email = row.original.Department;
            return <div className='text-xs'>{email}</div>;
        }
    },
    // {
    //     id: "locationCode",
    //     accessorKey: "LocationCode",
    //     header: "Ubigeo",
    //     cell: ({ row }) => {

    //         return <div className='text-xs'>{row.original.LocationCode}</div>;
    //     }
    // },
    {
        id: "codeWHouse",
        accessorKey: "codWHouse",
        header: "Cod. Alm.",
        cell: ({ row }) => {

            const codEstablec = row.original.CodWareHouse
            return <div className='text-xs'>{codEstablec}</div>;
        }
    },
    {
        id: "isActive",
        accessorKey: "isActive",
        header: "Activo",
        cell: ({ row }) => {
            const IsActive = row.original.IsActive
            const pickupPointID = row.original.PickupPointID;

            const [isActive, setIsActive] = useState(IsActive);
            const [previousState, setPreviousState] = useState(isActive);
            const [isOpen, setIsOpen] = useState(false);
            const [isLoading, setIsLoading] = useState(false);

            // const status = row.original.;

            const handleSwitchChange = async (checked: boolean) => {
                setPreviousState(isActive);
                setIsActive(checked)
                setIsOpen(true)
            }

            const onClose = () => {
                setIsActive(previousState);
                setIsOpen(false)
            }


            return <div className='text-center'>
                <Switch checked={isActive} onCheckedChange={handleSwitchChange} className={`transition-colors duration-300 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} title={`${IsActive ? 'Deshabilitar Tienda' : 'Habilitar Tienda'}`} />
                <ModalAccept isOpen={isOpen} type="isActive" onClose={onClose} setIsLoading={setIsLoading} isLoading={isLoading} pickupID={pickupPointID} status={isActive} onRefetch={handleRefetch} />

            </div>;
        }
    },
    {
        id: "isAvailablePickupPoint",
        accessorKey: "isAvailablePickupPoint",
        header: "Recojo Disp.",
        cell: ({ row }) => {
            const IsActive = row.original.IsActive
            const IsAvailablePickupPoint = row.original.IsAvailablePickup
            const pickupPointID = row.original.PickupPointID;

            const [isActive, setIsActive] = useState(IsAvailablePickupPoint)
            const [previousState, setPreviousState] = useState(isActive);
            const [isOpen, setIsOpen] = useState(false)
            const [isLoading, setIsLoading] = useState(false);

            const handleSwitchChange = (checked: boolean) => {
                setPreviousState(isActive);
                setIsActive(checked)
                setIsOpen(true)
            }

            const onClose = () => {
                setIsActive(previousState);
                setIsOpen(false)
            }

            return <div className='text-center' >
                <Switch checked={isActive} onCheckedChange={handleSwitchChange} disabled={!IsActive} className={`transition-colors duration-300 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} title={`${isActive ? 'Deshabilitar punto de recojo' : 'Habilitar punto de recojo'}`} />
                <ModalAccept isOpen={isOpen} type="isAvailablePickup" onClose={onClose} setIsLoading={setIsLoading} isLoading={isLoading} pickupID={pickupPointID} status={isActive} onRefetch={handleRefetch} />
            </div>;
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
