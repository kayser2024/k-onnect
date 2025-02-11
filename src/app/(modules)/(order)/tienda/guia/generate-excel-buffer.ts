import ExcelJS from "exceljs";

interface GuideDetail {
    Description: string;
    BarCode: string;
    ProductCode: string;
    Quantity: number;
    QuantityPicks: number;
    ExistInGuide: boolean;
}

interface Resumen {
    total: number;
    missing: number;
    plus: number;
    noList: number;
    totalpicks: number;
}

export const generateExcelBuffer = async (
    guideDetails: GuideDetail[],
    resumen: Resumen
): Promise<Buffer> => {
    if (guideDetails.length === 0) {
        throw new Error("No hay datos para generar el archivo.");
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detalles de la Guía");

    // Definir las columnas del archivo Excel
    worksheet.columns = [
        { header: "Descripción", key: "Description", width: 30 },
        { header: "Código de Barras", key: "BarCode", width: 20 },
        { header: "Código de Producto", key: "ProductCode", width: 20 },
        { header: "Cantidad", key: "Quantity", width: 15 },
        { header: "Cantidad Picks", key: "QuantityPicks", width: 15 },
        { header: "Existente en Guía", key: "ExistInGuide", width: 20 },
    ];

    // Aplicar estilos a la cabecera
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // Negrita y texto blanco
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4CAF50" }, // Verde para el fondo
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar los datos de los detalles de la guía y aplicar estilos
    guideDetails.forEach((detail) => {
        const row = worksheet.addRow({
            Description: detail.Description,
            BarCode: detail.BarCode,
            ProductCode: detail.ProductCode,
            Quantity: detail.Quantity,
            QuantityPicks: detail.QuantityPicks,
            ExistInGuide: detail.ExistInGuide ? "Sí" : "No",
        });

        // Aplicar color a las filas donde ExistInGuide sea "No"
        if (!detail.ExistInGuide) {
            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFE4B5" }, // Color naranja claro
                };
            });
        }
    });

    // Agregar una fila vacía para separar los detalles del resumen
    worksheet.addRow([]);

    // Agregar el resumen
    worksheet.addRow(["Resumen"]);
    worksheet.addRow(["Total", resumen.total]);
    worksheet.addRow(["Faltantes", resumen.missing]);
    worksheet.addRow(["Sobrantes", resumen.plus]);
    worksheet.addRow(["No List", resumen.noList]);
    worksheet.addRow(["Total Picks", resumen.totalpicks]);

    // Generar el buffer del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer); // Convertir a Buffer
};