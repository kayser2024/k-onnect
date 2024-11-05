'use server'
import { format } from "date-fns";

export async function fetchingAllData(start = format(new Date(), "yyyy-MM-dd"), end = format(new Date(), "yyyy-MM-dd")) {

    const url=process.env.WIN_WIN_URL
    const firstResponse = await fetch(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}`, 
     {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': process.env.SAMISHOP_API_TOKEN as string
         },
         cache: "no-cache"
     }
 );
 const firstData = await firstResponse.json();

 // Calculamos el número total de páginas
 const totalPages = firstData.obj["paginas totales"];
 let allOrders = firstData.obj["ordenes"];

 // Si hay más de una página, iteramos para obtener todas las demás páginas
 if (totalPages > 1) {
     const requests = [];

     // Empezamos en la página 2 ya que la primera ya la hemos obtenido
     for (let page = 2; page <= totalPages; page++) {
         requests.push(
             fetch(`${process.env.WIN_WIN_URL}?orderStartDate=${start}&orderEndDate=${end}&page=${page}`, {
                 method: 'GET',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': process.env.SAMISHOP_API_TOKEN as string
                 },
                 cache: "no-cache"
             }).then( res => res.json().then(data => data.obj["ordenes"]))
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