import { Incidence, IncidenceLog } from "@/types/IncidenceDB";

// Función para insertar codProduct en la tabla comparativa
export const AddTable = (incidence: Incidence, productList: any[], cod: string, type: string) => {

    // Buscar el producto en las incidencias basado en el tipo y el código
    const existingIncidenceProduct = incidence.IncidenceLogs.filter((log: IncidenceLog) => log.Description === type)
        .find((item: IncidenceLog) => item.CodProd === cod || item.CodEan === cod);

    // Si no se encuentra el producto, salir de la función
    if (!existingIncidenceProduct) return;

    // Verificar si el producto ya existe en la lista actual
    const existingProductIndex = productList.findIndex(
        (product: IncidenceLog) => product.CodProd === cod || product.CodEan === cod
    );

    // Crear una copia de la lista actualizada
    const updatedProductList = [...productList];

    if (existingProductIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        updatedProductList[existingProductIndex].ProdQuantity += 1;
    } else {
        // Si no existe, agregar el producto con cantidad inicial
        updatedProductList.push({
            ...existingIncidenceProduct,
            ProdQuantity: 1,
        });
    }

};
