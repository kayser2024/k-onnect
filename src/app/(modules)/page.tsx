import React from 'react'
import { Button } from '@/components/ui/button'
// import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function ModulesPage() {
  return (
    <main className=" flex flex-col  gap-2">

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Busqueda exacta</AccordionTrigger>
          <AccordionContent className='flex gap-2 p-1'>
            <Input type='text' placeholder='Buscar Orden ...' />
            <Input type='text' placeholder='Buscar Boleta ...' />
            <Input type='text' placeholder='Buscar DNI ...' />
            <Button variant='default'>Buscar</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" >
          <AccordionTrigger>Busqueda por coincidencia</AccordionTrigger>
          <AccordionContent className='flex gap-2 p-1'>

            <Input type='text' placeholder='Buscar Orden...' />
            <Input type='text' placeholder='Buscar Boleta...' />
            <Input type='text' placeholder='Buscar DNI...' />
            <Button variant='default' >Cargar datos</Button>

          </AccordionContent>
        </AccordionItem>


      </Accordion>




      <h2 className='text-xl my-5'>Resultado</h2>

      {/* Table */}
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>


    </main>
  )
}

export default ModulesPage