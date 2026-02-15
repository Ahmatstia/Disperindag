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

interface DatePickerProps {
  onSelect: (date: Date | null) => void;
  placeholder?: string;
}

export function DatePicker({
  onSelect,
  placeholder = "Pilih tanggal",
}: DatePickerProps) {
  const [date, setDate] = useState<Date>();

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onSelect(selectedDate || null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-60 justify-start text-left border-gray-200 hover:bg-gray-50"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? (
            format(date, "dd/MM/yyyy")
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={id}
        />
      </PopoverContent>
    </Popover>
  );
}
