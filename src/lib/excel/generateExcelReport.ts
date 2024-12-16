import ExcelJS from 'exceljs';
import { autoFitColumns, createWorksheet } from './excelConfig';
// import { createWorksheet, autoFitColumns } from './excelConfig';

export const generateExcelFile = async (data: any[], fileName: string) => {
    // Crear workbook y configurar hoja
    const workbook = new ExcelJS.Workbook();
    const { sheet, headerStyle } = createWorksheet(workbook, 'Reporte');

    // Agregar encabezados
    const headers = ['Orden', 'Bol./Fact. Origianl', '# Incidencias', 'Destino'];
    sheet.addRow(headers);

    // Aplicar estilos a los encabezados
    sheet.getRow(1).eachCell((cell) => {
        Object.assign(cell, headerStyle);
    });

    // Agregar filas de datos
    data.forEach((item) => {
        sheet.addRow([item.OrderNumber, item.Invoice, item.TypeIncidenceCount, item.PickupPoint]);
    });

    // Autoajustar columnas
    autoFitColumns(sheet);

    // Generar buffer de Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};


// Función para generar y descargar el Excel
export const exportDetailsToExcel = async (data: any[], fileName: string) => {
    // Crear el libro y la hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detalles de Incidencia");

    // Agregar encabezados
    worksheet.columns = [
        { header: "Prod. Original", key: "prodOriginal", width: 30 },
        { header: "Prod. Cambiado", key: "prodCambiado", width: 30 },
        { header: "Motivo", key: "motivo", width: 20 },
        { header: "Bol. / Fact. Incidencia", key: "factura", width: 30 },
        { header: "Fecha", key: "fecha", width: 25 },
        { header: "Estado", key: "estado", width: 15 },
    ];

    // Agregar datos al Excel
    data.forEach((detail) => {
        // Extraer productos originales
        const prodOriginal = detail.IncidenceLogs
            .filter((incidence: any) => incidence.Description === "ORIGIN" || incidence.Description === "RETURN")
            .map((incidence: any) => `${incidence.CodProd} (${incidence.ProdQuantity || 1})`)
            .join(", ");

        // Extraer productos cambiados
        const prodCambiado = detail.IncidenceLogs
            .filter((incidence: any) => incidence.Description === "CHANGE")
            .map((incidence: any) => `${incidence.CodProd} (${incidence.ProdQuantity || 1})`)
            .join(", ");

        // Formatear fecha
        const fecha = new Date(detail.CreatedAt).toLocaleDateString();

        // Estado
        const estado = detail.TypeIncidenceID == 3
            ? (detail.IsCompleted ? "COMPLETADO" : "PENDIENTE")
            : "─";

        // Agregar fila
        worksheet.addRow({
            prodOriginal,
            prodCambiado,
            motivo: detail.Description || "─",
            factura: detail.InvoiceIncidence || "─",
            fecha,
            estado,
        });
    });

    // Estilo para encabezados
    worksheet.getRow(1).font = { bold: true };

    // Generar el archivo Excel en un buffer
    const buffer = await workbook.xlsx.writeBuffer();


    return buffer;
};


