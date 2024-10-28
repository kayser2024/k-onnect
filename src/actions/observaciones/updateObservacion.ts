"use server"
import { revalidatePath } from "next/cache"


export const onUpdateObservaciones = async (orden: string, comentario: string, selectedValue: string, observaciones: string) => {


    if (!comentario) {
        return {
            mensaje: 'El comentario no puede estar vacio',
            error: false
        }
    }

    console.log({ selectedValue, comentario })
    let resFinal = {}

    if (observaciones) {
        console.log('OBSERVACIONES NO VACIAS');
        const observacionesArray = JSON.parse(observaciones)

        resFinal = [...observacionesArray, {
            "comentario": comentario,
            "tipo": selectedValue,
            "fecha": new Date().toString().split('GMT')[0],
            "usuario": "admin"
        }]
    } else {
        console.log('OBSERVACIONES VACIAS');
        resFinal = [{
            "comentario": comentario,
            "tipo": selectedValue,
            "fecha": new Date().toString().split('GMT')[0],
            "usuario": "admin"
        }]
    }


    const jsonUpdateObservaciones = {
        "actualizar": {
            "situacion_facturacion":
                { "link_doc1": JSON.stringify(resFinal) }
        }
    }


    const res = await fetch(`${process.env.WIN_WIN_PUT}/${orden}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.SAMISHOP_API_TOKEN}`
        },
        body: JSON.stringify(jsonUpdateObservaciones)
    }).then(res => res.json())

    console.log(res);
    revalidatePath('/pedido/[orden]', 'page')

    if (res.bEstado === false) {
        return {
            mensaje: res.sRpta,
            error: true
        }
    }

    return {
        mensaje: 'Comentario agregado',
        error: false
    }
}
