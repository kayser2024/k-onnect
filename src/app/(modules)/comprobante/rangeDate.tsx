"use client";

import * as React from "react";
import { format } from "date-fns";
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
}: {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  className?: string;
}) {
  // Initialize the date range based on the provided startDate and endDate
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  // Update external startDate and endDate when the date range changes
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range.to) {
      const start = new Date(range.from);
      const end = new Date(range.to);
      const oneMonthLater = new Date(start);
      oneMonthLater.setMonth(start.getMonth() + 1);

      // Check if the end date exceeds one month from the start date
      if (end > oneMonthLater) {
        // Set the end date to one month after the start date
        range.to = oneMonthLater;
      }
    }

    setDate(range);
    if (range?.from) setStartDate(format(range.from, "yyyy-MM-dd"));
    if (range?.to) setEndDate(format(range.to, "yyyy-MM-dd"));
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal",
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
