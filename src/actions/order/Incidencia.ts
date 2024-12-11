'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"

interface IncidenceProps {
    orden: string,
    invoiceOrigin: string,
    invoiceIncidence: string,
    product: { codeEan: string, quantity: number, codeSap: string, text: string }[],
    typeIncidence: number,
    reason?: string
}


export const createIncidence = async ({ orden, invoiceOrigin, invoiceIncidence, product, typeIncidence, reason = '' }: IncidenceProps) => {

    try {
        const user = await auth();
        if (!user) {
            throw new Error("Usuario no autenticado");
        }

        console.log(user);

        const now = new Date();
        now.setHours(now.getHours() - 5); // Ajuste de zona horaria

        // Obtener el ID de la orden
        const order = await prisma.orders.findFirst({
            where: { OrderNumber: orden },
            select: { OrderID: true },
        });

        const OrderId = order?.OrderID;

        if (!OrderId) {
            throw new Error(`Orden no encontrada: ${orden}`);
        }

        // Insertar en la tabla Incidence
        const incidence = await prisma.incidence.create({
            data: {
                OrdenID: OrderId,
                UserId: 1, // Asegúrate de que `user.id` sea el ID correcto
                TypeIncidenceID: typeIncidence,
                IsCompleted: false,
                Description: reason.trim() || "Sin descripción", // Validar descripción
                CreatedAt: now,
            },
        });


        // Insertar productos en incidenceLogs
        const incidenceLogs = product.map((item) => ({
            IncidenceID: incidence.IncidenceID,
            CodEan: item.codeEan,
            CodProd: item.codeSap,
            ProdQuantity: item.quantity,
            ProdSubtotal: 0, // Cambia según la lógica de tu aplicación
            InvoiceOriginal: invoiceOrigin,
            InvoiceIncidence: invoiceIncidence,
            Description: item.text || "Sin descripción",
            CreatedAt: now,
        }));

        // Insertar logs en paralelo
        await prisma.incidenceLogs.createMany({
            data: incidenceLogs,
        });

    } catch (error: any) {
        console.error("Error en createIncidence:", error.message);
        throw error; // Re-lanza el error para manejarlo en un nivel superior
    }
};



export const getAllIncidence = async () => {
    let result;

    try {
        const IncidenceGrouped = await prisma.incidence.groupBy({
            by: ['Invoice', "OrdenID"],
            _count: {
                TypeIncidenceID: true,
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
                            QuantitySum: item._sum.QuantityOld,
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


        result = await prisma.incidence.findMany({
            where: { OrdenID: orderData?.OrderID },
            include: {
                TypesIncidence:true
            }
        })

    } catch (error: any) {
        result = error.message
    }

    return result;
}

export const getProductListTotalRefund = async (invoice: string) => {
    let result;
    try {
        result = await prisma.incidenceLogs.findMany({
            where: { Description: 'RETURN', InvoiceOriginal: invoice },
            select: {
                CodEan: true
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
                OrdenID: undefined,
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