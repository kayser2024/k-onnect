import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function GET() {
    const url = `http://192.168.0.244:8060/api/Articulo/Obtener`;

    try {
        // Primero, realizar la conexión a la base de datos MySQL
        const connection = await mysql.createConnection({
            host: '45.33.100.232',
            user: 'promotora',
            port: 3306,
            password: 'T123456TCilesia/*',
            database: 'ptspromotora',
        });

        // Realizar la solicitud a la API
        const result = await fetch(url);
        const response = await result.json();

        // Verificar si la respuesta es un array
        if (Array.isArray(response)) {
            // Mapeamos los productos para obtener solo el itemCode y codeBars
            const products = response.map((product: any) => [
                product.codeBars,   // codEan
                product.itemCode    // codSap
            ]);

            // Realizar la inserción en la base de datos
            const insertQuery = `INSERT INTO tbl_articulo (codEan, codSap) VALUES ?`;
            await connection.query(insertQuery, [products]);

            // Cerrar la conexión
            await connection.end();

            return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });
        } else {
            throw new Error('La respuesta de la API no es un array.');
        }

    } catch (error: any) {
        // En caso de error, devolver el mensaje de error
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
