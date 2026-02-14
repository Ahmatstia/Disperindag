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
  onSelect: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ onSelect }: DateRangePickerProps) {
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-70 justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "dd/MM/yyyy")} -{" "}
                {format(date.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(date.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Pilih rentang tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={date}
          onSelect={(range?: { from?: Date; to?: Date }) => {
            if (range?.from && range?.to) {
              setDate({ from: range.from, to: range.to });
              onSelect({ from: range.from, to: range.to });
            } else {
              setDate(undefined);
            }
          }}
          locale={id}
        />
      </PopoverContent>
    </Popover>
  );
}
