// app/admin/data-survey/page.tsx
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
  ChevronRight,
  Search,
  X,
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
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    if (nilai?.includes("Sangat"))
      return "bg-green-100 text-green-800 border-green-200";
    if (nilai?.includes("Puas") || nilai?.includes("Baik"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (nilai?.includes("Cukup"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (nilai?.includes("Kurang"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (nilai?.includes("Tidak"))
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
    const kurang = filteredData.filter(
      (item) =>
        item.Kepuasan?.includes("Kurang") || item.Kepuasan?.includes("Tidak"),
    ).length;

    return { total, sangatPuas, puas, cukup, kurang };
  };

  const stat = getStatistik();
  const totalKepuasan = stat.total || 1;

  const columns = [
    {
      key: "no",
      header: "No",
      width: 50,
      render: (_: any, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 90,
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs">
            {new Date(item.Timestamp).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "nama",
      header: "Nama",
      width: 120,
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 bg-blue-100 shrink-0">
            <AvatarFallback className="text-blue-600 text-xs">
              {getInitials(item.Nama)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs truncate max-w-[80px]" title={item.Nama}>
            {item.Nama || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "pekerjaan",
      header: "Pekerjaan",
      width: 100,
      sortable: true,
      render: (item: any) => (
        <span className="text-xs truncate" title={item.Pekerjaan}>
          {item.Pekerjaan || "-"}
        </span>
      ),
    },
    {
      key: "jk",
      header: "JK",
      width: 40,
      render: (item: any) => (
        <Badge
          variant="outline"
          className={`text-[10px] px-1 py-0 ${
            item["Jenis Kelamin"] === "Laki-laki"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-pink-50 text-pink-700 border-pink-200"
          }`}
        >
          {item["Jenis Kelamin"] === "Laki-laki" ? "L" : "P"}
        </Badge>
      ),
    },
    {
      key: "usia",
      header: "Usia",
      width: 60,
      render: (item: any) => (
        <span className="text-xs">{item["Rentang Usia"] || "-"}</span>
      ),
    },
    {
      key: "layanan",
      header: "Layanan",
      width: 100,
      render: (item: any) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-1 py-0 truncate max-w-[90px]"
          title={item.Layanan}
        >
          {item.Layanan || "-"}
        </Badge>
      ),
    },
    {
      key: "kepuasan",
      header: "Kepuasan",
      width: 90,
      render: (item: any) => (
        <Badge
          className={`${getBadgeColor(item.Kepuasan)} text-[10px] px-1 py-0`}
        >
          {item.Kepuasan || "-"}
        </Badge>
      ),
    },
    {
      key: "detail",
      header: "",
      width: 40,
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
              className="hover:bg-blue-100 h-6 w-6 p-0"
            >
              <Eye className="h-3 w-3 text-blue-600" />
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
      header: "",
      width: 40,
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
          className="hover:bg-red-100 h-6 w-6 p-0"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </Button>
      ),
    },
  ];

  const totalWidth = columns.reduce(
    (acc, col) => acc + (col.width as number),
    0,
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/dashboard"
          className="text-gray-500 hover:text-gray-700"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-700">Data Survey</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Data Survey Kepuasan
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Total {total} responden telah mengisi survey
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refresh}
              variant="outline"
              className="gap-2 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Total Data</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {stat.total}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Sangat Puas</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {stat.sangatPuas}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.sangatPuas / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Puas</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {stat.puas}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.puas / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Cukup</p>
                <p className="text-xl font-bold text-yellow-600 mt-1">
                  {stat.cukup}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.cukup / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Kurang</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {stat.kurang}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.kurang / totalKepuasan) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border border-gray-200 animate-in slide-in-from-top duration-300">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama/pekerjaan/layanan..."
                    className="pl-9 border-gray-200 h-9 text-sm"
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>
                <DatePicker
                  date={selectedDate}
                  setDate={setSelectedDate}
                  placeholder="Filter tanggal"
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="text-red-600 hover:bg-red-50 h-9 px-2"
                  >
                    <X className="h-4 w-4 mr-1" /> Reset
                  </Button>
                )}
              </div>
              <Button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 h-9"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Total Data */}
      <div className="text-sm text-gray-500">
        Menampilkan {filteredData.length} dari {total} data
      </div>

      {/* Virtual Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <VirtualTable
          data={filteredData}
          columns={columns}
          onRowClick={(item) => {
            setSelectedSurvey(item);
            setDialogOpen(true);
          }}
          initialLoading={initialLoading}
          loading={loading}
          hasMore={hasMore}
          loadMore={loadMore}
          total={total}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          className="border-0"
          rowClassName="hover:bg-blue-50/50 transition-colors cursor-pointer"
          emptyMessage="Tidak ada data survey"
          rowHeight={48}
        />
      </div>

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
