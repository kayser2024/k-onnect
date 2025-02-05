'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

interface Props {
    NoteGuideID: number;
    BarCode: string,
    ProductCode: string,
    Description: string,
    ImageURL: string,
    Quantity: number,
    ExistInGuide: boolean,
    QuantityPicks: number,
}

export const insertProductNotFoundDetail = async (productNotFoundInGuide: Props) => {
    try {
        const resultNewDetails = await prisma.noteGuideDetails.create({
            data: {
                NoteGuideID: productNotFoundInGuide.NoteGuideID,
                Description: productNotFoundInGuide.Description,
                BarCode: productNotFoundInGuide.BarCode,
                ProductCode: productNotFoundInGuide.ProductCode,
                Image1: productNotFoundInGuide.ImageURL,
                Quantity: productNotFoundInGuide.Quantity,              //0
                QuantityPicks: productNotFoundInGuide.QuantityPicks,    //1
                ExistInGuide: productNotFoundInGuide.ExistInGuide,      //false
            }
        })
        revalidatePath('/tienda/guia')
        return {
            ok: true,
            data: resultNewDetails,
            message: "Producto insertado con éxito"
        }
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }

    }
}