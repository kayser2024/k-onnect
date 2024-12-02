"use server";

import { revalidatePath } from "next/cache";

export const onUpdateEnvio = async (ordenes: string, estado: string, path: string) => {
    console.log("Manejando desde el servidor:", { estado, ordenes });

    // Validar el estado
    const estadosPermitidos = ["pendiente", "en_preparacion", "enviado", "recibido"];

    if (!estadosPermitidos.includes(estado)) {
        console.error(`Estado no permitido: ${estado}`);
        throw new Error("Estado no válido.");
    }

    const fecha = new Date();
    // Configurar JSON para estado y fecha por separado
    const jsonUpdateEstado = {
        "actualizar": {
            "situacion_envio": {
                "estado_envio": estado,
                [estado]: fecha.toISOString(),
            },
        },
    };


    // Configuración para fetch
    const getConfig = (body: object) => ({
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
        },
        body: JSON.stringify(body),
    });

    try {
        const base_url = process.env.WIN_WIN_PUT;
        if (!base_url) {
            throw new Error("La URL base no está configurada.");
        }

        let orden = ordenes
        // Iteramos sobre la lista de órdenes
        // for (const orden of ordenes) {
        console.log(`Procesando la orden: ${orden}`);

        // Hacer la primera solicitud para el estado
        const responseEstado = await fetch(`${base_url}/${orden}`, getConfig(jsonUpdateEstado));

        if (!responseEstado.ok) {
            throw new Error(
                `Error al actualizar el estado de la orden ${orden}: ${responseEstado.statusText}`
            );
        }
        console.log(`Estado actualizado para la orden ${orden}.`);

        // }
    } catch (error: any) {
        console.error("Error al manejar las órdenes:", error.message);
        throw new Error(`Error manejando las órdenes: ${error.message}`);
    }

    // Revalidar el path después de completar
    revalidatePath(path);

    return "Evento manejado";
};
