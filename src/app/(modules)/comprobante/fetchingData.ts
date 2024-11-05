'use server'


async function fetchWithRetry(url: string, options: object, retries = 3, delay = 1000) {
    for (let attempt = 0; attempt < retries; attempt++) {
        const controller = new AbortController();
        const { signal } = controller;
        const timeout = setTimeout(() => controller.abort(), delay * 3); // Tiempo máximo por intento

        try {
            const response = await fetch(url, { ...options, signal });
            clearTimeout(timeout); // Limpiar el timeout si la solicitud es exitosa
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            clearTimeout(timeout);
            if (attempt < retries - 1) {
                console.warn(`Retrying (${attempt + 1}/${retries}) after ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; // Incremento exponencial
            } else {
                throw error; // Lanzar el error después de intentos fallidos
            }
        }
    }
}

export async function fetchingAllData(start: string, end: string) {

    const firstResponse = await fetchWithRetry(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SAMISHOP_API_TOKEN as string
            },
            cache: "no-cache"
        }
    );
    const firstData = await firstResponse;

    // Calculamos el número total de páginas
    const totalPages = firstData.obj["paginas totales"];
    let allOrders = firstData.obj["ordenes"];

    if (totalPages > 1) {
        const requests = [];

        for (let page = 2; page <= totalPages; page++) {
            requests.push(
                fetch(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.SAMISHOP_API_TOKEN as string
                    },
                    cache: "no-cache"
                }).then(res => res.json().then(data => data.obj["ordenes"]))
                    .catch(error => {
                        console.error(`Failed to fetch page ${page}`, error);
                        return []; // Return an empty array if this page request fails
                    })
            );
        }

        // Esperamos a que todas las solicitudes se completen
        const results = await Promise.all(requests);

        // Extraemos y combinamos todas las ordenes de cada página
        results.forEach(orders => {
            allOrders = allOrders.concat(orders);
        });
    }

    return {
        ordenes: allOrders,
        totalRegistros: firstData.obj["total de registros"]
    };
}