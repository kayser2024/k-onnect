import { Incidence, IncidenceLog } from "@/types/IncidenceDB";

// Función para comprar Incidence, ProductList mediante el type="ORIGIN"|"CHANGE"|"RETURN"
export const handleCompareTableProducts = (incidence: Incidence, productsList: any, type: string) => {

    // comparar cantidad de items con la lista de products
    const cnt_item_incendece = incidence.IncidenceLogs.filter(f => f.Description === type).length

    if (cnt_item_incendece == productsList.length) {

        // Validar que las cantidades ingresadas coincidan con las originales, retorna las discrepancies
        const discrepancies = productsList.filter((product: IncidenceLog) => {

            const originalProduct = incidence.IncidenceLogs.filter((f: IncidenceLog) => f.Description === type).find(
                (item: IncidenceLog) => item.CodProd === product.CodProd
            );

            console.log({ originalProduct }, 'filter')
            // Si no encuentra el producto original, lo marca como discrepancia
            if (!originalProduct) {
                console.error(`Producto original no encontrado para: ${product.CodProd}`);
                return true;
            }

            // Verificar que las cantidades sean iguales
            return product.ProdQuantity !== originalProduct.ProdQuantity;
        });

        return {
            error: discrepancies.length > 0,
            message: `Discrepancia Products: ${discrepancies.map((d: any) => `COD: ${d.CodProd}-> CANT: ${d.ProdQuantity}`).join(', ')}`
        }
    }

    return {
        error: true,
        message: "Faltan Agregar más productos en la Lista"
    }

};
