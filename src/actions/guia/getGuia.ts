'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export interface ResponseGuia {
    GuideNumber: string;
    OriginWarehouse: string;
    NameOriginWarehouse: string;
    DestinationWarehouse: string;
    NameDestinationWarehouse: string;
    Details: Detail[];
}

export interface Detail {
    BarCode: string;
    ProductCode: string;
    Description: string;
    Image1: string;
    Quantity: string;
}



export const getGuiasByValue = async (value: string, codEstablec: string) => {

    const session = await auth()
    const UserID = session?.user.UserID;
    // const whCode=session?.user.WareHouseCode🚩

    if (!UserID) {
        throw new Error("Usuario no autenticado")
    }
    console.log(value)

    try {
        const response = await fetch(`${process.env.KAYSER_GUIA_API}?GuideNumber=${value}&DestinationWarehouse=${codEstablec}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const data: ResponseGuia[] = await response.json();


        let newNoteGuide;
        let dataDetails;
        // guardar en la bd
        // verificar si la GUIA existe en la BD
        const existGuide = await prisma.notesGuides.findFirst({
            where: {
                NumberDoc: value
            }
        })

        if (!existGuide) {
            // Ajustar la zona horaria
            const createdAt = new Date();
            createdAt.setHours(createdAt.getHours() - 5);

            // Insertar en la BD NotesGuides
            newNoteGuide = await prisma.notesGuides.create({
                data: {
                    NumberDoc: value,
                    UserID: UserID,
                    PickupPointID: 62,
                    Observation: null,
                    CreatedAt: createdAt,
                    IsOpen: true,
                    IsCompleted: false,
                }
            })

            // insertar details
            const details = data[0].Details.map(item => ({
                NoteGuideID: newNoteGuide!.NoteGuideID,
                BarCode: item.BarCode,
                ProductCode: item.ProductCode,
                Description: item.Description,
                Image1: item.Image1 || "https://www.smarttools.com.mx/wp-content/uploads/2019/05/imagen-no-disponible.png",
                Quantity: Number(item.Quantity),
            }))

            await prisma.noteGuideDetails.createMany({
                data: details
            });


            dataDetails = await prisma.noteGuideDetails.findMany({
                where: {
                    NoteGuideID: newNoteGuide!.NoteGuideID
                }
            })
        } else {
            // obtener el Details
            dataDetails = await prisma.noteGuideDetails.findMany({
                where: {
                    NoteGuideID: existGuide!.NoteGuideID
                }
            })

        }

        // Guarder los datos en la tabla
        return {
            ok: true,
            message: 'Guia encontrada',
            data: dataDetails,
            isOpen: existGuide?.IsOpen,
            isCompleted: existGuide?.IsCompleted
        }
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }
    }
}

// Función para obtener la data si la guía está en estado Completed
export const getDataGuideOpen = async () => {
    const session = await auth()

    const PickupPointID = session?.user.PickupPointID

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }

    try {
        const dataGuideOpen = await prisma.notesGuides.findFirst({
            where: {
                IsOpen: true,
                PickupPointID: PickupPointID
            }
        })


        if (!dataGuideOpen) {
            throw new Error('Guia no encontrada')
        }

        console.log(dataGuideOpen)
        return {
            ok: true,
            message: 'Guia abierta encontrada',
            data: dataGuideOpen,
        }

    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }
    }
}


// función para obtener todas las guías del establecimiento
export const getAllGuidesByEstablec = async () => {


    const session = await auth()
    const PickupPointID = session?.user.PickupPointID

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }

    try {
        const allGuides = await prisma.notesGuides.findMany({
            where: {
                PickupPointID: PickupPointID
            }
        })

        return {
            ok: true,
            message: 'Guias encontradas',
            data: allGuides
        }
    } catch (error: any) {

        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }

    }

}