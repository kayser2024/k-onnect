'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface Props {
    Description: string,
    CodProd: string,
    CodBar: string,
    ImageURL: string
}
export const insertProductGuide = async (numberDoc: string, data: Props) => {
    const session = await auth();
    const userId = session?.user.UserID;
    const PickupPointID = session?.user.PickupPointID;

    console.log({ userId, numberDoc, PickupPointID, data });
    try {
        // TODO: ejecutar Procedure🚩
        const [result] = await prisma.$transaction(async (tx) => {
            // Llama al procedimiento almacenado
            await tx.$executeRaw`
                CALL sp_insertProductsReceptionGuide(${userId}, ${numberDoc}, ${PickupPointID}, ${JSON.stringify(data)}, @result)
            `;

            // Recupera el mensaje desde la variable de salida
            const [message] = await tx.$queryRaw<{ message: string }[]>`
            SELECT @result AS message;
        `;
            return [message.message]
        });

        if (result.includes("ERROR:")) {
            console.error(`Mensaje: ${result}`);
            throw new Error(`Mensaje: ${result}`);
        }

    } catch (error) {
        console.error(`Mensaje: ${error}`)
    }
}