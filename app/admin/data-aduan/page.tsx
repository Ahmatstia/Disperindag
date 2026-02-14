"use client";

import { useState, useEffect } from "react";
import { getAduanData } from "@/lib/apps-script";
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
import { StatusFilter } from "@/components/filters/status-filter";
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

// Tipe data untuk aduan
interface AduanItem {
  Timestamp: string;
  Nama: string;
  "No HP": string;
  Kategori: string;
  "Isi Aduan": string;
  Status: string;
  [key: string]: string;
}

export default function AduanPage() {
  const [data, setData] = useState<AduanItem[]>([]);
  const [filteredData, setFilteredData] = useState<AduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAduan, setSelectedAduan] = useState<AduanItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Ambil data
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAduanData();
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
          item["Isi Aduan"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Kategori?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.Status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, dateRange, statusFilter, data]);

  // Hitung statistik
  const getStatistik = () => {
    const pending = filteredData.filter(
      (item) => item.Status === "pending",
    ).length;
    const diproses = filteredData.filter(
      (item) => item.Status === "diproses",
    ).length;
    const selesai = filteredData.filter(
      (item) => item.Status === "selesai",
    ).length;

    return { pending, diproses, selesai };
  };

  const stat = getStatistik();
  const columns = [
    "Timestamp",
    "Nama",
    "No HP",
    "Kategori",
    "Isi Aduan",
    "Status",
  ];

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Pending
          </span>
        );
      case "diproses":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            -
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Layanan Aduan</h1>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Aduan</CardTitle>
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
            <CardTitle className="text-sm text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stat.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600">Diproses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stat.diproses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stat.selesai}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Cari nama/kategori/aduan..."
          />
          <DateRangePicker onSelect={setDateRange} />
          <StatusFilter
            onFilter={setStatusFilter}
            options={[
              { value: "pending", label: "Pending" },
              { value: "diproses", label: "Diproses" },
              { value: "selesai", label: "Selesai" },
            ]}
            placeholder="Filter Status"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename="data-aduan"
            sheetName="Aduan"
          />
          <ExportPDF
            data={filteredData}
            columns={columns}
            title="Data Layanan Aduan"
            filename="data-aduan"
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
                <TableHead>No HP</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Isi Aduan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell>{item.Nama || "-"}</TableCell>
                  <TableCell>{item["No HP"] || "-"}</TableCell>
                  <TableCell>{item.Kategori || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item["Isi Aduan"]?.substring(0, 50)}
                    {item["Isi Aduan"]?.length > 50 ? "..." : ""}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.Status)}</TableCell>
                  <TableCell>
                    <Dialog
                      open={dialogOpen && selectedAduan === item}
                      onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setSelectedAduan(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAduan(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detail Aduan</DialogTitle>
                          <DialogDescription>
                            Informasi lengkap aduan dari masyarakat
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAduan && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="font-medium">
                                  {selectedAduan.Nama}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">No HP</p>
                                <p className="font-medium">
                                  {selectedAduan["No HP"]}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Kategori
                                </p>
                                <p className="font-medium">
                                  {selectedAduan.Kategori}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">
                                  {getStatusBadge(selectedAduan.Status)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Tanggal</p>
                                <p className="font-medium">
                                  {selectedAduan.Timestamp}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">
                                Isi Aduan
                              </p>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="whitespace-pre-wrap">
                                  {selectedAduan["Isi Aduan"]}
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
