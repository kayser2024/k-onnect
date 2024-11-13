// import { NextResponse } from "next/server";
// import mysql from 'mysql2/promise';

// export async function GET() {
//     const url = `https://sami3-external.winwinafi.com/inventary/variant/kayser.pe`;
//     const key = process.env.SAMISHOP_API_TOKEN;
//     let page = 1;
//     const products: any = [];

//     try {
//         const connection = await mysql.createConnection({
//             host: '45.33.100.232',
//             user: 'promotora',
//             port: 3306,
//             password: 'T123456TCilesia/*',
//             database: 'ptspromotora'
//         });

//         // Loop through all pages
//         while (true) {
//             const result = await fetch(`${url}?page=${page}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': key as string,
//                 },
//             });

//             const response = await result.json();
//             const { obj } = response;

//             if (!obj || obj.length === 0) {
//                 break;  // Exit the loop if there is no data
//             }

//             // Extract SKU and URL from response and add to products array
//             obj[0].datos_variacion.forEach((product: any) => {
//                 const { sku, url1_imagen_sku } = product;
//                 if (sku && url1_imagen_sku) {
//                     products.push([sku, url1_imagen_sku]);
//                 }
//             });

//             // Check if we have reached the last page
//             if (page >= obj[0].paginas_totales) {
//                 break;
//             }
//             page++;
//         }

//         // Insert all products into the database
//         const insertQuery = `INSERT INTO tbl_EAN (sku, link) VALUES ?`;
//         await connection.query(insertQuery, [products]);

//         await connection.end();

//         return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });

//     } catch (error: any) {
//         return NextResponse.json({
//             error: error.message
//         }, { status: 500 });
//     }
// }




// import { NextResponse } from "next/server";
// import mysql from 'mysql2/promise';

// export async function GET() {

//     try {
//         // Realizamos la conexión a la base de datos MySQL
//         const connection = await mysql.createConnection({
//             host: '45.33.100.232',
//             user: 'promotora',
//             port: 3306,
//             password: 'T123456TCilesia/*',
//             database: 'ptspromotora',
//         });

//         // Obtenemos los datos de tbl_productos y tbl_articulos, cruzándolos por el itemCode
//         const query = `
//             SELECT a.codigoEan, a.codigoSap, e.link
//             FROM tbl_articulo a
//             INNER JOIN tbl_EAN e ON a.codigoEan = e.sku
//         `;
//         const [rows] = await connection.query(query);

//         // Link por defecto cuando no se encuentre una imagen
//         const defaultImageLink = "https://media.istockphoto.com/id/1055079680/es/vector/c%C3%A1mara-lineal-negro-como-ninguna-imagen-disponible.jpg?s=612x612&w=0&k=20&c=mYv5-3x668712KVHFnzZX2Tvb_DEQ2Ka7dDwOkTp9Q8=";

//         // Mapeamos los resultados para ajustarlos a la inserción
//         const dataToInsert = rows.map((row: any) => [
//             row.codigoEan || '',  // Si no hay código Ean, lo dejamos vacío
//             row.codigoSap,
//             row.link || defaultImageLink  // Si no hay link, usamos el link por defecto
//         ]);

//         // Insertamos los datos en la tabla tbl_all
//         const insertQuery = `
//             INSERT INTO OSF_Product (codigoEan, codigoSap, url_foto) 
//             VALUES ?
//         `;
//         await connection.query(insertQuery, [dataToInsert]);

//         // Cerramos la conexión a la base de datos
//         await connection.end();

//         return NextResponse.json({ message: 'Data inserted successfully into OSF_Productos' }, { status: 200 });

//     } catch (error: any) {
//         console.error(error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
