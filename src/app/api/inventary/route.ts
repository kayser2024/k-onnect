import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';
import ExcelJS from 'exceljs';


// ENDPOINT para obtener todas las url del inventario y descargar excel,


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
//             database: 'ptspromotora_test'
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
//                 break;
//             }

//             // Extract SKU and URL from response and add to products array
//             obj[0].datos_variacion.forEach((product: any) => {
//                 const { sku, url1_imagen_sku, url2_imagen_sku, url3_imagen_sku, url4_imagen_sku, url5_imagen_sku, url6_imagen_sku, price, sale_price } = product;
//                 products.push([sku, url1_imagen_sku, url2_imagen_sku, url3_imagen_sku, url4_imagen_sku, url5_imagen_sku, url6_imagen_sku, price, sale_price]);
//             });

//             // Check if we have reached the last page
//             if (page >= obj[0].paginas_totales) {
//                 break;
//             }
//             page++;
//         }

//         // Insert all products into the database
//         const insertQuery = `INSERT INTO tbl_inventary (sku, url_1,url_2,url_3,url_4,url_5,url_6, price, price_sale) VALUES ?`;
//         await connection.query(insertQuery, [products]);


//         // Generate Excel file
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Inventario');

//         // Add headers
//         worksheet.columns = [
//             { header: 'SKU', key: 'sku', width: 15 },
//             { header: 'URL 1', key: 'url_1', width: 30 },
//             { header: 'URL 2', key: 'url_2', width: 30 },
//             { header: 'URL 3', key: 'url_3', width: 30 },
//             { header: 'URL 4', key: 'url_4', width: 30 },
//             { header: 'URL 5', key: 'url_5', width: 30 },
//             { header: 'URL 6', key: 'url_6', width: 30 },
//             { header: 'Price', key: 'price', width: 10 },
//             { header: 'Sale Price', key: 'price_sale', width: 10 }
//         ];

//         // Add rows
//         worksheet.addRows(products);

//         // Create a buffer to send as response
//         const buffer = await workbook.xlsx.writeBuffer();

//         await connection.end();



//         // Return Excel file as response
//         return new NextResponse(buffer, {
//             status: 200,
//             headers: {
//                 'Content-Disposition': 'attachment; filename=inventario.xlsx',
//                 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//             },
//         });
//         // return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });

//     } catch (error: any) {
//         return NextResponse.json({
//             error: error.message
//         }, { status: 500 });
//     }
// }