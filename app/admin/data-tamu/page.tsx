"use client";

import { useState, useEffect } from "react";
import { getTamuDataPaginated } from "@/lib/apps-script";
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

interface TamuItem {
  Timestamp: string;
  Nama: string;
  "Jenis Kelamin": string;
  "Rentang Usia": string;
  "No HP": string;
  Instansi: string;
  Jabatan: string;
  Alamat: string;
  "Bidang Dituju": string;
  Tujuan: string;
}

export default function TamuPage() {
  const [data, setData] = useState<TamuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [filteredData, setFilteredData] = useState<TamuItem[]>([]);
  const [selectedTamu, setSelectedTamu] = useState<TamuItem | null>(null);
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
      const result = await getTamuDataPaginated(page, limit);
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
          item["Bidang Dituju"]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.Tujuan?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, dateRange, data]);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      console.log("🗑️ Menghapus data:", {
        sheetName: "tamu", // GANTI SESUAI HALAMAN
        rowIndex: (page - 1) * limit + itemToDelete.index,
      });

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          sheetName: "tamu", // GANTI SESUAI HALAMAN
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
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const hariIni = filteredData.filter(
      (item) => new Date(item.Timestamp || "").toDateString() === today,
    ).length;
    const mingguIni = filteredData.filter(
      (item) => new Date(item.Timestamp || "") >= weekAgo,
    ).length;
    return { total, hariIni, mingguIni };
  };

  const stat = getStatistik();

  if (loading) return <LoadingTable />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data Buku Tamu Digital</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total {totalData} kunjungan tercatat
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Total Kunjungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stat.total}</p>
            <p className="text-xs text-gray-500">Dari {totalData} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stat.hariIni}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-600">
              Minggu Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {stat.mingguIni}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Cari nama/instansi/bidang/tujuan..."
          />
          <DateRangePicker onSelect={setDateRange} />
        </div>
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename={`data-tamu-halaman-${page}`}
            sheetName="Buku Tamu"
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
                <TableHead>JK</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>No HP</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Tujuan</TableHead>
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
                    <TableCell>{item["Jenis Kelamin"] || "-"}</TableCell>
                    <TableCell>{item["Rentang Usia"] || "-"}</TableCell>
                    <TableCell>{item["No HP"] || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Instansi || "-"}
                    </TableCell>
                    <TableCell>{item.Jabatan || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Alamat || "-"}
                    </TableCell>
                    <TableCell>{item["Bidang Dituju"] || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Tujuan || "-"}
                    </TableCell>
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
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Detail Kunjungan - {item.Nama}
                            </DialogTitle>
                            <DialogDescription>
                              Informasi lengkap tamu
                            </DialogDescription>
                          </DialogHeader>
                          {selectedTamu && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                  <p className="text-sm text-gray-500">Nama</p>
                                  <p className="font-medium">
                                    {selectedTamu.Nama}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Jenis Kelamin
                                  </p>
                                  <p className="font-medium">
                                    {selectedTamu["Jenis Kelamin"]}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Rentang Usia
                                  </p>
                                  <p className="font-medium">
                                    {selectedTamu["Rentang Usia"]}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">No HP</p>
                                  <p className="font-medium">
                                    {selectedTamu["No HP"]}
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
                                    Jabatan
                                  </p>
                                  <p className="font-medium">
                                    {selectedTamu.Jabatan}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-gray-500">
                                    Alamat
                                  </p>
                                  <p className="font-medium">
                                    {selectedTamu.Alamat}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Bidang Dituju
                                  </p>
                                  <p className="font-medium">
                                    {selectedTamu["Bidang Dituju"]}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-gray-500">
                                    Tujuan
                                  </p>
                                  <p className="font-medium whitespace-pre-wrap">
                                    {selectedTamu.Tujuan}
                                  </p>
                                </div>
                                <div className="col-span-2">
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
              Apakah Anda yakin ingin menghapus data tamu{" "}
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
