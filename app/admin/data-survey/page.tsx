"use client";

import { useState, useEffect } from "react";
import { getSurveyData } from "@/lib/apps-script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/filters/search-input";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { ExportExcel } from "@/components/export/export-excel";
import { ExportPDF } from "@/components/export/export-pdf";
import { KepuasanChart } from "@/components/charts/kepuasan-chart";
import { LoadingTable } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Tipe data yang lebih spesifik
interface SurveyItem {
  Timestamp: string;
  Nama: string;
  Pekerjaan: string;
  "Jenis Kelamin": string;
  Kepuasan: string;
  [key: string]: string | undefined;
}

export default function SurveyPage() {
  const [data, setData] = useState<SurveyItem[]>([]);
  const [filteredData, setFilteredData] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );

  // Ambil data
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSurveyData();
      // Pastikan data memiliki properti yang diperlukan
      const formattedData = result.map((item: Record<string, string>) => ({
        Timestamp: item.Timestamp || "",
        Nama: item.Nama || "",
        Pekerjaan: item.Pekerjaan || "",
        "Jenis Kelamin": item["Jenis Kelamin"] || "",
        Kepuasan: item.Kepuasan || "",
        ...item,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data
  useEffect(() => {
    let filtered = [...data];

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, dateRange, data]);

  // Hitung rata-rata kepuasan
  const hitungRataKepuasan = () => {
    if (filteredData.length === 0) return "0.0";
    const total = filteredData.reduce((acc, item) => {
      const nilai = parseInt(item.Kepuasan) || 0;
      return acc + nilai;
    }, 0);
    return (total / filteredData.length).toFixed(1);
  };

  const columns = [
    "Timestamp",
    "Nama",
    "Pekerjaan",
    "Jenis Kelamin",
    "Kepuasan",
  ];

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Survey Kepuasan</h1>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 gap-6">
        <KepuasanChart data={filteredData} />
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {filteredData.length}
            </p>
            <p className="text-xs text-gray-500">Dari {data.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Rata-rata Kepuasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {hitungRataKepuasan()}
            </p>
            <p className="text-xs text-gray-500">/5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Laki-laki</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {
                filteredData.filter(
                  (item) =>
                    item["Jenis Kelamin"]?.toLowerCase() === "laki-laki",
                ).length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Perempuan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600">
              {
                filteredData.filter(
                  (item) =>
                    item["Jenis Kelamin"]?.toLowerCase() === "perempuan",
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Cari nama/pekerjaan..."
          />
          <DateRangePicker onSelect={setDateRange} />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename="data-survey"
            sheetName="Survey"
          />
          <ExportPDF
            data={filteredData}
            columns={columns}
            title="Data Survey Kepuasan"
            filename="data-survey"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Kepuasan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell>{item.Nama || "-"}</TableCell>
                  <TableCell>{item.Pekerjaan || "-"}</TableCell>
                  <TableCell>{item["Jenis Kelamin"] || "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item.Kepuasan ? `${item.Kepuasan}/5` : "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-sm text-gray-500 text-right">
        Menampilkan {filteredData.length} dari {data.length} data
      </div>
    </div>
  );
}
