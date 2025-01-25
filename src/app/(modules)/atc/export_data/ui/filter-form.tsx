'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'

import { format } from "date-fns"
import { es, fi } from 'date-fns/locale';
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getOrdersByDate } from '@/actions/order/getOrderByDate';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Loader } from '@/components/loader';
import { SelectStore } from './select-store';
import { SelectUser } from './select-user';
import { SelectTypeIncidence } from './select-type-incidence';
import { getIncidenceByFilter } from '@/actions/order/Incidencia';
import { SelectStatusIncidence } from './select-status-incidence';


interface FilterFormProps {
  setIncidenceFilter: (value: any) => void;
  setLoading: (value: boolean) => void;
}

interface FilterProps {
  pickupPointId: number | null;
  typeIncidenceId: number | null;
  isCompleted: boolean | null;
  userId: number | null;
  startDate: Date;
  endDate: Date;
}
export const FilterForm = ({ setIncidenceFilter, setLoading }: FilterFormProps) => {

  const [filter, setFilter] = useState<FilterProps>({
    pickupPointId: null,
    typeIncidenceId: null,
    isCompleted: null,
    userId: null,
    startDate: new Date(),
    endDate: new Date()
  })




  const { data, isFetching, isError, refetch, isLoading } = useQuery({
    queryKey: ["incidenceFilter"],
    queryFn: async () => {
      if (!filter.startDate || !filter.endDate) {
        toast.warning("Por favor seleccione ambas fechas");
        return;
      }

      const resultFilter = await getIncidenceByFilter(filter);
      return resultFilter;
    },
    enabled: false
  })



  const handleFilterChange = (key: keyof FilterProps, value: any) => {
    setFilter((prevFilter: FilterProps) => ({
      ...prevFilter,
      [key]: value
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await refetch();
      if (result.data && result.data.ok && result.data) {
        setIncidenceFilter(result.data.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [refetch, setLoading, setIncidenceFilter]);



  const downloadReport = async () => {
    // setLoading(true)
    const result = await refetch();
    if (result.data && result.data.ok && result.data.data) {
      generateExcelReport(result.data.data);
    }
    // setLoading(false)
  }


  const generateExcelReport = (data: any[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Incidencias');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'NRO PEDIDO', key: 'OrderNumber', width: 25 },
      { header: 'BOL./FACT.', key: 'Invoice', width: 15 },
      { header: 'PROD. ORIGINAL', key: 'Origin', width: 50 },
      { header: 'PROD. CAMBIO', key: 'Change', width: 50 },
      { header: 'COD. EAN', key: 'CodeEan', width: 50 },
      { header: 'N.C.', key: 'NoteCred', width: 15 },
      { header: 'NVA. BOLETA', key: 'NewInvoice', width: 15 },
      { header: 'TIENDA', key: 'PickupPoint', width: 50 },
      { header: 'TIPO', key: 'TypeIncidence', width: 30 },
      { header: 'MOTIVO', key: 'Motive', width: 30 },
      { header: 'ESTADO', key: 'Status', width: 20 },
      { header: 'USUARIO', key: 'User', width: 15 },
      { header: 'FECHA', key: 'Date', width: 15 },
      { header: 'OBSERVACIÓN', key: 'Observation', width: 30 },
    ];


    // Aplicar estilo a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000FF' }, // Fondo azul
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });


    // Agregar filas
    data.forEach(item => {
      const row = worksheet.addRow({
        OrderNumber: item.Orders.OrderNumber,
        Invoice: item.InvoiceOriginal,
        Origin: item.IncidenceLogs.filter((log: any) => log.Description !== "CHANGE").map((log: any) => log.CodProd).join(' || '),
        Change: item.IncidenceLogs.filter((log: any) => (log.Description === "CHANGE")).map((log: any) => log.CodProd).join(' || '),
        CodeEan: item.IncidenceLogs.filter((log: any) => (log.Description === "CHANGE")).map((log: any) => log.CodEan).join(' || '),
        NoteCred: item.NCIncidence || "---",
        NewInvoice: item.InvoiceIncidence || "---",
        PickupPoint: item.PickupPoints.Description,
        TypeIncidence: item.TypesIncidence.Description,
        Observation: item.IncidenceComments || "---",
        Status: item.IsCompleted ? "COMPLETADO" : "PENDIENTE",
        User: item.Users.Name,
        Date: item.CreatedAt,
        Motive: item.Description,
      });

      // Centrar la celda de la columna
      row.getCell('Invoice').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('NewInvoice').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('Status').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('User').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('Observation').alignment = { vertical: 'middle', horizontal: 'center' };

       // Colorear la celda de la columna 'Status' según la condición
       const statusCell = row.getCell('Status');
       if (item.IsCompleted) {
         statusCell.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'FF00FF00' }, // Fondo verde para "COMPLETADO"
         };
       } else {
         statusCell.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'FFFF0000' }, // Fondo rojo para "PENDIENTE"
         };
       }

    });


    const startDateFormatted = filter.startDate ? format(filter.startDate, 'dd-MMM-yyyy') : '';
    const endDateFormatted = filter.endDate ? format(filter.endDate, 'dd-MMM-yyyy') : '';
    const fileName = `REPORTE_${startDateFormatted}_to_${endDateFormatted}.xlsx`;

    // Generar archivo Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }


  const handleSearch = async () => {
    setLoading(true);
    const result = await refetch();
    if (result.data) {
      setIncidenceFilter(result.data.data);
    }
    setLoading(false);
  }


  // funcion para limpiar los campos del Filtro
  const handleClearFilter = () => {
    setFilter({
      pickupPointId: null,
      typeIncidenceId: null,
      isCompleted: null,
      userId: null,
      startDate: new Date(),
      endDate: new Date()
    })
  }

  if (isLoading) {
    return <Loader />
  }


  return (
    <div className='flex gap-2 flex-wrap'>
      <SelectTypeIncidence handleFilterChange={handleFilterChange} value={filter.typeIncidenceId} />

      <SelectUser handleFilterChange={handleFilterChange} value={filter.userId} />

      <SelectStore handleFilterChange={handleFilterChange} value={filter.pickupPointId} />

      <SelectStatusIncidence handleFilterChange={handleFilterChange} value={filter.isCompleted} />



      <div className="flex flex-col gap-1">
        <Label>Incio</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !filter.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {filter.startDate ? format(filter.startDate, "dd MMM y", { locale: es }) : <span>Seleccione una Fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filter.startDate}
              onSelect={(day) => handleFilterChange('startDate', day)}
              initialFocus
              locale={es}
              disabled={{ before: new Date("2025-01-02"), after: new Date() }}
            />
          </PopoverContent>
        </Popover>

      </div>


      <div className="flex flex-col gap-1">
        <Label>Fin</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !filter.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {filter.endDate ? format(filter.endDate, "dd MMM y", { locale: es }) : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filter.endDate}
              onSelect={(day) => handleFilterChange('endDate', day)}
              initialFocus
              locale={es}
              disabled={{ before: new Date("2025-01-02"), after: new Date() }}
            />
          </PopoverContent>
        </Popover>

      </div>





      <Button onClick={handleSearch} className='mt-5' disabled={isFetching}>{isFetching ? "Buscando..." : "Buscar"}</Button>
      <Button onClick={downloadReport} className='mt-5' disabled={isFetching} variant="success">{isFetching ? "Descargando..." : "Descargar"}</Button>
      <Button onClick={handleClearFilter} className='mt-5' variant="outline">Limpiar Filtro</Button>

    </div>
  )
}
