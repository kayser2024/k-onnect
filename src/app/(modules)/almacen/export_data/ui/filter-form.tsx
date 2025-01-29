'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'

import { format } from "date-fns"
import { es } from 'date-fns/locale';
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
import { SelectUser } from './select-user';
import { SelectOrderStatus } from './select-orderStatus';


interface FilterFormProps {
  setOrderFilter: (value: any) => void;
  setLoading: (value: boolean) => void;
}
export const FilterForm = ({ setOrderFilter, setLoading }: FilterFormProps) => {
  const [dateStart, setDateStart] = useState<Date | undefined>(new Date())
  const [dateEnd, setDateEnd] = useState<Date | undefined>(new Date())

  const [userId, SetUserId] = useState(4)//usuarioID  felipe 
  const [orderStatusId, setOrderStatusId] = useState(2)


  const { data, isFetching, isError, refetch, isLoading } = useQuery({
    queryKey: ["dataFilter"],
    queryFn: async () => {
      if (!dateStart || !dateEnd) {
        toast.warning("Por favor seleccione ambas fechas");
        return;
      }
      const resultFilter = await getOrdersByDate(dateStart, dateEnd, userId, orderStatusId)
      return resultFilter;
    },
    enabled: false
  })


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await refetch();
      if (result.data && result.data.ok && result.data.data) {
        setOrderFilter(result.data.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [dateStart, dateEnd, userId, orderStatusId, refetch, setLoading, setOrderFilter]);


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
    const worksheet = workbook.addWorksheet('Reporte');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'NRO PEDIDO', key: 'OrderNumber', width: 25 },
      { header: 'BOL./FACT.', key: 'Invoice', width: 15 },
      { header: 'DESTINO', key: 'PickupPoint', width: 40 },
      { header: 'USUARIO', key: 'User', width: 15 },
      { header: 'ESTADO', key: 'Status', width: 15 },
      { header: 'FECHA', key: 'Date', width: 15 },
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
    data.forEach(order => {
      worksheet.addRow({
        OrderNumber: order.OrderNumber,
        Invoice: order.Invoice,
        PickupPoint: order.PickupPoint,
        User: order.Users.Name,
        Status: order.OrderStatus.Description,
        Date: order.CreatedAt,
      });
    });

    const startDateFormatted = dateStart ? format(dateStart, 'dd-MMM-yyyy') : '';
    const endDateFormatted = dateEnd ? format(dateEnd, 'dd-MMM-yyyy') : '';
    const fileName = `REPORTE_${startDateFormatted}_to_${endDateFormatted}.xlsx`;

    // Generar archivo Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  if (isLoading) {
    return <Loader />
  }


  return (
    <div className='flex gap-2 bg-slate-100 rounded-md p-2'>
      <div className="flex flex-col gap-1">
        <Label>Incio</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !dateStart && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {dateStart ? format(dateStart, "dd MMM y", { locale: es }) : <span>Seleccione una Fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateStart}
              onSelect={(day) => setDateStart(day ?? undefined)}
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
                "w-[200px] justify-start text-left font-normal",
                !dateEnd && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {dateEnd ? format(dateEnd, "dd MMM y", { locale: es }) : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateEnd}
              onSelect={(day) => setDateEnd(day ?? undefined)}
              initialFocus
              locale={es}
              disabled={{ before: new Date("2025-01-02"), after: new Date() }}
            />
          </PopoverContent>
        </Popover>

      </div>
      {/* TODO: Filtrar por Usuario 🚩 */}
      <div className="flex flex-col gap-1">
        <Label>Usuario:</Label>
        <SelectUser userId={userId} setUserId={SetUserId} />

      </div>

      {/* TODO: Filtrar por estado del pedido */}
      <div className="flex flex-col gap-1">
        <Label>Estado:</Label>
        <SelectOrderStatus orderStatusId={orderStatusId} setOrderStatusId={setOrderStatusId} />
      </div>

      {/* Button para cargar Datos */}
      <Button onClick={downloadReport} className='mt-5' disabled={isFetching}>{isFetching ? "Descargando..." : "Descargar Excel"}</Button>

    </div>
  )
}
