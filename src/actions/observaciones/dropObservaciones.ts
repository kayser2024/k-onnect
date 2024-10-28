"use server"
import { revalidatePath } from "next/cache"



export const onDropObservaciones = async (orden: string) => {

    const jsonUpdateObservaciones = {
        "actualizar": {
            "situacion_facturacion":
                { "link_doc1": "" }
        }
    }

    const res = await fetch(`${process.env.WIN_WIN_PUT}/${orden}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdateObservaciones),
    }).then(res => res.json())

    console.log(res);
    revalidatePath('/pedido/[orden]', 'page')

}