"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  onFilter: (status: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function StatusFilter({
  onFilter,
  options,
  placeholder = "Semua Status",
}: StatusFilterProps) {
  return (
    <Select onValueChange={onFilter}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
