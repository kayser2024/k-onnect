import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function GET() {
    const url = `http://192.168.0.244:5050/api/product-master`;

    try {
        // Primero, realizar la conexión a la base de datos MySQL
        const connection = await mysql.createConnection({
            host: '45.33.100.232',
            user: 'promotora',
            port: 3306,
            password: 'T123456TCilesia/*',
            database: 'ptspromotora_test',
        });

        // Realizar la solicitud a la API
        // const result = await fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.STOK_TOKEN_BEARER}`,
        //     },
        // });
        // const data = await result.json();
        // const imageNotFound = "https://www.smarttools.com.mx/wp-content/uploads/2019/05/imagen-no-disponible.png"
        // console.log(data.length)
        // // Verificar si la respuesta es un array
        // if (Array.isArray(data)) {
        //     // Mapeamos los productos para obtener solo el EAN, CodProdu,Description e ImageURL
        //     const products = data.filter((product: any) => product.EAN).map((product: any) => [
        //         product.EAN,   // codEan
        //         product.ProductCode,    // codSap
        //         product.DescriptionProduct,    // Description
        //         product.Images && product.Images[0] && product.Images[0].Image1 ? product.Images[0].Image1 : imageNotFound   // ImageURL
        //     ]);

        //     // Realizar la inserción en la base de datos
        //     const insertQuery = `INSERT INTO tbl_product_master (CodBar, CodProd, Description, ImageURL) VALUES ?`;
        //     await connection.query(insertQuery, [products]);

        //     // Cerrar la conexión
        //     await connection.end();

        //     return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });
        // } else {
        //     throw new Error('La respuesta de la API no es un array.');
        // }

    } catch (error: any) {
        // En caso de error, devolver el mensaje de error
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
