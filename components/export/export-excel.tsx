"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportExcelProps {
  data: any[];
  filename: string;
  sheetName?: string;
}

export function ExportExcel({
  data,
  filename,
  sheetName = "Sheet1",
}: ExportExcelProps) {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="h-4 w-4" /> Export Excel
    </Button>
  );
}
