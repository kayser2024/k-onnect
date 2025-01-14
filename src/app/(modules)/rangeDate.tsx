"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  className,
  isExact,
  loading
}: {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  className?: string;
  isExact?: boolean;
  loading: boolean;
}) {
  // Initialize the date range based on the provided startDate and endDate
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range.to) {
      const start = new Date(range.from);
      const end = new Date(range.to);
      const oneWeekLater = addDays(start, 7);

      // Restrict the end date to one week from the start date
      if (end > oneWeekLater) {
        range.to = oneWeekLater;
      }
    }

    setDate(range);
    if (range?.from) setStartDate(range.from);
    if (range?.to) setEndDate(range.to);
  };

  return (
    <div className={cn("grid gap-2", className)} >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={loading || isExact}
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
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={es}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
