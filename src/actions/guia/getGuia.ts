'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Truculenta } from "next/font/google";

export interface ResponseGuia {
    GuideNumber: string;
    OriginWarehouse: string;
    NameOriginWarehouse: string;
    DestinationWarehouse: string;
    NameDestinationWarehouse: string;
    Details: Detail[];
}

export interface Detail {
    BarCode: string;
    ProductCode: string;
    Description: string;
    Image1: string;
    Quantity: string;
}



export const getGuiasByValue = async (value: string, codWareHouse?: string) => {

    const session = await auth()

    if (!session?.user || !session.user.UserID) throw new Error("Usuario no autenticado");
    if (!codWareHouse) throw new Error("Código de almacén no definido");

    const { UserID } = session.user;


    try {

        console.log(codWareHouse);

        const response = await fetch(`${process.env.KAYSER_GUIA_API}?GuideNumber=${value}&DestinationWarehouse=${codWareHouse}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const data: ResponseGuia[] = await response.json();

        // guardar en la bd
        // verificar si la GUIA existe en la BD
        const existGuide = await prisma.notesGuides.findFirst({
            where: {
                NumberDoc: value
            }
        })
        console.log(existGuide)


        let newNoteGuide;
        let dataDetails;

        if (!existGuide) {
            // Ajustar la zona horaria
            const createdAt = new Date();
            createdAt.setHours(createdAt.getHours() - 5);


            // Insertar en la BD NotesGuides
            newNoteGuide = await prisma.notesGuides.create({
                data: {
                    NumberDoc: value,
                    UserID: UserID,
                    PickupPointID: (await prisma.pickupPoints.findFirst({
                        where: { CodWareHouse: codWareHouse },
                    }))?.PickupPointID || 0, // Asignar el PickupPointID del establecimiento
                    Observation: null,
                    CreatedAt: createdAt,
                    IsOpen: true,
                    IsCompleted: false,
                }
            })

            if (!newNoteGuide) {
                throw new Error("No se pudo crear la guía en la base de datos");
            }

            // insertar details
            const details = data[0].Details.map(item => ({
                NoteGuideID: newNoteGuide!.NoteGuideID,
                BarCode: item.BarCode,
                ProductCode: item.ProductCode,
                Description: item.Description,
                Image1: item.Image1 || "https://www.smarttools.com.mx/wp-content/uploads/2019/05/imagen-no-disponible.png",
                Quantity: Number(item.Quantity),
            }))

            await prisma.noteGuideDetails.createMany({
                data: details
            });


            dataDetails = await prisma.noteGuideDetails.findMany({
                where: {
                    NoteGuideID: newNoteGuide!.NoteGuideID
                }
            })
        } else {
            // obtener el Details
            dataDetails = await prisma.noteGuideDetails.findMany({
                where: {
                    NoteGuideID: existGuide!.NoteGuideID
                }
            })
            console.log(dataDetails)

        }

        // Guarder los datos en la tabla
        return {
            ok: true,
            message: 'Guia encontrada',
            data: dataDetails,
            isOpen: existGuide?.IsOpen,
            isCompleted: existGuide?.IsCompleted
        }
    } catch (error: any) {
        console.log(error.message)
        return {
            ok: false,
            message: `ERROR: El número de guía ingresado no se encuentra cargado al sistema`,
            data: []
        }
    }
}

// Función para obtener la data si la guía está en estado Completed

export const getDataGuideOpen = async (codWareHouse?: string) => {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Usuario no autenticado");
    }

    try {
        if (!codWareHouse) {
            throw new Error("No se ha proporcionado un establecimiento para buscar");
        }

        // Buscar la guía abierta para el establecimiento
        const dataGuideOpen = await prisma.notesGuides.findFirst({
            where: {
                IsOpen: true,
                PickupPoints: {
                    CodWareHouse: codWareHouse
                }
            },
            include: {
                PickupPoints: true, // Incluir información del establecimiento
            }
        });

        // if (!dataGuideOpen) {
        //     throw new Error("No se encontró una guía abierta para este establecimiento");
        // }

        return {
            ok: true,
            message: "Guía abierta encontrada",
            data: dataGuideOpen,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
            data: null,
        };
    }
};

export const getAllGuidesByEstablec = async () => {
    const session = await auth();
    const userId = session?.user.UserID
    const PickupPointID = session?.user.PickupPointID;
    const rolId = session?.user.RoleID
    console.log(PickupPointID)

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }


    let whereClause: any = {};

    if (rolId === 1 || rolId === 2) {//si es admin o support
        // Ver todas las guías del establecimiento
        whereClause = {};
    } else if (rolId === 7) {//su es Supervisor, filtrar solo de sus tiendas
        // Ver solo las guías de las tiendas supervisadas
        const supervisedPickupPoints = await prisma.usersPickupPoints.findMany({
            where: {
                UserID: userId,
            },
            select: {
                PickupPointID: true,
            },
        });
        const supervisedPickupPointIDs = supervisedPickupPoints.map(sp => sp.PickupPointID);
        whereClause = {
            PickupPointID: {
                in: supervisedPickupPointIDs,
            },
        };
    } else {
        // Ver solo las guías de su establecimiento
        if (!PickupPointID) {
            throw new Error("PickupPointID no puede ser nulo o indefinido");
        }
        whereClause = {
            PickupPointID: PickupPointID,
        };
    }


    try {
        // Obtener todas las guías del establecimiento
        const allGuides = await prisma.notesGuides.findMany({
            where: whereClause
        });

        console.log(allGuides);
        // Obtener los datos agregados para cada guía
        const guidesWithAggregatedData = await Promise.all(
            allGuides.map(async (guide) => {
                const details = await prisma.noteGuideDetails.findMany({
                    where: {
                        NoteGuideID: guide.NoteGuideID,
                    },
                });

                // Calcular los datos agregados
                const Resumen = details.reduce(
                    (acc, item) => {
                        acc.total += item.Quantity;
                        acc.totalpicks += item.QuantityPicks || 0; // Asegúrate de que QuantityPicks no sea null
                        if (item.ExistInGuide) {
                            acc.missing += item.QuantityPicks < item.Quantity ? item.Quantity - (item.QuantityPicks || 0) : 0;
                            acc.plus += item.QuantityPicks > item.Quantity ? (item.QuantityPicks || 0) - item.Quantity : 0;
                        }

                        if (!item.ExistInGuide) {
                            acc.noList += item.QuantityPicks;
                        }

                        return acc;
                    },
                    {
                        total: 0,
                        totalpicks: 0,
                        missing: 0,
                        plus: 0,
                        noList: 0,
                    }
                );

                // Devolver la guía con los datos agregados
                return {
                    ...guide,
                    Resumen,
                };
            })
        );

        return {
            ok: true,
            message: "Guias encontradas",
            data: guidesWithAggregatedData,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: [],
        };
    }
};


export const getNoteGuideDetailByID = async (noteGuideID: number) => {
    const session = await auth();
    const PickupPointID = session?.user.PickupPointID;

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }

    try {
        // Obtener los detalles de la guía específica
        const details = await prisma.noteGuideDetails.findMany({
            where: {
                NoteGuideID: noteGuideID,
            },
        });

        if (!details || details.length === 0) {
            return {
                ok: false,
                message: 'Guía no encontrada',
                data: [],
            };
        }

        // Calcular los datos agregados
        const Resumen = details.reduce(
            (acc, item) => {
                acc.total += item.Quantity;
                acc.totalpicks += item.QuantityPicks || 0; // Asegúrate de que QuantityPicks no sea null
                if (item.ExistInGuide) {
                    acc.missing += item.QuantityPicks < item.Quantity ? item.Quantity - (item.QuantityPicks || 0) : 0;
                    acc.plus += item.QuantityPicks > item.Quantity ? (item.QuantityPicks || 0) - item.Quantity : 0;
                }

                if (!item.ExistInGuide) {
                    acc.noList += item.QuantityPicks;
                }

                return acc;
            },
            {
                total: 0,
                totalpicks: 0,
                missing: 0,
                plus: 0,
                noList: 0,
            }
        );

        // Devolver los detalles de la guía con los datos agregados
        return {
            ok: true,
            message: 'Guía encontrada',
            data: details,
            resumen: Resumen
        };
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: [],
        };
    }
};

// función para obtener la guía mediante un texto ingresado por el usuario
export const getNoteGuideByText = async (text: string) => {
    const session = await auth();
    const PickupPointID = session?.user.PickupPointID;

    if (!PickupPointID) {
        throw new Error(`No PickupPointID`);
    }

    try {
        const whereClause: any = { PickupPointID };
        if (text) {
            whereClause.NumberDoc = text;
        }
        const resutDataGuide = await prisma.notesGuides.findMany({
            where: whereClause

        })

        if (resutDataGuide.length === 0 || !resutDataGuide) {
            return {
                ok: false,
                message: 'Guía no encontrada',
                data: []
            }
        }


        // Obtener los datos agregados para cada guía
        const guidesWithAggregatedData = await Promise.all(
            resutDataGuide.map(async (guide) => {
                const details = await prisma.noteGuideDetails.findMany({
                    where: {
                        NoteGuideID: guide.NoteGuideID,
                    },
                });

                // Calcular los datos agregados
                const Resumen = details.reduce(
                    (acc, item) => {
                        acc.total += item.Quantity;
                        acc.totalpicks += item.QuantityPicks || 0; // Asegúrate de que QuantityPicks no sea null
                        if (item.ExistInGuide) {
                            acc.missing += item.QuantityPicks < item.Quantity ? item.Quantity - (item.QuantityPicks || 0) : 0;
                            acc.plus += item.QuantityPicks > item.Quantity ? (item.QuantityPicks || 0) - item.Quantity : 0;
                        }

                        if (!item.ExistInGuide) {
                            acc.noList += item.QuantityPicks;
                        }

                        return acc;
                    },
                    {
                        total: 0,
                        totalpicks: 0,
                        missing: 0,
                        plus: 0,
                        noList: 0,
                    }
                );

                // Devolver la guía con los datos agregados
                return {
                    ...guide,
                    Resumen,
                };
            })
        );

        return {
            ok: true,
            message: 'Guía encontrada',
            data: guidesWithAggregatedData
        }
    } catch (error: any) {
        return {
            ok: false,
            message: `${error.message}`,
            data: []
        }
    }
}