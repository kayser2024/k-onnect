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

export async function fetchingAllData(start: string, end: string, paymentStatus: string) {
    console.log(start, end)
    const firstResponse = await fetchWithRetry(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}&paymentStatus=${paymentStatus}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SAMISHOP_API_TOKEN as string
            },
            cache: "default"
        }
    );
    const firstData = await firstResponse;
    console.log(firstData)

    if (!firstData.bEstado) {
        return {
            ordenes: [],
            totalRegistros: 0,

        }
    }

    const totalPages = firstData.obj["paginas totales"];
    let allOrders = firstData.obj["ordenes"];

    // Verificar si el total de páginas es demasiado alto
    if (totalPages > 150) {
        throw new Error("Por favor, selecciona un rango de fechas más corto para reducir la cantidad de páginas.");
    }

    // Procesar en lotes si hay más de una página
    if (totalPages > 1) {
        const batchSize = 20; // Tamaño del lote (ej., 20 páginas por lote)
        const totalBatches = Math.ceil((totalPages - 1) / batchSize); // Número de lotes necesarios

        for (let batch = 0; batch < totalBatches; batch++) {
            const startPage = batch * batchSize + 2;
            const endPage = Math.min((batch + 1) * batchSize + 1, totalPages);

            const batchRequests = [];

            for (let page = startPage; page <= endPage; page++) {
                batchRequests.push(
                    fetchWithRetry(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}&paymentStatus=${paymentStatus}&page=${page}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': process.env.SAMISHOP_API_TOKEN as string
                        },
                        cache: "default"
                    }).then(res => res.obj["ordenes"])
                        .catch(error => {
                            console.error(`Failed to fetch page ${page}`, error);
                            return []; // Retorna un array vacío si falla
                        })
                );
            }

            // Ejecutar todas las solicitudes en el lote actual
            const results = await Promise.allSettled(batchRequests);

            // Concatenar resultados de órdenes exitosas
            results.forEach(result => {
                if (result.status === "fulfilled") {
                    allOrders = allOrders.concat(result.value);
                } else {
                    console.warn(`Request failed: ${result.reason}`);
                }
            });
        }
    }


    // Si solo hay una página, retornar los datos obtenidos de la primera solicitud
    if (totalPages === 1) {
        return {
            ordenes: allOrders,
            totalRegistros: firstResponse.obj["total de registros"]
        };
    }

    return {
        ordenes: allOrders,
        totalRegistros: firstData.obj["total de registros"]
    };
}
