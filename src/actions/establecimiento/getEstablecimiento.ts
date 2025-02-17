'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { PickupPoint } from "@/types/Establec";


export const getAllEstablecimientos = async (search: string) => {

    const pickupPoints = await prisma.pickupPoints.findMany({
        where: {
            Description: {
                contains: search,
            },
            IsActive: true
        }
    }
    );

    return pickupPoints.map(p => ({
        value: `${p.PickupPointID}`,
        label: `${p.Description}`
    }));
}

export const loadAllEstablecimientos = async () => {

    try {

        const result = await prisma.pickupPoints.findMany({
            where: {
                IsActive: true
            }
        })

        return {
            ok: true,
            message: "Establecimientos cargados con éxito",
            data: result
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: null
        }
    }
};

export const getListEstablecimientos = async () => {

    try {
        // obtenemos todos los establecimientos menos el delivery
        const establecimientos: PickupPoint[] = await prisma.pickupPoints.findMany({
            // where: {
            //     NOT: {
            //         Description: {
            //             contains: 'delivery',
            //         },
            //     },
            // },

        }
        );
        console.log(establecimientos)
        return establecimientos
    } catch (error: any) {
        console.log(error.message);
        return []
    }

}

// Obtener Tiendas asignados a los usuarios
export const getStoreByUser = async () => {

    const session = await auth();
    const rolId = session?.user.RoleID;
    const userId = session?.user.UserID;

    if (!session) {
        throw new Error('No se pudo obtener la sesión');
    }

    let whereClause: any = {};

    if (rolId === 1 || rolId === 2) {
        whereClause = {
            IsActive: true,
            Description: {
                not: {
                    contains: 'DELIVERY',
                },
            }
        }
    } else if (rolId === 7) {
        const supervisedPickupPoints = await prisma.usersPickupPoints.findMany({
            where: {
                UserID: userId,
            },
            select: {
                PickupPointID: true,
            },
        });

        const supervisedPickupPointIDs = supervisedPickupPoints.map(sp => sp.PickupPointID);
        whereClause = {
            PickupPointID: {
                in: supervisedPickupPointIDs,
            },
        };
    }

    try {
        const result = await prisma.pickupPoints.findMany({
            where: whereClause
        })

        console.log(result)
        return {
            ok: true,
            message: "Establecimientos cargados con éxito",
            data: result
        }
    } catch (error: any) {

        return {
            ok: false,
            message: error.message,
            data: null
        }
    }
}

export const getEstablecById = async (id: number) => {


    try {
        const establec = await prisma.pickupPoints.findFirst({
            where: {
                PickupPointID: id
            }
        })
        if (!establec) {
            throw new Error(`No se encontró el establecimiento con el ID ${id}`);
        }

        return {
            PickupPointID: establec.PickupPointID,
            Description: establec.Description,
            District: establec.District,
            Province: establec.Province,
            Department: establec.Department,
            LocationCode: establec.LocationCode,
            Place: establec.Place,
            Address: establec.Address,
            Lat: establec.Lat,
            Lon: establec.Lon,
            CodWareHouse: establec.CodWareHouse,
            IsAvailablePickup: establec.IsAvailablePickup,
            IsActive: establec.IsActive
        };
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el establecimiento');
    }

}

export const updateEstablec = async (data: PickupPoint, id: number) => {
    console.log(data)

    try {
        const result = await prisma.pickupPoints.update({
            where: { PickupPointID: id },
            data: data
        })


        return {
            ok: true,
            data: result,
            message: "Establecimiento actualizado con éxito"
        }

    } catch (error: any) {
        return {
            ok: false,
            data: null,
            message: `${error.message}`
        }
    }

}


export const createEstablec = async (data: any) => {

    console.log(data)
    let result;
    try {
        result = await prisma.pickupPoints.create({
            data: {
                Description: data.Description,
                District: data.District,
                Province: data.Province,
                Department: data.Department,
                LocationCode: data.LocationCode,
                Place: data.Place,
                Address: data.Address,
                CodWareHouse: data.CodWareHouse,
                Lat: data.Lat,
                Lon: data.Lon,
            }
        })
        console.log(result)
        return {
            ok: true,
            data: result,
            message: "Establecimiento creado con éxito"
        }
    } catch (error: any) {
        return {
            ok: false,
            data: [],
            message: `${error.message}`
        }
    }
}