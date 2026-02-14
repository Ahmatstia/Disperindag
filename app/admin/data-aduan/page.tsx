"use client";

import { useState, useEffect } from "react";
import { getAduanDataPaginated } from "@/lib/apps-script";
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
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from "lucide-react";
import { LoadingTable } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AduanItem {
  Timestamp: string;
  Nama: string;
  Pekerjaan: string;
  Instansi: string;
  "Jenis Kelamin": string;
  "Rentang Usia": string;
  "Hal Peristiwa": string;
  "Lokasi Peristiwa": string;
  "Tanggal Kejadian": string;
  "Tindak Lanjut": string;
  Status: string;
}

export default function AduanPage() {
  const [data, setData] = useState<AduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState<AduanItem[]>([]);
  const [selectedAduan, setSelectedAduan] = useState<AduanItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    index: number;
    nama: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { toast } = useToast();
  const limit = 50;

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAduanDataPaginated(page, limit);
      setData(result.data);
      setFilteredData(result.data);
      setTotalPages(result.totalPages);
      setTotalData(result.total);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Instansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item["Hal Peristiwa"]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.Status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, dateRange, statusFilter, data]);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      console.log("🗑️ Menghapus data:", {
        sheetName: "aduan", // GANTI SESUAI HALAMAN
        rowIndex: (page - 1) * limit + itemToDelete.index,
      });

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          sheetName: "aduan", // GANTI SESUAI HALAMAN
          rowIndex: (page - 1) * limit + itemToDelete.index,
        }),
      });

      const text = await response.text();
      console.log("📥 Response text:", text);

      if (!text || text.trim() === "") {
        throw new Error("Response kosong dari server");
      }

      // Parse JSON
      try {
        const result = JSON.parse(text);
        console.log("✅ Result (JSON):", result);

        if (result.success) {
          toast({
            title: "Berhasil",
            description: `Data ${itemToDelete.nama} berhasil dihapus`,
          });
          await fetchData();
        } else {
          throw new Error(result.error || "Gagal menghapus");
        }
      } catch (jsonError) {
        // Fallback ke JSONP
        const jsonMatch = text.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
        if (jsonMatch && jsonMatch.length >= 3) {
          const result = JSON.parse(jsonMatch[2]);
          if (result.success) {
            toast({
              title: "Berhasil",
              description: `Data ${itemToDelete.nama} berhasil dihapus`,
            });
            await fetchData();
          } else {
            throw new Error(result.error || "Gagal menghapus");
          }
        } else {
          throw new Error("Format response tidak dikenal");
        }
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast({
        title: "Gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getStatistik = () => {
    const total = filteredData.length;
    const pending = filteredData.filter(
      (item) => item.Status === "pending",
    ).length;
    const diproses = filteredData.filter(
      (item) => item.Status === "diproses",
    ).length;
    const selesai = filteredData.filter(
      (item) => item.Status === "selesai",
    ).length;
    return { total, pending, diproses, selesai };
  };

  const stat = getStatistik();

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "diproses":
        return <Badge className="bg-blue-100 text-blue-800">Diproses</Badge>;
      case "selesai":
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
    }
  };

  if (loading) return <LoadingTable />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data Layanan Aduan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total {totalData} aduan masuk
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Aduan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stat.total}</p>
            <p className="text-xs text-gray-500">Dari {totalData} total</p>
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

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Cari nama/instansi/aduan..."
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
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename={`data-aduan-halaman-${page}`}
            sheetName="Aduan"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>JK</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Peristiwa</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tgl Kejadian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Detail</TableHead>
                <TableHead className="w-20">Hapus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item.Timestamp || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {item.Nama || "-"}
                    </TableCell>
                    <TableCell>{item.Pekerjaan || "-"}</TableCell>
                    <TableCell>{item.Instansi || "-"}</TableCell>
                    <TableCell>{item["Jenis Kelamin"] || "-"}</TableCell>
                    <TableCell>{item["Rentang Usia"] || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item["Hal Peristiwa"]?.substring(0, 30)}...
                    </TableCell>
                    <TableCell>{item["Lokasi Peristiwa"] || "-"}</TableCell>
                    <TableCell>{item["Tanggal Kejadian"] || "-"}</TableCell>
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
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Detail Aduan - {item.Nama}
                            </DialogTitle>
                            <DialogDescription>
                              Informasi lengkap aduan masyarakat
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAduan && (
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                  Identitas Pelapor
                                </h3>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Nama
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan.Nama}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Pekerjaan
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan.Pekerjaan}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Instansi
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan.Instansi}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Jenis Kelamin
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan["Jenis Kelamin"]}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Rentang Usia
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan["Rentang Usia"]}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Timestamp
                                    </p>
                                    <p className="font-medium">
                                      {selectedAduan.Timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                  Detail Aduan
                                </h3>
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                      Hal/Peristiwa
                                    </p>
                                    <div className="bg-white p-3 rounded border">
                                      {selectedAduan["Hal Peristiwa"]}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Lokasi Peristiwa
                                      </p>
                                      <p className="font-medium">
                                        {selectedAduan["Lokasi Peristiwa"]}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Tanggal Kejadian
                                      </p>
                                      <p className="font-medium">
                                        {selectedAduan["Tanggal Kejadian"]}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                      Tindak Lanjut
                                    </p>
                                    <div className="bg-white p-3 rounded border">
                                      {selectedAduan["Tindak Lanjut"]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setItemToDelete({
                            index,
                            nama: item.Nama || "Unnamed",
                          });
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Menampilkan halaman {page} dari {totalPages} • Total {totalData} data
        </p>
        <div className="flex gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Sebelumnya
          </Button>
          <div className="hidden md:flex gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum = page;
              if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Button
                    key={i}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              }
              return null;
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="gap-2"
          >
            Selanjutnya <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data aduan dari{" "}
              <span className="font-semibold">{itemToDelete?.nama}</span>?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
