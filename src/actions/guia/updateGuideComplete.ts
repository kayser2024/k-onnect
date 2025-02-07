'use server'

import prisma from "@/lib/prisma"

export const updateGuideCompleted = async (NoteGuideID: number, observations: string) => {
    // Update the guide completed status in the database
    const fecha = new Date();
    fecha.setHours(fecha.getHours() - 5);
    try {
        await prisma.notesGuides.update({
            where: {
                NoteGuideID: NoteGuideID
            },
            data: {
                IsOpen: false,
                IsCompleted: true,
                UpdatedAt: fecha,
                Observation: observations
            }
        })

        return {
            ok: true,
            message: 'Guide completed status updated successfully',
            data: []
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: null
        }
    }
}