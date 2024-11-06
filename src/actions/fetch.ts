'use server'

export const fetchMain = async (boleta: string = '', orden: string = '', dni: string = '') => {
    try {
        const url = `${process.env.WIN_WIN_URL}?estado_facturacion=${boleta.trim()}&orderNumber=${orden.trim()}&documentNumber=${dni.trim()}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SAMISHOP_API_TOKEN as string
            },
            cache: "no-cache"
        })
        const response = await result.json();

        return response.obj.ordenes
    } catch (error: any) {
        console.log(error.message);
    }
}
