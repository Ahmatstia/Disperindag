"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DateRangePickerProps {
  onSelect: (range: { from: Date; to: Date } | null) => void;
}

export function DateRangePicker({ onSelect }: DateRangePickerProps) {
  const [date, setDate] = useState<{ from: Date; to: Date }>();

  const handleSelect = (range: any) => {
    setDate(range);
    if (range?.from && range?.to) onSelect(range);
    else onSelect(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
            ) : (
              format(date.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Pilih rentang tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleSelect}
          locale={id}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
