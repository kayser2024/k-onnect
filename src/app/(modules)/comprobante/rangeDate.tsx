"use client"

import * as React from "react"
import { addDays, addMonths, format } from "date-fns"
import { es } from "date-fns/locale" // Importa el idioma español
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  // Establece el rango de fechas por defecto con la fecha actual
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addMonths(new Date(),-3),
    to: new Date(),
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM y", { locale: es })} - {format(date.to, "dd MMM y", { locale: es })}
                </>
              ) : (
                format(date.from, "dd MMM y", { locale: es })
              )
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={es}
            disabled={{after:new Date()}}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
