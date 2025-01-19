'use client'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface ConfirmContinueProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  setOptionSelected: (value: boolean) => void
}

export const ConfirmContinue = ({ openModal, setOpenModal, setOptionSelected }: ConfirmContinueProps) => {

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className=' z-50'>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás realmente seguro de continuar?</AlertDialogTitle>
          <AlertDialogDescription>
            El monto total a cambiar debe ser mayor o igual al monto total de los productos seleccionados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOptionSelected(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOptionSelected(true)}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
