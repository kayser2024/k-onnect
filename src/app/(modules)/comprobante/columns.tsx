"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Order = {
  id: string
  fecha: string
  boleta: string
  orden: string
  pdf:string
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "fecha",
    header: "FECHA",
  },
  {
    accessorKey: "boleta",
    header: "# BOLETA",
  },
  {
    accessorKey: "orden",
    header: "# Orden",
  },
  {
    accessorKey: "pdf",
    header: "PDF",
  },
]
