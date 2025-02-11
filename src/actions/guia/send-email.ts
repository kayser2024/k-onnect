'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { getNoteGuideByText, getNoteGuideDetailByID } from "./getGuia";

export const sendEmail = async (to: string, subject: string, html: string, noteGuideID: number, guide: string) => {
    const session = await auth();
    const userId = session?.user.UserID;
    const PickupPointID = session?.user.PickupPointID;

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }

    try {
        // const resultNoteGuides = await getNoteGuideByText(guia);
        const resultNoteGuides = await getNoteGuideDetailByID(noteGuideID)
        if (!resultNoteGuides.ok) {
            return {
                ok: false,
                message: resultNoteGuides.message,
                data: [],
            }
        }

        console.log(resultNoteGuides)
        const tableData = { data: resultNoteGuides.data, resumen: resultNoteGuides.resumen, guide };

        const response = await fetch(`${process.env.BASE_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, html, tableData }),
        });
        console.log(response)

        const result = await response.json();
        return {
            ok: true,
            message: 'Email sent successfully',
            data: result
        }
    } catch (error: any) {
        console.log(error.message)
        return {
            ok: false,
            message: error.message,
            data: null
        }
    }
}