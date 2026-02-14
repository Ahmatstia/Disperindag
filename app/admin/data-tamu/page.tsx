"use client";

import { useState, useEffect } from "react";
import { getTamuData } from "@/lib/apps-script";
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
import { LoadingTable } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tipe data untuk tamu
interface TamuItem {
  Timestamp: string;
  Nama: string;
  Instansi: string;
  Keperluan: string;
  "Bertemu Dengan": string;
  [key: string]: string;
}

export default function TamuPage() {
  const [data, setData] = useState<TamuItem[]>([]);
  const [filteredData, setFilteredData] = useState<TamuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [selectedTamu, setSelectedTamu] = useState<TamuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Ambil data
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getTamuData();
      setData(result);
      setFilteredData(result);
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
          item.Instansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Keperluan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item["Bertemu Dengan"]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
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

  const columns = [
    "Timestamp",
    "Nama",
    "Instansi",
    "Keperluan",
    "Bertemu Dengan",
  ];

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Buku Tamu Digital</h1>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Tamu</CardTitle>
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
            <CardTitle className="text-sm text-gray-500">Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {
                filteredData.filter((item) => {
                  const today = new Date().toDateString();
                  const itemDate = new Date(
                    item.Timestamp || "",
                  ).toDateString();
                  return today === itemDate;
                }).length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Minggu Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {
                filteredData.filter((item) => {
                  const today = new Date();
                  const weekAgo = new Date(today.setDate(today.getDate() - 7));
                  const itemDate = new Date(item.Timestamp || "");
                  return itemDate >= weekAgo;
                }).length
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
            placeholder="Cari nama/instansi/keperluan..."
          />
          <DateRangePicker onSelect={setDateRange} />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename="data-tamu"
            sheetName="Buku Tamu"
          />
          <ExportPDF
            data={filteredData}
            columns={columns}
            title="Data Buku Tamu Digital"
            filename="data-tamu"
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
                <TableHead>Instansi</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Bertemu Dengan</TableHead>
                <TableHead className="w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {item.Nama || "-"}
                  </TableCell>
                  <TableCell>{item.Instansi || "-"}</TableCell>
                  <TableCell>{item.Keperluan || "-"}</TableCell>
                  <TableCell>{item["Bertemu Dengan"] || "-"}</TableCell>
                  <TableCell>
                    <Dialog
                      open={dialogOpen && selectedTamu === item}
                      onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setSelectedTamu(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTamu(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detail Kunjungan</DialogTitle>
                          <DialogDescription>
                            Informasi lengkap tamu
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTamu && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="font-medium">
                                  {selectedTamu.Nama}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Instansi
                                </p>
                                <p className="font-medium">
                                  {selectedTamu.Instansi}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Keperluan
                                </p>
                                <p className="font-medium">
                                  {selectedTamu.Keperluan}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Bertemu Dengan
                                </p>
                                <p className="font-medium">
                                  {selectedTamu["Bertemu Dengan"]}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Waktu Kunjungan
                                </p>
                                <p className="font-medium">
                                  {selectedTamu.Timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
