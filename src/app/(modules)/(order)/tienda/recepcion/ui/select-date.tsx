'use client'

import React from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Props {
    date: Date | undefined,
    setDate: (value: Date | undefined) => void
}
export const SelectDate = ({ date, setDate }: Props) => {


    // const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, "dd MMM y", { locale: es }) : <span>Seleccione una Fecha</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => setDate(day ?? undefined)}
                    initialFocus
                    locale={es}
                    disabled={{ before: new Date("2025-01-02"), after: new Date() }}
                />
            </PopoverContent>
        </Popover>
    )
}
