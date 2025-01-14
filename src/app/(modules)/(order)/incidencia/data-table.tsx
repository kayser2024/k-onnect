'use client'

import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { changStatusIncidence, detailOrder, getAllIncidence, getAllIncidenceByInvoice, searchIncidence, updateIncidence } from '@/actions/order/Incidencia'
import { formatDate } from '@/helpers/convertDate'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ConfirmCompleted } from './ui/confirm-completed'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { columns } from './columns'
import { RiFileExcel2Line } from 'react-icons/ri'
import { downloadExcelReport, downloadExcelReportDetail } from '@/lib/excel/downloadExcel'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, MonitorDown, MoreVertical } from 'lucide-react'
import { InputInvoiceModal } from './ui/inputInvoice-modal'


interface OrderProps {
  incidentList: [];
}

export const DataTable = ({ incidentList }: OrderProps) => {
  const [dataIncidente, setDataIncidente] = useState(incidentList)
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState({});
  const [enabled, setEnabled] = useState(false);
  const [order, setOrder] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [valueSearch, setValueSearch] = useState("")
  const [incidenceId, setIncidenceId] = useState(0);
  const [openInputModal, setOpenInputModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const [invoice, setInvoice] = useState("")
  const [nc, setNc] = useState("")


  // Obtener el detalle de la orden
  const { data, refetch, isLoading, isPending } = useQuery({
    queryKey: ["OrderDetail", order],
    queryFn: async ({ queryKey }) => {
      const orden = queryKey[1];
      return await detailOrder(Number(orden))
    },
    enabled: enabled,
  })

  // se ejecutará cuando se hace click
  const getDetailOrden = (orden: number) => {
    setOrder(orden)
    setEnabled(true);
    refetch();
  }

  // Función para actulizar el estado de la orden a Completado
  const handleAccept = async () => {
    setLoading(true)

    try {
      await changStatusIncidence(incidenceId);

    } catch (error: any) {
      console.log(error.message)
      toast.error("Ocurrió un error al actualizar el estado de la incidencia");
    } finally {
      setLoading(false)
      setIsOpen(false)
      setOpenDropdown(null)
      //refetch Incidence
      refetch()//refetch incidenceDetail
    }
  }

  // Función para Descar DetailReport
  const handleDownLoadDetail = async (orden: number) => {
    try {
      // obtener la data
      const dataDetails = await detailOrder(orden)

      // Si los datos existen, realiza la descarga
      await downloadExcelReportDetail(dataDetails);

      toast.success("Detalle descargado exitosamente");
    } catch (error: any) {
      console.error("Error al descargar el detalle:", error);
      toast.error("Ocurrió un error al descargar");
    } finally {
      setLoading(false); // Restablece el estado de carga
      setOrder(0)
    }
  }


  const table = useReactTable({
    data: dataIncidente,
    columns: columns(getDetailOrden, handleDownLoadDetail),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      sorting,
      expanded
    },
  })


  // Función para buscar incidencia por el Invoice
  const handleSearch = async () => {
    const trimmedValue = valueSearch.trim();

    if (!trimmedValue) {
      // No hay búsqueda, obtener todas las incidencias
      try {
        setLoading(true);
        const response = await getAllIncidence();
        setDataIncidente(response);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (trimmedValue.length > 5) {
      // Buscar por boleta válida
      try {
        setLoading(true);
        // const response = await getAllIncidenceByInvoice(trimmedValue);
        const response = await searchIncidence(trimmedValue)
        setDataIncidente(response);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      //   // Formato inválido
      toast.warning("Ingresar una Boleta válida");
    }

  }


  // Función para "activar" checkboks a "COMPLETAR" incidencia 
  const handleChange = (incidenceId: number, detail: any) => {
    const { TypeIncidenceID, Received, Dispatched, NCIncidence, InvoiceIncidence } = detail


    if (TypeIncidenceID === 3) {
      // CAMBIO
      if (NCIncidence && InvoiceIncidence.trim().length > 0) {
        setIncidenceId(incidenceId)
        setIsOpen((prev) => !prev)  //abrir modal
        setOpenDropdown(null)  //cerrar drowpDown
      } else {
        const message =
          "Falta" +
          (!NCIncidence ? " la NC" : "") +
          (!NCIncidence && InvoiceIncidence.trim().length === 0 ? " y" : "") +
          (InvoiceIncidence.trim().length === 0 ? " la Nueva Boleta" : "") +
          " para completar esta incidencia!";
        toast.warning(message)
        return
      }
    } else {
      // DEVOLUCION
      if (NCIncidence) {
        setIncidenceId(incidenceId)
        setIsOpen((prev) => !prev)  //abrir modal
        setOpenDropdown(null)  //cerrar drowpDown
      } else {
        toast.warning("Falta Ingresar la NC para completar esta incidencia")
        return
      }

    }


    // setIncidenceId(incidenceId)
    // setIsOpen((prev) => !prev)  //abrir modal
    // setOpenDropdown(null)  //cerrar drowpDown

  }

  // Función para Descargar Excel
  const downloadExcel = () => {
    downloadExcelReport(incidentList)
  };


  // Funcioón para guardar los Nros doc Ingresados
  const handleSave = async (data: any) => {
    setLoading(true)
    try {

      console.log(data, '👉👉👉')
      // Isertar la NC y Boleta de la incidencia
      const result = await updateIncidence({ ...data, incidenceId: incidenceId }, 'incidencia')


      // si es exitoso cerrar el modal
      if (result?.includes("ERROR:")) {
        toast.error(result);
      }
      if (result?.includes("OK")) {
        refetch(); // obtener los datos actualizados
        toast.success(result);
        setOpenInputModal(false)
      }

    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message)
    } finally {
      setOpenDropdown(null);
      setLoading(false)
      setIncidenceId(0)
    }
  }


  // Función para Abrir Modal de Ingresar Nro Doc.
  const handleInvoiceModal = (id: number, nc: string, invoice: string) => {
    setOpenInputModal(true)
    setOpenDropdown(null)
    setIncidenceId(id)
    setNc(nc)
    setInvoice(invoice)
  }

  const handleDropdownOpenChange = (isOpen: boolean, id: string) => {
    setOpenDropdown(isOpen ? id : null);
  }

  const handleCloseModal = () => {
    setIncidenceId(0)
    setNc("")
    setInvoice("")
    setOpenInputModal(false)
    setIsOpen(false)
    setOpenDropdown(null)
  }


  return (
    <div className="w-full">
      <div className='flex flex-col md:flex-row gap-2 py-4'>
        <Input placeholder='Buscar por Nombre, DNI, # Orden, # Invoice' onChange={e => setValueSearch(e.target.value)} value={valueSearch} />
        <div className="flex gap-2 items-center justify-center">
          <Button onClick={handleSearch} disabled={loading} className='w-full md:w-20'>{loading ? 'Buscando...' : 'Buscar'}</Button>
          <Button
            variant="outline"
            title="Descargar Reporte"
            onClick={downloadExcel}
            className="bg-green-500 md:flex items-center gap-2"
          >
            <RiFileExcel2Line color="white" size={20} />
            <span className="hidden md:inline text-white">Descargar</span>
          </Button>
        </div>

      </div>

      <div className="rounded-md border">
        {
          loading
            ? <Loader />
            :
            <Table className='w-full'>
              <TableHeader className='bg-slate-500'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={`row-${headerGroup.id}`}>
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <TableHead key={`${header.id}-${index}`} className='text-white'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())
                          }
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <React.Fragment key={`${row.id}-${index}`}>
                      {/* Fila principal */}
                      <TableRow data-state={row.getIsSelected() && "selected"} className={`${row.original.TypeIncidenceCount === 0 ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-100'}`}>
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell key={`cell-${cell.id}-${index}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Contenido expandido (FILA HIJO)*/}
                      {isLoading && <Loader />}
                      {row.getIsExpanded() && (

                        <TableRow className=' bg-slate-50 '>
                          <TableCell className="p-0"></TableCell>
                          <TableCell colSpan={row.getVisibleCells().length - 1} className="p-4 ">
                            <Table className='bg-slate-50 border w-full'>
                              <TableHeader className='bg-slate-400 '>
                                <TableRow className='text-white hover:bg-slate-400'>
                                  <TableHead className='text-white w-[350px]'>Prod. Original</TableHead>
                                  <TableHead className='text-white w-[350px]'>Prod. Cambiado</TableHead>
                                  <TableHead className='text-white w-[200px]'>Motivo</TableHead>
                                  <TableHead className='text-white'>N.C.</TableHead>
                                  <TableHead className='text-white'>Nva. Boleta</TableHead>
                                  <TableHead className='text-white'>Fecha</TableHead>
                                  <TableHead className='text-white w-[200px] truncate'>Tienda</TableHead>
                                  <TableHead className='text-white'>Acción</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className='bg-slate-100 border'>
                                {data?.map((detail: any, index: number) => (
                                  <TableRow key={`${index}-${new Date()}`} className={`hover:bg-slate-200 ${detail.IsCompleted ? 'bg-green-200 hover:bg-green-100' : 'hover:bg-slate-50'}`}>
                                    <TableCell className='w-[350px] '>
                                      <ul className='list-disc ml-2 w-[125px]'>
                                        {/* LISTAR LOS PRODUCTOS ORIGINALES */}
                                        {detail.IncidenceLogs
                                          .filter((incidence: any) => incidence.Description === 'ORIGIN' || incidence.Description === 'RETURN')
                                          .map((incidence: any, index: number) => {
                                            return (
                                              <li key={`${incidence.IncidenceLogID}-${index}`}>
                                                <span className='text-xs flex'>
                                                  {incidence.CodProd} ({incidence.ProdQuantity || 1})
                                                </span>
                                              </li>
                                            )
                                          })}
                                      </ul>

                                    </TableCell>
                                    <TableCell className='text-center w-[350px]'>

                                      {/* LISTAR LOS PRODUCTOS A CAMBIAR */}
                                      <ul className='list-disc ml-2 w-[125px]'>
                                        {detail.IncidenceLogs
                                          .filter((incidence: any) => incidence.Description === 'CHANGE')
                                          .map((incidence: any, index: number) => {
                                            return (
                                              <li key={`${incidence.IncidenceLogID}-${index}`}>
                                                <span className='text-xs flex'>
                                                  {incidence.CodProd} ({incidence.ProdQuantity || 1})
                                                </span>
                                              </li>
                                            )
                                          })}

                                      </ul>

                                    </TableCell>
                                    <TableCell className='text-xs'><span className='block w-[150px] truncate'>{detail.Description || "─"}</span></TableCell>
                                    <TableCell className='text-xs w-[200px] truncate'>{detail.NCIncidence || "─"} </TableCell>
                                    <TableCell className='text-xs w-[200px] truncate'>{detail.InvoiceIncidence || "─"}</TableCell>
                                    <TableCell className='text-xs'><span className='block w-[150px] truncate'>{formatDate(new Date(detail.CreatedAt).toISOString())}</span></TableCell>
                                    <TableCell className='text-xs'><span className='block w-[200px] truncate'>{detail.PickupPoints.Description}</span> </TableCell>


                                    <TableCell className='text-xs w-[250px]'>
                                      {detail.IsCompleted
                                        ? <Check className="text-white rounded-full p-[1px] font-bold text-center bg-green-500 m-auto" size={15} />
                                        : <DropdownMenu open={openDropdown === `${row.id}-${index}`} onOpenChange={(isOpen) => handleDropdownOpenChange(isOpen, `${row.id}-${index}`)}>
                                          <DropdownMenuTrigger asChild >
                                            <Button variant="ghost" aria-label="Opciones">
                                              <MoreVertical size={20} />
                                            </Button>
                                          </DropdownMenuTrigger>

                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                              <div className='flex gap-2 items-center'>
                                                <Checkbox
                                                  onCheckedChange={() => handleChange(Number(detail.IncidenceID), detail)}
                                                  checked={detail.IsCompleted}
                                                  disabled={detail.IsCompleted}
                                                  className={`peer ${detail.IsCompleted ? 'checked:bg-green-500' : ''}`}
                                                  style={{ backgroundColor: detail.IsCompleted ? 'green' : '' }}
                                                />Completado

                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleInvoiceModal(detail.IncidenceID, detail.NCIncidence, detail.InvoiceIncidence)}>
                                              Ingresar Nro Doc.
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      }
                                    </TableCell>
                                  </TableRow>
                                ))}

                              </TableBody>

                            </Table>
                          </TableCell>
                        </TableRow>

                      )}
                    </React.Fragment>

                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Ningún elemento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

        }
      </div>


      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </div>


      {/* MODAL INPUT DOCUMENT */}
      <InputInvoiceModal
        isOpen={openInputModal}
        setIsOpenModal={setOpenInputModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        isLoading={loading}
        NcIncidence={nc}
        InvoiceIncidence={invoice}
      />

      {/* Modal para confirmar el Completed */}
      <ConfirmCompleted
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={handleCloseModal}
        handleAccept={handleAccept}
        isLoading={loading}
      />
    </div >
  )
}