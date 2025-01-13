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
import { detailOrder, getAllIncidence, getAllIncidenceByInvoice } from '@/actions/order/Incidencia'
import { formatDate } from '@/helpers/convertDate'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { columns } from './columns'
import { RiFileExcel2Line } from 'react-icons/ri'
import { downloadExcelReport, downloadExcelReportDetail } from '@/lib/excel/downloadExcel'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, MoreVertical } from 'lucide-react'
import { ValidatorProductModal } from './ui/validatorProduct-modal'
import { Incidence, IncidenceLog, ResponseAllIncidence } from '@/types/IncidenceDB'


interface OrderProps {
  incidentList: ResponseAllIncidence[];
  EstablishmentID: number
}


export const DataTable = ({ incidentList, EstablishmentID }: OrderProps) => {
  const [dataIncidente, setDataIncidente] = useState(incidentList)
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState({});
  const [enabled, setEnabled] = useState(false);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false)
  const [valueSearch, setValueSearch] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [productsIncident, setProductsIncident] = useState<Incidence | []>([])

  const [isOpenModal, setIsOpenModal] = useState(false);

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

  // AFunción para actulizar el estado de la orden a Completado
  const handleAccept = async () => {

    try {
      setLoading(true)

      // llamar una acción para actualizar la incidencia a recibido conforme
      // await updateIncidence(incidentID);

    } catch (error: any) {
      console.log(error.message)
    } finally {
      setLoading(false)
      refetch()
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
        const response = await getAllIncidence(EstablishmentID);
        setDataIncidente(response);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (/^[BF].{4,}$/.test(trimmedValue)) {
      // Buscar por boleta válida
      try {
        setLoading(true);
        const response = await getAllIncidenceByInvoice(trimmedValue);
        setDataIncidente(response);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }



      // realizar busqueda NroDOC, Invoice, DNI

      

    } else {
      // Formato inválido
      toast.warning("Ingresar una Boleta válida");
    }

  }

  // Función para Descargar Excel
  const downloadExcel = () => {
    downloadExcelReport(incidentList)
  };



  const handleDropdownOpenChange = (isOpen: boolean, id: string) => {
    setOpenDropdown(isOpen ? id : null);
  }

  const handleCloseModal = () => {
    setProductsIncident([])
    setIsOpenModal(false)
    setOpenDropdown(null)
  }


  const validateProduct = (incidenceID: number, products: any) => {
    setOpenDropdown(null)
    setIsOpenModal(true)
    // console.log({ incidenceID, products }, '---------')

    // guardar los productos en la productsIncident
    setProductsIncident(products)
  }

  return (
    <div className="w-full">
      <div className='flex gap-2 py-4'>
        <Input placeholder='Buscar # Orden' onChange={e => setValueSearch(e.target.value)} value={valueSearch} />
        <Button onClick={handleSearch} disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</Button>
        <Button variant="outline" title='Descargar Reporte' onClick={downloadExcel}><RiFileExcel2Line color='green' size={25} />Descargar</Button>

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
                      <TableRow data-state={row.getIsSelected() && "selected"}>
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
                            <Table className='bg-slate-50 border'>
                              <TableHeader className='bg-slate-400 '>
                                <TableRow className='text-white hover:bg-slate-400'>
                                  <TableHead className='text-white w-[350px]'>Prod. Original</TableHead>
                                  <TableHead className='text-white w-[350px]'>Prod. Cambiado</TableHead>
                                  <TableHead className='text-white w-[350px]'>Motivo</TableHead>
                                  <TableHead className='text-white w-[300px]'>N.C.</TableHead>
                                  <TableHead className='text-white w-[300px]'>Nva. Boleta</TableHead>
                                  <TableHead className='text-white w-[250px]'>Fec. Creac.</TableHead>
                                  <TableHead className='text-white w-[250px]'>Fec. Recib.</TableHead>
                                  <TableHead className='text-white w-[250px]'>Fec. Entr.</TableHead>
                                  <TableHead className='text-white '>Acción</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className='bg-slate-200 border '>
                                {data?.map((detail: any, index: number) => (
                                  <TableRow key={`${index}-${new Date()}`} className={`hover:bg-slate-200 ${detail.IsCompleted ? 'bg-green-200 hover:bg-green-100' : 'hover:bg-slate-50'} border-white`}>
                                    <TableCell className='w-[350px] '>
                                      <ul className='list-disc ml-2 w-[130px]'>
                                        {/* LISTAR LOS PRODUCTOS ORIGINALES */}
                                        {detail.IncidenceLogs
                                          .filter((incidence: IncidenceLog) => incidence.Description !== 'CHANGE')
                                          .map((incidence: IncidenceLog, index: number) => {
                                            return (
                                              <li key={`${index}`}>
                                                <span className='text-xs flex '>
                                                  {incidence.CodProd} ({incidence.ProdQuantity || 1})
                                                </span>
                                              </li>
                                            )
                                          })}
                                      </ul>

                                    </TableCell>
                                    <TableCell className='text-center w-[350px]'>

                                      {/* LISTAR LOS PRODUCTOS A CAMBIAR */}
                                      <ul className='list-disc ml-2 w-[130px]'>
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
                                    <TableCell className='text-xs text-center'>{detail.Description || "─"}</TableCell>
                                    <TableCell className='text-xs w-[200px]'>{detail.NCIncidence}</TableCell>
                                    <TableCell className='text-xs w-[200px]'>{detail.InvoiceIncidence}</TableCell>
                                    <TableCell className='text-xs w-[250px]'>{formatDate(detail.CreatedAt)}</TableCell>
                                    <TableCell className='text-xs w-[250px]'>{formatDate(detail.ReceivedDate)}</TableCell>
                                    <TableCell className='text-xs w-[250px]'>{formatDate(detail.DispatchedDate)}</TableCell>


                                    <TableCell className='text-xs w-[150px]'>
                                      {detail.IsCompleted
                                        ? <Check className="text-white rounded-full p-[1px] font-bold text-center bg-green-500 m-auto" size={15} />
                                        : <DropdownMenu open={openDropdown === `${row.id}-${index}`} onOpenChange={(isOpen) => handleDropdownOpenChange(isOpen, `${row.id}-${index}`)}>
                                          <DropdownMenuTrigger asChild >
                                            <Button variant="ghost" aria-label="Opciones">
                                              <MoreVertical size={20} />
                                            </Button>
                                          </DropdownMenuTrigger>

                                          <DropdownMenuContent align="end">

                                            <DropdownMenuItem onClick={() => validateProduct(detail.IncidenceID, detail)}>
                                              Validar Producto.
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


      <ValidatorProductModal
        setIsOpenModal={setIsOpenModal}
        isOpen={isOpenModal}
        handleAccept={handleAccept}
        handleClose={handleCloseModal}
        isLoading={isLoading}
        productsIncidence={productsIncident}
        fnRefetch={refetch}
      />
    </div >
  )
}