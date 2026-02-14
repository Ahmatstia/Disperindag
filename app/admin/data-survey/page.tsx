"use client";

import { useState, useEffect } from "react";
import { getSurveyDataPaginated } from "@/lib/apps-script";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SurveyItem {
  Timestamp: string;
  Nama: string;
  Pekerjaan: string;
  "Jenis Kelamin": string;
  "Rentang Usia": string;
  Layanan: string;
  Persyaratan: string;
  Prosedur: string;
  "Waktu Proses Berkas": string;
  "Waktu Selesai Aduan": string;
  "Waktu Aduan Online": string;
  "Waktu Respon Online": string;
  Biaya: string;
  Kesesuaian: string;
  Penguasaan: string;
  Komunikasi: string;
  "Komunikasi Online": string;
  Sikap: string;
  Kerapian: string;
  "Keberadaan Pengaduan": string;
  "Tata Cara Pengaduan": string;
  "Pengaduan Online": string;
  Keberlanjutan: string;
  "Sarana Kelengkapan": string;
  "Sarana Kelayakan": string;
  "Sarana Toilet": string;
  Kebersihan: string;
  "Front Officer": string;
  "Ketersediaan Informasi": string;
  "Kemanfaatan Online": string;
  Kepuasan: string;
}

export default function SurveyPage() {
  const [data, setData] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [filteredData, setFilteredData] = useState<SurveyItem[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyItem | null>(null);
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
      const result = await getSurveyDataPaginated(page, limit);
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
          item.Pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Layanan?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        sheetName: "survey", // GANTI SESUAI HALAMAN
        rowIndex: (page - 1) * limit + itemToDelete.index,
      });

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          sheetName: "survey", // GANTI SESUAI HALAMAN
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

  const getBadgeColor = (nilai: string) => {
    if (nilai.includes("Sangat")) return "bg-green-100 text-green-800";
    if (nilai.includes("Puas") || nilai.includes("Baik"))
      return "bg-blue-100 text-blue-800";
    if (nilai.includes("Cukup")) return "bg-yellow-100 text-yellow-800";
    if (nilai.includes("Kurang")) return "bg-orange-100 text-orange-800";
    if (nilai.includes("Tidak")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) return <LoadingTable />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data Survey Kepuasan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total {totalData} responden
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {filteredData.length}
            </p>
            <p className="text-xs text-gray-500">Dari {totalData} total</p>
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
              {(
                filteredData.reduce((acc, item) => {
                  const nilai = item.Kepuasan?.includes("Sangat")
                    ? 5
                    : item.Kepuasan?.includes("Puas")
                      ? 4
                      : item.Kepuasan?.includes("Cukup")
                        ? 3
                        : item.Kepuasan?.includes("Kurang")
                          ? 2
                          : 1;
                  return acc + (item.Kepuasan ? nilai : 0);
                }, 0) / (filteredData.filter((i) => i.Kepuasan).length || 1)
              ).toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">Skala 1-5</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Cari nama/pekerjaan/layanan..."
          />
          <DateRangePicker onSelect={setDateRange} />
        </div>
        <div className="flex gap-2">
          <ExportExcel
            data={filteredData}
            filename={`data-survey-halaman-${page}`}
            sheetName="Survey"
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
                <TableHead>JK</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Persyaratan</TableHead>
                <TableHead>Prosedur</TableHead>
                <TableHead>Kepuasan</TableHead>
                <TableHead className="w-20">Detail</TableHead>
                <TableHead className="w-20">Hapus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>{item.Timestamp || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {item.Nama || "-"}
                    </TableCell>
                    <TableCell>{item.Pekerjaan || "-"}</TableCell>
                    <TableCell>{item["Jenis Kelamin"] || "-"}</TableCell>
                    <TableCell>{item["Rentang Usia"] || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Layanan || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Persyaratan || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.Prosedur || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(item.Kepuasan)}>
                        {item.Kepuasan || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={dialogOpen && selectedSurvey === item}
                        onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setSelectedSurvey(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSurvey(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Detail Survey - {item.Nama}
                            </DialogTitle>
                            <DialogDescription>
                              Informasi lengkap survey kepuasan
                            </DialogDescription>
                          </DialogHeader>
                          {selectedSurvey && (
                            <Tabs defaultValue="identitas" className="w-full">
                              <TabsList className="grid grid-cols-5 mb-4">
                                <TabsTrigger value="identitas">
                                  Identitas
                                </TabsTrigger>
                                <TabsTrigger value="layanan">
                                  Layanan
                                </TabsTrigger>
                                <TabsTrigger value="petugas">
                                  Petugas
                                </TabsTrigger>
                                <TabsTrigger value="pengaduan">
                                  Pengaduan
                                </TabsTrigger>
                                <TabsTrigger value="sarana">Sarana</TabsTrigger>
                              </TabsList>

                              <TabsContent
                                value="identitas"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Timestamp
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey.Timestamp}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Nama
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey.Nama}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Pekerjaan
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey.Pekerjaan}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Jenis Kelamin
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey["Jenis Kelamin"]}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Rentang Usia
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey["Rentang Usia"]}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Layanan
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey.Layanan}
                                    </p>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value="layanan"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Persyaratan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Persyaratan,
                                      )}
                                    >
                                      {selectedSurvey.Persyaratan}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Prosedur
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Prosedur,
                                      )}
                                    >
                                      {selectedSurvey.Prosedur}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Waktu Proses
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Waktu Proses Berkas"],
                                      )}
                                    >
                                      {selectedSurvey["Waktu Proses Berkas"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Waktu Selesai Aduan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Waktu Selesai Aduan"],
                                      )}
                                    >
                                      {selectedSurvey["Waktu Selesai Aduan"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Waktu Aduan Online
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Waktu Aduan Online"],
                                      )}
                                    >
                                      {selectedSurvey["Waktu Aduan Online"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Waktu Respon Online
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Waktu Respon Online"],
                                      )}
                                    >
                                      {selectedSurvey["Waktu Respon Online"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Biaya
                                    </p>
                                    <p className="font-medium">
                                      {selectedSurvey.Biaya}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kesesuaian Hasil
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Kesesuaian,
                                      )}
                                    >
                                      {selectedSurvey.Kesesuaian}
                                    </Badge>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value="petugas"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Penguasaan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Penguasaan,
                                      )}
                                    >
                                      {selectedSurvey.Penguasaan}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Komunikasi
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Komunikasi,
                                      )}
                                    >
                                      {selectedSurvey.Komunikasi}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Komunikasi Online
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Komunikasi Online"],
                                      )}
                                    >
                                      {selectedSurvey["Komunikasi Online"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Sikap
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Sikap,
                                      )}
                                    >
                                      {selectedSurvey.Sikap}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kerapian
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Kerapian,
                                      )}
                                    >
                                      {selectedSurvey.Kerapian}
                                    </Badge>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value="pengaduan"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Keberadaan Pengaduan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Keberadaan Pengaduan"],
                                      )}
                                    >
                                      {selectedSurvey["Keberadaan Pengaduan"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Tata Cara
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Tata Cara Pengaduan"],
                                      )}
                                    >
                                      {selectedSurvey["Tata Cara Pengaduan"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Pengaduan Online
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Pengaduan Online"],
                                      )}
                                    >
                                      {selectedSurvey["Pengaduan Online"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Keberlanjutan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Keberlanjutan,
                                      )}
                                    >
                                      {selectedSurvey.Keberlanjutan}
                                    </Badge>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="sarana" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kelengkapan Sarana
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Sarana Kelengkapan"],
                                      )}
                                    >
                                      {selectedSurvey["Sarana Kelengkapan"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kelayakan Sarana
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Sarana Kelayakan"],
                                      )}
                                    >
                                      {selectedSurvey["Sarana Kelayakan"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Sarana Toilet
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Sarana Toilet"],
                                      )}
                                    >
                                      {selectedSurvey["Sarana Toilet"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kebersihan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Kebersihan,
                                      )}
                                    >
                                      {selectedSurvey.Kebersihan}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Front Officer
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Front Officer"],
                                      )}
                                    >
                                      {selectedSurvey["Front Officer"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Ketersediaan Info
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey[
                                          "Ketersediaan Informasi"
                                        ],
                                      )}
                                    >
                                      {selectedSurvey["Ketersediaan Informasi"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kemanfaatan Online
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey["Kemanfaatan Online"],
                                      )}
                                    >
                                      {selectedSurvey["Kemanfaatan Online"]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Kepuasan
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedSurvey.Kepuasan,
                                      )}
                                    >
                                      {selectedSurvey.Kepuasan}
                                    </Badge>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
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
              Apakah Anda yakin ingin menghapus data{" "}
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
