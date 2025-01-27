'use server'

export const getDataOrderByInvoice = async (invoice: string, statusPayment: string = "pagado") => {

  const URL = `${process.env.WIN_WIN_URL}?estado_facturacion=${invoice.trim().toUpperCase()}&paymentStatus=${statusPayment}`;
  try {

    const result = await fetch(URL, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SAMISHOP_API_TOKEN as string
      }
    })

    const response = await result.json();

    return response.obj.ordenes[0]
  } catch (error: any) {

    console.log(error.message);
  }

}


export const getDataOrderByOrder = async () => {

}