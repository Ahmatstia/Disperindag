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
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
  "Tata Cara Pengaduan (2)": string;
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
  [key: string]: string | undefined;
}

export default function SurveyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<SurveyItem[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    originalIndex: number;
    sheetName: string;
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
  } = useInfiniteData<SurveyItem>({
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
        let valA: string | number = a[sortBy as keyof SurveyItem] || "";
        let valB: string | number = b[sortBy as keyof SurveyItem] || "";

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
      const result = await deleteData("survey", itemToDelete.originalIndex, itemToDelete.sheetName);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Data survey ${itemToDelete.nama} berhasil dihapus`,
        });

        refresh();
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
    } catch {
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
      render: (_: SurveyItem, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 90,
      sortable: true,
      render: (item: SurveyItem) => (
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
      render: (item: SurveyItem) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 bg-blue-100 shrink-0">
            <AvatarFallback className="text-[#c9973a] text-xs">
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
      render: (item: SurveyItem) => (
        <span className="text-xs truncate" title={item.Pekerjaan}>
          {item.Pekerjaan || "-"}
        </span>
      ),
    },
    {
      key: "jk",
      header: "JK",
      width: 40,
      render: (item: SurveyItem) => (
        <Badge
          variant="outline"
          className={`text-[10px] px-1 py-0 ${
            item["Jenis Kelamin"] === "Laki-laki"
              ? "bg-[#c9973a]/10 text-blue-700 border-blue-200"
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
      render: (item: SurveyItem) => (
        <span className="text-xs">{item["Rentang Usia"] || "-"}</span>
      ),
    },
    {
      key: "layanan",
      header: "Layanan",
      width: 100,
      render: (item: SurveyItem) => (
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
      render: (item: SurveyItem) => (
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
      render: (item: SurveyItem) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSurvey(item);
            setDialogOpen(true);
          }}
          className="hover:bg-indigo-100 h-6 w-6 p-0"
        >
          <Eye className="h-3 w-3 text-indigo-600" />
        </Button>
      ),
    },
    {
      key: "aksi",
      header: "",
      width: 40,
      render: (item: SurveyItem) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setItemToDelete({
              originalIndex: item.originalIndex as unknown as number,
              sheetName: item.sheetName as string,
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

      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 to-blue-800 p-8 rounded-3xl shadow-xl shadow-indigo-100">
        {/* Dekorasi Cahaya */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-indigo-400/20 text-indigo-100 hover:bg-indigo-400/30 border-none shadow-none font-bold text-[10px] tracking-widest uppercase">
                Sistem Analitik
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              DATA HASIL <span className="text-indigo-200">SURVEI</span>
            </h1>
            <p className="text-indigo-100/60 text-xs font-medium mt-1 flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              Monitoring {total || 0} responden untuk peningkatan kualitas layanan
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md transition-all gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> 
              Segarkan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md transition-all gap-2",
                showFilters && "bg-white/30 border-white/40"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Saring
            </Button>
            <Button
              onClick={exportToExcel}
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-400 text-white border-none shadow-lg shadow-indigo-900/20 gap-2"
            >
              <Download className="h-4 w-4" />
              Ekspor Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
            { label: "Total Responden", value: stat.total, icon: BarChart3, color: "#6366f1", sub: "Total data" },
            { label: "Sangat Puas", value: stat.sangatPuas, icon: CheckCircle2, color: "#10b981", sub: `${Math.round((stat.sangatPuas / totalKepuasan) * 100)}% dari total` },
            { label: "Puas", value: stat.puas, icon: Star, color: "#3b82f6", sub: `${Math.round((stat.puas / totalKepuasan) * 100)}% dari total` },
            { label: "Cukup", value: stat.cukup, icon: TrendingUp, color: "#eab308", sub: `${Math.round((stat.cukup / totalKepuasan) * 100)}% dari total` },
            { label: "Kurang", value: stat.kurang, icon: AlertCircle, color: "#f43f5e", sub: `${Math.round((stat.kurang / totalKepuasan) * 100)}% dari total` }
        ].map((item, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group relative">
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-70" 
                style={{ backgroundColor: item.color }}
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-3xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">
                      {item.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                       <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                         {item.sub}
                       </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border-none shadow-md bg-white animate-in slide-in-from-top-4 duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500 w-full" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama, pekerjaan, atau jenis layanan..."
                    className="pl-10 border-gray-100 bg-gray-50/50 h-11 text-sm rounded-xl focus-visible:ring-indigo-500"
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                      placeholder="Pilih tanggal"
                    />
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(null)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Section */}
      <div className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                 Database Hasil Survei
              </span>
           </div>
           <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-200">
              {filteredData.length} RESPONDEN
           </Badge>
        </div>
        <VirtualTable
          data={filteredData}
          columns={columns}
          onRowClick={(item) => {
            setSelectedSurvey(item as unknown as SurveyItem);
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
          rowClassName="hover:bg-indigo-50/30 transition-colors cursor-pointer border-b border-gray-50/50"
          emptyMessage="Tidak ada catatan survei ditemukan"
          rowHeight={56}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedSurvey(null);
        }}
      >
        <DialogContent className="max-w-4xl border-none p-0 overflow-hidden rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
          {selectedSurvey && (
            <div className="flex flex-col">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl bg-white/10">
                    <AvatarFallback className="text-2xl font-black text-white">
                      {selectedSurvey.Nama ? getInitials(selectedSurvey.Nama) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <DialogTitle asChild>
                      <h2 className="text-2xl font-black tracking-tight uppercase italic mb-1">
                        {selectedSurvey.Nama || "Responden Anonim"}
                      </h2>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Detail respon survei untuk {selectedSurvey.Nama || "Anonim"}
                    </DialogDescription>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5">
                        {selectedSurvey.Pekerjaan || "Umum"}
                      </Badge>
                      <Badge className={cn(
                        "border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5 shadow-sm",
                        getBadgeColor(selectedSurvey.Kepuasan)
                      )}>
                        {selectedSurvey.Kepuasan?.toUpperCase() || "PENDING"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Content */}
              <div className="p-0 bg-white flex-1 overflow-y-auto custom-scrollbar">
                <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                   <div className="px-8 pt-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <TabsList className="bg-transparent gap-6 h-12">
                        {[
                          { id: "overview", label: "Ringkasan" },
                          { id: "layanan", label: "Layanan" },
                          { id: "petugas", label: "Petugas" },
                          { id: "pengaduan", label: "Pengaduan" },
                          { id: "sarana", label: "Sarana" },
                        ].map((tab) => (
                          <TabsTrigger 
                            key={tab.id}
                            value={tab.id} 
                            className="bg-transparent border-none shadow-none text-[10px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent relative h-full rounded-none px-0"
                          >
                            {tab.label}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 scale-x-0 data-[state=active]:scale-x-100 transition-transform" />
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <Calendar className="w-3 h-3" />
                         {selectedSurvey.Timestamp}
                      </div>
                   </div>

                   <div className="p-8">
                      <TabsContent value="overview" className="mt-0">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                               <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Profil</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jenis Kelamin</p>
                                      <p className="text-xs font-black text-gray-800">{selectedSurvey["Jenis Kelamin"] || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rentang Usia</p>
                                      <p className="text-xs font-black text-gray-800">{selectedSurvey["Rentang Usia"] || "-"}</p>
                                    </div>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Layanan Tujuan</span>
                                  </div>
                                  <p className="text-sm font-black text-indigo-700 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                    {selectedSurvey.Layanan}
                                  </p>
                               </div>
                            </div>
                            
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                               <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Kepuasan Global</span>
                               </div>
                               <div className="pt-4 text-center">
                                  <div className={cn(
                                    "inline-block px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg",
                                    getBadgeColor(selectedSurvey.Kepuasan)
                                  )}>
                                     {selectedSurvey.Kepuasan}
                                  </div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
                                     Responden mencerminkan perasaan umum <br/> 
                                     <span className="text-indigo-600">&quot;{selectedSurvey.Kepuasan}&quot;</span> mengenai layanan Disperindag.
                                  </p>
                               </div>
                            </div>
                         </div>
                      </TabsContent>

                      <TabsContent value="layanan" className="mt-0">
                         <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                            {[
                               { label: "Persyaratan Pelayanan", value: selectedSurvey.Persyaratan },
                               { label: "Sistem, Mekanisme, dan Prosedur", value: selectedSurvey.Prosedur },
                               { label: "Waktu Proses Berkas", value: selectedSurvey["Waktu Proses Berkas"] },
                               { label: "Waktu Selesai Pengaduan", value: selectedSurvey["Waktu Selesai Aduan"] },
                               { label: "Kecepatan Aduan Online", value: selectedSurvey["Waktu Aduan Online"] },
                               { label: "Respon Petugas Online", value: selectedSurvey["Waktu Respon Online"] },
                               { label: "Biaya / Tarif", value: selectedSurvey.Biaya },
                               { label: "Kesesuaian Produk Layanan", value: selectedSurvey.Kesesuaian },
                            ].map((item, i) => (
                              <div key={i} className={cn(
                                "flex items-center justify-between p-4 transition-colors",
                                i !== 7 && "border-b border-gray-100"
                              )}>
                                <span className="text-xs font-bold text-gray-600 pr-4">{item.label}</span>
                                <div className={cn(
                                  "text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm",
                                  getBadgeColor(item.value)
                                )}>
                                  {item.value}
                                </div>
                              </div>
                            ))}
                         </div>
                      </TabsContent>

                      <TabsContent value="petugas" className="mt-0">
                         <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                            {[
                               { label: "Penguasaan Pengetahuan Petugas", value: selectedSurvey.Penguasaan },
                               { label: "Kemampuan Komunikasi Petugas", value: selectedSurvey.Komunikasi },
                               { label: "Respon Komunikasi Online", value: selectedSurvey["Komunikasi Online"] },
                               { label: "Sikap dan Perilaku Petugas", value: selectedSurvey.Sikap },
                               { label: "Kerapian Atribut dan Pakaian", value: selectedSurvey.Kerapian },
                            ].map((item, i) => (
                              <div key={i} className={cn(
                                "flex items-center justify-between p-4 transition-colors",
                                i !== 4 && "border-b border-gray-100"
                              )}>
                                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                                <div className={cn(
                                  "text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm",
                                  getBadgeColor(item.value)
                                )}>
                                  {item.value}
                                </div>
                              </div>
                            ))}
                         </div>
                      </TabsContent>

                      <TabsContent value="pengaduan" className="mt-0">
                         <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                            {[
                               { label: "Keberadaan Media Pengaduan", value: selectedSurvey["Keberadaan Pengaduan"] },
                               { label: "Kejelasan Tata Cara Pengaduan", value: selectedSurvey["Tata Cara Pengaduan"] },
                               { label: "Kemudahan Tata Cara Pengaduan", value: selectedSurvey["Tata Cara Pengaduan (2)"] },
                               { label: "Keaktifan Pengaduan Online", value: selectedSurvey["Pengaduan Online"] },
                               { label: "Keberlanjutan Tindak Lanjut", value: selectedSurvey.Keberlanjutan },
                            ].map((item, i) => (
                              <div key={i} className={cn(
                                "flex items-center justify-between p-4 transition-colors",
                                i !== 4 && "border-b border-gray-100"
                              )}>
                                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                                <div className={cn(
                                  "text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm",
                                  getBadgeColor(item.value)
                                )}>
                                  {item.value}
                                </div>
                              </div>
                            ))}
                         </div>
                      </TabsContent>

                      <TabsContent value="sarana" className="mt-0">
                         <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                            {[
                               { label: "Sarana Kelengkapan Fasilitas", value: selectedSurvey["Sarana Kelengkapan"] },
                               { label: "Sarana Kelayakan Fasilitas", value: selectedSurvey["Sarana Kelayakan"] },
                               { label: "Kebersihan Sarana Toilet", value: selectedSurvey["Sarana Toilet"] },
                               { label: "Kebersihan Lingkungan Kantor", value: selectedSurvey.Kebersihan },
                               { label: "Sikap Front Officer", value: selectedSurvey["Front Officer"] },
                               { label: "Ketersediaan Media Informasi", value: selectedSurvey["Ketersediaan Informasi"] },
                               { label: "Kemanfaatan Media Online", value: selectedSurvey["Kemanfaatan Online"] },
                            ].map((item, i) => (
                              <div key={i} className={cn(
                                "flex items-center justify-between p-4 transition-colors",
                                i !== 6 && "border-b border-gray-100"
                              )}>
                                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                                <div className={cn(
                                  "text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm",
                                  getBadgeColor(item.value)
                                )}>
                                  {item.value}
                                </div>
                              </div>
                            ))}
                         </div>
                      </TabsContent>
                   </div>
                </Tabs>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                <Button 
                  onClick={() => setDialogOpen(false)}
                  variant="ghost" 
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100"
                >
                  Tutup Detail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
