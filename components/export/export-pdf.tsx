"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPDFProps {
  data: Record<string, unknown>[];
  columns: string[];
  title: string;
  filename: string;
}

export function ExportPDF({ data, columns, title, filename }: ExportPDFProps) {
  const handleExport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Dinas Perindustrian dan Perdagangan`, 14, 30);
    doc.text(`Provinsi Sumatera Barat`, 14, 36);

    // Table
    const tableData = data.map((item) =>
      columns.map((col) => item[col] || "-"),
    );

    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 45,
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <FileText className="h-4 w-4" />
      Export PDF
    </Button>
  );
}
