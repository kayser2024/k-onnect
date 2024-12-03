'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"

interface IncidenceProps {
    orden: string,
    invoice: string,
    ProdOld: { cod: string, quantity: number, subtotal: number }[],
    ProdNew: { cod: string, quantity: number, subtotal: number }[],
    typeIncidence: number,
    description?: string
}

export const createIncidence = async ({ orden, invoice, ProdOld, ProdNew, typeIncidence, description = '' }: IncidenceProps) => {

    const user = await auth()
    console.log(user)

    const now = new Date();
    now.setHours(now.getHours() - 5);

    // obtener el Id de la orden
    const order = await prisma.orders.findFirst({
        where: { OrderNumber: orden },
        select: { OrderID: true }
    })
    const OrderId = order?.OrderID

    if (!OrderId) {
        throw new Error(`Orden no encontrado: ${orden}`)
    }


    // si es cambio registrar todos los productos con su respectivo producto a cambiar

    for (let i = 0; i < ProdOld.length; i++) {
        // TODO:Insert a la tabla Insert
        await prisma.incidence.create({
            data: {
                OrdenID: OrderId,
                Invoice: invoice,
                CodProd: ProdOld[i].cod,
                CodProdChange: typeIncidence === 3 ? ProdNew[i].cod : null,
                TypeIncidenceID: typeIncidence,
                Quantity: ProdOld[i].quantity,
                TotalRefund: typeIncidence !== 3 ? ProdOld[i].subtotal : null,
                UserId: 1,
                Reason: description,
                CreatedAt: now,
            }
        })
    }


}


export const getAllIncidence = async () => {

};

export const GetOneIncidence = async () => {

}