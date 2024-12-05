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
        const IncidenceGrouped = await prisma.incidence.groupBy({
            by: ['Invoice', "OrdenID"],
            _count: {
                TypeIncidenceID: true,
            },
            _sum: {
                TotalRefund: true,
                Quantity: true
            },
            orderBy: {
                _count: {
                    OrdenID: "desc"
                }
            },
            take: 30
        })

        result = await Promise.all(
            IncidenceGrouped
                .filter((item) => item.OrdenID != null) // Filtra entradas donde OrdenID no sea nulo
                .map(async (item) => {
                    const orderData = await prisma.orders.findUnique({
                        where: { OrderID: item.OrdenID! },
                        select: {
                            OrderNumber: true,
                            PickupPoint: true,
                            OrderStatus: {
                                select: {
                                    Description: true,
                                },
                            },
                        },
                    });

                    if (orderData) {
                        return {
                            Invoice: item.Invoice,
                            OrderID: item.OrdenID,
                            OrderNumber: orderData.OrderNumber,
                            PickupPoint: orderData.PickupPoint,
                            OrderStatusDescription: orderData.OrderStatus?.Description || null,
                            TypeIncidenceCount: item._count.TypeIncidenceID,
                            TotalRefundSum: item._sum.TotalRefund,
                            QuantitySum: item._sum.Quantity,
                        };
                    }
                    return null; // Si no hay datos relacionados, retorna null
                })
        );

    } catch (error: any) {
        result = error.message
    }


    return result
};


export const detailOrder = async (orden: number) => {
    let result;
    try {
        const detail = await prisma.incidence.findMany({
            where: {
                OrdenID: orden
            }
        })

        result = detail
    } catch (error: any) {
        result = error.message;
    }

    return result;
}


export const getIncidenceByOrder = async (order: string) => {

    let result;


    try {
        // obtener idOrder

        const orderData = await prisma.orders.findUnique({
            where: { OrderNumber: order },
            select: { OrderID: true }
        })


        result = await prisma.incidence.findMany({ where: { OrdenID: orderData?.OrderID } })
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

export const changStatusIncidence = async (invoice: string) => {
    let result;


    try {
        result = await prisma.incidence.updateMany({
            where: {
                Invoice: invoice,
            },
            data: {
                IsCompleted: true,
            }

        })


    } catch (error: any) {
        result = error.message
    }

    return result;
}