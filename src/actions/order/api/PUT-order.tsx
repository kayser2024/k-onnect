'use server'

export const orderUpdate = async (order: string, estado: string) => {
    let result;
    let jsonUpdateEstado;
    if (estado === 'reset_status') {
        jsonUpdateEstado = {
            "actualizar": {
                "situacion_envio": {
                    "estado_envio": "preparacion",
                    "preparacion": new Date().toISOString(),
                    "enviado": null,
                    "recibido": null
                },
            },
        };
    } else {

        jsonUpdateEstado = {
            "actualizar": {
                "situacion_envio": {
                    "estado_envio": estado,
                    [estado]: new Date().toISOString(),
                },
            },
        };

    }

    const getConfig = (body: object) => ({
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.SAMISHOP_API_TOKEN}`,
        },
        body: JSON.stringify(body),
    });

    const base_url = process.env.WIN_WIN_PUT;
    try {
        const response = await fetch(`${base_url}/${order}`, getConfig(jsonUpdateEstado))

        result = await response.json();
    } catch (error: any) {
        console.log(error.message);
        result = error.message;

    }

    return result


}