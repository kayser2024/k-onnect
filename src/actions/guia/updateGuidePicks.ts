'use server'

import prisma from "@/lib/prisma"

export const updatOneItemPicks = async (guide: string, itemCode: string) => {
    const fecha = new Date();
    fecha.setHours(fecha.getHours() - 5);

    try {
        // obtener el id de la guía
        const guideData = await prisma.notesGuides.findFirst({
            where: {
                NumberDoc: guide
            },
        })
        // encontrar el Registro
        const item = await prisma.noteGuideDetails.findFirst({
            where: {
                NoteGuideID: guideData?.NoteGuideID,
                BarCode: itemCode
            },
        })
        if (!item) {
            throw new Error(`Item with BarCode ${itemCode} not found`);
        }
        console.log(item)

        // Actualizar el registro en la cantidad
        const updatedItem = await prisma.noteGuideDetails.update({
            where: {
                NoteGuideDetailsID: item.NoteGuideDetailsID
            },
            data: {
                QuantityPicks: item.QuantityPicks + 1,
            },
        })

        console.log(updatOneItemPicks)
        return {
            ok: true,
            message: 'Item actualizado con éxito',
            data: updatedItem
        }
    } catch (error: any) {

        return {
            ok: false,
            message: error.message,
            data: []
        }
    }
}

export const updateIncrementPicks = async (noteGuideDetailsID: number, increment: number) => {
    try {
        const resultUpdate = await prisma.noteGuideDetails.update({
            where: {
                NoteGuideDetailsID: noteGuideDetailsID,

            },
            data: {
                QuantityPicks: {
                    increment: increment
                }
            }
        })

        // eliminar registro
        if (resultUpdate.QuantityPicks <= 0) {
            await prisma.noteGuideDetails.delete({
                where: {
                    NoteGuideDetailsID: noteGuideDetailsID,
                    ExistInGuide: false
                }
            })

            return {
                ok: true,
                message: 'Item eliminado con éxito',
                data: null
            };
        }

        return {
            ok: true,
            message: 'Incremento realizado con exito',
            data: resultUpdate
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: []
        }
    }
}