import ExcelJS from 'exceljs';

export const createWorksheet = (workbook: ExcelJS.Workbook, sheetName: string) => {
  const sheet = workbook.addWorksheet(sheetName);

  // Estilo base para encabezados
  const headerStyle = {
    font: { bold: true, size: 12 },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  return { sheet, headerStyle };
};

// Helper para ajustar automáticamente el ancho de las columnas
export const autoFitColumns = (sheet: ExcelJS.Worksheet) => {
  sheet.columns.forEach((column) => {
    if (!column.values) return; // Manejo de undefined en column.values

    const maxLength = column.values
      .filter((val): val is string | number => val !== null && val !== undefined) // Filtrar valores válidos
      .reduce((max: number, val) => {
        const length = val?.toString().length || 0;
        return Math.max(max, length);
      }, 10);

    column.width = maxLength + 2;
  });
};
