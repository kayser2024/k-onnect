"use server"
import { revalidatePath } from "next/cache"
import { insertComment } from "../order/insertComent"


export const onUpdateObservaciones = async (orden: string, comentario: string, selectedValue: string, observaciones: string) => {


    if (!comentario) {
        return {
            mensaje: 'El comentario no puede estar vacio',
            error: false
        }
    }

    let resFinal = {}

    // CONDICION PARA AGREGAR OBSERVACIONES EN CASO DE QUE EXISTA
    if (observaciones) {
        // console.log('OBSERVACIONES NO VACIAS');
        const observacionesArray = JSON.parse(observaciones)

        resFinal = [...observacionesArray, {
            "comentario": comentario,
            "tipo": selectedValue,
            "fecha": new Date().toString().split('GMT')[0],
            "usuario": "admin"
        }]
    } else {
        // console.log('OBSERVACIONES VACIAS');
        resFinal = [{
            "comentario": comentario,
            "tipo": selectedValue,
            "fecha": new Date().toString().split('GMT')[0],
            "usuario": "admin"
        }]
    }


    try {

        await insertComment(`${selectedValue}-${comentario}`, orden, 1)
    } catch (error: any) {
        console.log(error.message)
        return error.message
    }


    revalidatePath('/pedido/[orden]', 'page')


    return {
        mensaje: 'Comentario agregado',
        error: false
    }
}
