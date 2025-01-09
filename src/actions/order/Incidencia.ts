'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

interface IncidenceProps {
    orden: string,
    invoiceOrigin: string,
    invoiceIncidence: string,
    product: { codeEan: string, quantity: number, codeSap: string, text: string, subtotal: number }[],
    typeIncidence: number,
    reason?: string
    pickupPoint?: string
}


// Función para crear Incidencia
export const createIncidence = async ({ orden, invoiceOrigin, invoiceIncidence, product, typeIncidence, pickupPoint, reason = '' }: IncidenceProps) => {

    try {
        const user = await auth();
        if (!user) {
            throw new Error("Usuario no autenticado");
        }

        // console.log(user);

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


        // obtener el ID de la tienda
        const store = await prisma.pickupPoints.findFirst({
            where: { Description: pickupPoint },
            select: { PickupPointID: true },
        });



        // Insertar en la tabla Incidence
        const incidence = await prisma.incidence.create({
            data: {
                OrdenID: OrderId,
                InvoiceOriginal: invoiceOrigin,
                InvoiceIncidence: invoiceIncidence,
                UserId: 1, // Asegúrate de que `user.id` sea el ID correcto
                TypeIncidenceID: typeIncidence,
                PickupPointID: store?.PickupPointID,
                IsCompleted: false,
                Description: reason.trim() || "Sin descripción",
                CreatedAt: now,
            },
        });


        // Insertar productos en incidenceLogs
        const incidenceLogs = product.map((item) => ({
            IncidenceID: incidence.IncidenceID,
            CodEan: item.codeEan,
            CodProd: item.codeSap,
            ProdQuantity: item.quantity,
            ProdSubtotal: item.subtotal,
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


// Obtener todas las incidencias por BoletaOriginal
export const getAllIncidence = async (pickupPickupPointID?: number) => {
    let result;
    try {
        const IncidenceGrouped = await prisma.incidence.groupBy({
            by: ['OrdenID'],
            where: pickupPickupPointID ? { PickupPointID: pickupPickupPointID } : {},
            orderBy: {
                _count: {
                    OrdenID: "desc"
                }
            },
            _count: {
                OrdenID: true
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
                            // Invoice: item.InvoiceOriginal,
                            OrderID: item.OrdenID,
                            OrderNumber: orderData.OrderNumber,
                            PickupPoint: orderData.PickupPoint,
                            Destiny: "",
                            OrderStatusDescription: orderData.OrderStatus?.Description || null,
                            TypeIncidenceCount: item._count.OrdenID,
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


// Obtener todas las incidencias por Nro Orden
export const getAllIncidenceByOrder = async () => {

    let result;



}

export const getAllIncidenceByInvoice: any = async (invoice: string) => {
    let result;

    try {
        const IncidenceGrouped = await prisma.incidence.groupBy({
            by: ['OrdenID', 'InvoiceOriginal'],
            orderBy: {
                _count: {
                    OrdenID: "desc"
                }
            },
            where: {
                InvoiceOriginal: invoice,
            },
            _count: {
                OrdenID: true
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
                            Invoice: item.InvoiceOriginal,
                            OrderID: item.OrdenID,
                            OrderNumber: orderData.OrderNumber,
                            PickupPoint: orderData.PickupPoint,
                            OrderStatusDescription: orderData.OrderStatus?.Description || null,
                            TypeIncidenceCount: item._count.OrdenID,
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
        const incidences = await prisma.incidence.findMany({
            where: {
                OrdenID: orden
            },
            select: {

                IncidenceID: true,
                OrdenID: true,
                InvoiceOriginal: true,
                InvoiceIncidence: true,
                NCIncidence: true,
                TypeIncidenceID: true,
                IsCompleted: true,
                Description: true,
                PickupPointID: true,
                CreatedAt: true,
                Dispatched: true,
                DispatchedDate: true,
                ReceivedDate: true,
                Received: true,
                Comments: true,
                IsConfirmed: true,

                IncidenceLogs: {

                    select: {
                        CodEan: true,
                        CodProd: true,
                        ProdQuantity: true,
                        ProdSubtotal: true,
                        Description: true,
                        CreatedAt: true
                    }
                }
            }
        })

        result = incidences
    } catch (error: any) {
        result = error.message;
    }
    console.log({ result: result.IncidenceLogs });
    return result;
}

export const getIncidenceByOrder = async (order: string) => {

    try {
        // obtener id de la orden
        const orderData = await prisma.orders.findUnique({
            where: { OrderNumber: order },
            select: { OrderID: true }
        })

        if (!orderData) {
            return []
        }

        const result = await prisma.incidence.findMany({
            where: { OrdenID: orderData?.OrderID },
            include: {
                TypesIncidence: true,
                PickupPoints: {
                    select: {
                        Description: true
                    }
                }
            }
        })
        return result;

    } catch (error: any) {
        // console.error('Error al obtener las incidencias:', error.message);
        throw new Error('No se pudo obtener las incidencias.');
    }


}

export const getIncidenceByID = async (incidenceID: number) => {

    let result;
    try {

        result = await prisma.incidence.findUnique({
            where: { IncidenceID: incidenceID }

        })

    } catch (error: any) {

        result = error.message;
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

export const changStatusIncidence = async (incidenceId: number) => {
    let result;

    try {
        result = await prisma.incidence.update({
            where: {
                IncidenceID: incidenceId,
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

// Función para ingresar la NC y el Invoice 
export const updateIncidence = async (data: { nc: string, invoice?: string, incidenceId: number }, path: string) => {

    // const user = await auth();
    const user = 1;
    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    // console.log(user);

    try {

        // Utilizar el procedure
        const [result] = await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`
             CALL sp_UpdateIncidences(${user},${data.incidenceId},${data.nc},${data.invoice},@result);
            `;

            const [message] = await tx.$queryRaw<{ message: string }[]>`
                SELECT @result AS message;
            `;

            return [message.message]
        })


        // revalidar path
        revalidatePath(`/${path}`)

        return result;


    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }

}


// Función para actualizar la fecha de los productos recibidos
export const updateIncidence_ReceiveDispatch = async (incidenceId: number, data: { type: string, isConfirmed: boolean, comments: string }) => {
    const now = new Date();
    now.setHours(now.getHours() - 5); // Ajuste de zona horaria

    let result;
    try {

        result = await prisma.incidence.update({
            where: {
                IncidenceID: incidenceId,
            },
            data: {

                ...(data.type === 'ORIGIN' && {
                    ReceivedDate: now,
                    Received: true,
                }),
                ...(data.type === 'CHANGE' && {
                    DispatchedDate: now,
                    Dispatched: true,
                    Comments: data.comments,
                    IsConfirmed: data.isConfirmed,
                }),

            }
        })
    } catch (error: any) {
        result = error.message
    }

    revalidatePath(`/tienda/incidencia`)
    return result;
}


export const getIncidenceByEstablishment = async (establishmentID: number) => {


    let result;

    try {
        result = await prisma.incidence.findMany({
            where: {
                PickupPointID: establishmentID
            }
        })


        console.log({ result }, '💀');

    } catch (error: any) {
        console.log(error.message);
        result = error.message
    }


    return result;

}