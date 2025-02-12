'use server';

import prisma from "@/lib/prisma";
import { PickupPoint } from "@/types/Establec";


export const getAllEstablecimientos = async (search: string) => {

    const pickupPoints = await prisma.pickupPoints.findMany({
        where: {
            Description: {
                contains: search,
            }
        }
    }
    );

    return pickupPoints.map(p => ({
        value: `${p.PickupPointID}`,
        label: `${p.Description}`
    }));
}


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
        return establecimientos
    } catch (error: any) {
        console.log(error.message);
        return []
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
        };
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el establecimiento');
    }

}

export const updateEstablec = async (data: PickupPoint) => {

}


export const createEstablec = async (data: any) => {
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
                Address: data.Address
            }
        })
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