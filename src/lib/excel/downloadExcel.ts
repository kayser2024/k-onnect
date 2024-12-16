import { saveAs } from 'file-saver';
import { exportDetailsToExcel, generateExcelFile } from './generateExcelReport';

export const downloadExcelReport = async (data: any[]) => {
  const fileName = `Reporte_${new Date().toISOString().slice(0, 10)}.xlsx`;

  try {
    const buffer = await generateExcelFile(data, fileName);

    // Crear archivo Blob y disparar descarga
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generando el archivo Excel:', error);
  }
};


export const downloadExcelReportDetail = async (data: any[]) => {
  const fileName = `Detalle_${data[0].InvoiceOriginal}.xlsx`;

  try {
    const buffer = await exportDetailsToExcel(data, fileName);

    // Crear archivo Blob y disparar descarga
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generando el archivo Excel:', error);
  }
};
