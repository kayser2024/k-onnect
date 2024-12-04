'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"

interface IncidenceProps {
    orden: string,
    invoice: string,
    product: { code_ean_origin: string, code_sap_origin: string, code_sap_change?: string | null, quantity: number, subtotal: number }[],
    typeIncidence: number,
    reason?: string
}


export const createIncidence = async ({ orden, invoice, product, typeIncidence, reason = '' }: IncidenceProps) => {

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

    for (let i = 0; i < product.length; i++) {
        // TODO:Insert a la tabla Insert
        await prisma.incidence.create({
            data: {
                OrdenID: OrderId,
                Invoice: invoice,
                CodProdOriginEAN: product[i].code_ean_origin,
                CodProd: product[i].code_sap_origin,
                CodProdChange: typeIncidence === 3 ? product[i].code_sap_change : null,
                TypeIncidenceID: typeIncidence,
                Quantity: product[i].quantity,
                TotalRefund: typeIncidence !== 3 ? product[i].subtotal : null,
                UserId: 1,
                Reason: reason,
                CreatedAt: now,
            }
        })
    }


}


export const getAllIncidence = async () => {
    let result;

    try {
        result = await prisma.incidence.groupBy({
            by: ['Invoice', "OrdenID"],
            _count:{
                Quantity:true
            }
        })
    } catch (error: any) {
        result = error.message
    }


    return result
};

export const getIncidenceByInvoice = async (invoice: string) => {

    let result;
    try {
        result = await prisma.incidence.findMany({ where: { Invoice: invoice } })
    } catch (error: any) {
        result = error.message
    }

    return result;
}

export const getProductListTotalRefund = async (invoice: string) => {
    let result;
    try {
        result = await prisma.incidence.findMany({
            where: { Invoice: invoice, TypeIncidenceID: { in: [1, 2] } },
            select: {
                // IncidenceID: true,
                CodProdOriginEAN: true,
                // CodProd: true,
                // CodProdChange: true,
                // TotalRefund: true,
                // Quantity: true,
                // Reason: true,
            }
        })
    } catch (error: any) {
        result = error.message
    }

    return result;
}