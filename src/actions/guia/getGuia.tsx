'use server'

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

    try {
        const response = await fetch(`http://192.168.0.244:5050/api/Transfer?GuideNumber=${value}&DestinationWarehouse=${codEstablec}`, {
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
                    UserID: 1,
                    PickupPointID: 62,
                    Observation: null,
                    CreatedAt: createdAt,
                }
            })

            // insertar details
            const details = data[0].Details.map(item => ({
                NoteGuideID: newNoteGuide!.NoteGuideID,
                BarCode: item.BarCode,
                ProductCode: item.ProductCode,
                Description: item.Description,
                Image1: item.Image1,
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
        console.log(data)
        return {
            ok: true,
            message: 'Guia encontrada',
            data: dataDetails
        }
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }
    }
}