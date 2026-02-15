"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Eye,
  Trash2,
  Filter,
  Calendar,
  Users,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Download,
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/filters/date-picker";
import { VirtualTable } from "@/components/tables/virtual-table";
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { getSurveyDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<SurveyItem[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    index: number;
    nama: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();

  const {
    data: surveyData,
    initialLoading,
    loading,
    hasMore,
    total,
    loadMore,
    refresh,
    removeItem: removeLocalItem,
  } = useInfiniteData({
    fetchFn: (page, limit) => getSurveyDataOptimized(page, limit),
    initialLimit: 50,
    enabled: true,
  });

  useEffect(() => {
    let filtered = [...surveyData];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Layanan?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate.toDateString() === selectedDate.toDateString();
      });
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        let valA = a[sortBy as keyof SurveyItem] || "";
        let valB = b[sortBy as keyof SurveyItem] || "";

        if (sortBy === "Timestamp") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (sortOrder === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDate, surveyData, sortBy, sortOrder]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500),
    [],
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      const result = await deleteData("survey", itemToDelete.index);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Data ${itemToDelete.nama} berhasil dihapus`,
        });

        refresh();
        removeLocalItem(itemToDelete.index);
      } else {
        throw new Error(result.error || "Gagal menghapus");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast({
        title: "Gagal",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const exportToExcel = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey");
      XLSX.writeFile(
        workbook,
        `survey_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`,
      );

      toast({
        title: "Berhasil",
        description: `Data berhasil diexport (${filteredData.length} baris)`,
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Gagal mengexport data",
        variant: "destructive",
      });
    }
  };

  const getBadgeColor = (nilai: string) => {
    if (nilai.includes("Sangat"))
      return "bg-green-100 text-green-800 border-green-200";
    if (nilai.includes("Puas") || nilai.includes("Baik"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (nilai.includes("Cukup"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (nilai.includes("Kurang"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (nilai.includes("Tidak"))
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const getStatistik = () => {
    const total = filteredData.length;
    const sangatPuas = filteredData.filter((item) =>
      item.Kepuasan?.includes("Sangat"),
    ).length;
    const puas = filteredData.filter((item) =>
      item.Kepuasan?.includes("Puas"),
    ).length;
    const cukup = filteredData.filter((item) =>
      item.Kepuasan?.includes("Cukup"),
    ).length;
    const kurang = filteredData.filter((item) =>
      item.Kepuasan?.includes("Kurang"),
    ).length;

    return { total, sangatPuas, puas, cukup, kurang };
  };

  const stat = getStatistik();
  const totalKepuasan = stat.total || 1;

  const columns = [
    {
      key: "no",
      header: "No",
      width: 60,
      render: (_: any, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 100,
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {new Date(item.Timestamp).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      key: "nama",
      header: "Nama",
      width: 150,
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 bg-blue-100 flex-shrink-0">
            <AvatarFallback className="text-blue-600 font-semibold">
              {getInitials(item.Nama)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium truncate">{item.Nama || "-"}</span>
        </div>
      ),
    },
    {
      key: "pekerjaan",
      header: "Pekerjaan",
      width: 120,
      sortable: true,
      render: (item: any) => item.Pekerjaan || "-",
    },
    {
      key: "jk",
      header: "JK",
      width: 50,
      render: (item: any) => (
        <Badge
          variant="outline"
          className={
            item["Jenis Kelamin"] === "Laki-laki"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-pink-50 text-pink-700 border-pink-200"
          }
        >
          {item["Jenis Kelamin"] === "Laki-laki" ? "L" : "P"}
        </Badge>
      ),
    },
    {
      key: "usia",
      header: "Usia",
      width: 80,
      render: (item: any) => item["Rentang Usia"] || "-",
    },
    {
      key: "layanan",
      header: "Layanan",
      width: 120,
      render: (item: any) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          {item.Layanan?.substring(0, 15) || "-"}
        </Badge>
      ),
    },
    {
      key: "kepuasan",
      header: "Kepuasan",
      width: 100,
      render: (item: any) => (
        <Badge className={getBadgeColor(item.Kepuasan)}>
          {item.Kepuasan || "-"}
        </Badge>
      ),
    },
    {
      key: "detail",
      header: "Detail",
      width: 60,
      render: (item: any) => (
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
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSurvey(item);
              }}
              className="hover:bg-blue-100"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Avatar className="w-10 h-10 bg-blue-100">
                  <AvatarFallback className="text-blue-600">
                    {getInitials(item.Nama)}
                  </AvatarFallback>
                </Avatar>
                Detail Survey - {item.Nama}
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap survey kepuasan
              </DialogDescription>
            </DialogHeader>
            {selectedSurvey && (
              <Tabs defaultValue="identitas" className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="identitas">Identitas</TabsTrigger>
                  <TabsTrigger value="layanan">Layanan</TabsTrigger>
                  <TabsTrigger value="petugas">Petugas</TabsTrigger>
                  <TabsTrigger value="pengaduan">Pengaduan</TabsTrigger>
                  <TabsTrigger value="sarana">Sarana</TabsTrigger>
                </TabsList>

                <TabsContent value="identitas" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey.Timestamp}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Nama</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey.Nama}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Pekerjaan</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey.Pekerjaan}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey["Jenis Kelamin"]}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Rentang Usia</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey["Rentang Usia"]}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Layanan</p>
                      <p className="font-medium bg-gray-50 p-2 rounded">
                        {selectedSurvey.Layanan}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layanan" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Persyaratan",
                        value: selectedSurvey.Persyaratan,
                      },
                      { label: "Prosedur", value: selectedSurvey.Prosedur },
                      {
                        label: "Waktu Proses Berkas",
                        value: selectedSurvey["Waktu Proses Berkas"],
                      },
                      {
                        label: "Waktu Selesai Aduan",
                        value: selectedSurvey["Waktu Selesai Aduan"],
                      },
                      {
                        label: "Waktu Aduan Online",
                        value: selectedSurvey["Waktu Aduan Online"],
                      },
                      {
                        label: "Waktu Respon Online",
                        value: selectedSurvey["Waktu Respon Online"],
                      },
                      { label: "Biaya", value: selectedSurvey.Biaya },
                      {
                        label: "Kesesuaian Hasil",
                        value: selectedSurvey.Kesesuaian,
                      },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm text-gray-500">{field.label}</p>
                        <Badge className={getBadgeColor(field.value)}>
                          {field.value || "-"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="petugas" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Penguasaan", value: selectedSurvey.Penguasaan },
                      { label: "Komunikasi", value: selectedSurvey.Komunikasi },
                      {
                        label: "Komunikasi Online",
                        value: selectedSurvey["Komunikasi Online"],
                      },
                      { label: "Sikap", value: selectedSurvey.Sikap },
                      { label: "Kerapian", value: selectedSurvey.Kerapian },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm text-gray-500">{field.label}</p>
                        <Badge className={getBadgeColor(field.value)}>
                          {field.value || "-"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pengaduan" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Keberadaan Pengaduan",
                        value: selectedSurvey["Keberadaan Pengaduan"],
                      },
                      {
                        label: "Tata Cara",
                        value: selectedSurvey["Tata Cara Pengaduan"],
                      },
                      {
                        label: "Pengaduan Online",
                        value: selectedSurvey["Pengaduan Online"],
                      },
                      {
                        label: "Keberlanjutan",
                        value: selectedSurvey.Keberlanjutan,
                      },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm text-gray-500">{field.label}</p>
                        <Badge className={getBadgeColor(field.value)}>
                          {field.value || "-"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sarana" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Kelengkapan Sarana",
                        value: selectedSurvey["Sarana Kelengkapan"],
                      },
                      {
                        label: "Kelayakan Sarana",
                        value: selectedSurvey["Sarana Kelayakan"],
                      },
                      {
                        label: "Sarana Toilet",
                        value: selectedSurvey["Sarana Toilet"],
                      },
                      { label: "Kebersihan", value: selectedSurvey.Kebersihan },
                      {
                        label: "Front Officer",
                        value: selectedSurvey["Front Officer"],
                      },
                      {
                        label: "Ketersediaan Info",
                        value: selectedSurvey["Ketersediaan Informasi"],
                      },
                      {
                        label: "Kemanfaatan Online",
                        value: selectedSurvey["Kemanfaatan Online"],
                      },
                      { label: "Kepuasan", value: selectedSurvey.Kepuasan },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm text-gray-500">{field.label}</p>
                        <Badge className={getBadgeColor(field.value)}>
                          {field.value || "-"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      width: 60,
      render: (item: any, index: number) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setItemToDelete({
              index,
              nama: item.Nama || "Unnamed",
            });
            setDeleteDialogOpen(true);
          }}
          className="hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Data Survey Kepuasan
            </h1>
            <p className="text-blue-100 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total {total} responden telah mengisi survey
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refresh}
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 border-0 gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 border-0 gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Data</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stat.total}
                </p>
                <p className="text-xs text-gray-400 mt-1">dari {total} total</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sangat Puas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stat.sangatPuas}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stat.sangatPuas / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Puas</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stat.puas}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stat.puas / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cukup</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {stat.cukup}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stat.cukup / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Kurang</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stat.kurang}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stat.kurang / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      {showFilters && (
        <Card className="border-0 shadow-lg animate-in slide-in-from-top duration-300">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="Cari nama/pekerjaan/layanan..."
                  className="w-[300px]"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <DatePicker
                  date={selectedDate}
                  setDate={setSelectedDate}
                  placeholder="Filter berdasarkan tanggal"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Virtual Table */}
      <VirtualTable
        data={filteredData}
        columns={columns}
        onRowClick={(item) => setSelectedSurvey(item)}
        initialLoading={initialLoading}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        className="border-0 shadow-lg"
        rowClassName="hover:bg-blue-50/50 transition-colors"
        emptyMessage="Tidak ada data"
        rowHeight={60}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Konfirmasi Hapus
            </AlertDialogTitle>
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
