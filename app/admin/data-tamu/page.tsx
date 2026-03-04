// app/admin/data-tamu/page.tsx
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
  Building2,
  Phone,
  Target,
  AlertCircle,
  Download,
  ChevronRight,
  Search,
  X,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
import { getTamuDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

interface TamuItem {
  [key: string]: string; // Add index signature to allow access by string key
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<TamuItem[]>([]);
  const [selectedTamu, setSelectedTamu] = useState<TamuItem | null>(null);
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

  // Wrapper function untuk fetch data
  const fetchTamuData = async (page: number, limit: number) => {
    const result = await getTamuDataOptimized(page, limit);
    return {
      data: result.data,
      total: result.total,
      hasMore: result.hasMore,
    };
  };

  const {
    data: tamuData,
    initialLoading,
    loading,
    hasMore,
    total,
    loadMore,
    refresh,
    removeItem: removeLocalItem,
  } = useInfiniteData<TamuItem>({
    fetchFn: fetchTamuData,
    initialLimit: 50,
    enabled: true,
  });

  // Update filteredData when tamuData changes
  useEffect(() => {
    console.log("🔄 [TamuPage Debug] tamuData:", tamuData?.length);
    if (tamuData && tamuData.length > 0) {
      let filtered = [...tamuData];

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

      if (selectedDate) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.Timestamp || "");
          return itemDate.toDateString() === selectedDate.toDateString();
        });
      }

      if (sortBy) {
        filtered.sort((a, b) => {
          let valA: string | number = a[sortBy as keyof TamuItem] || "";
          let valB: string | number = b[sortBy as keyof TamuItem] || "";

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
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, selectedDate, tamuData, sortBy, sortOrder]);

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
      const result = await deleteData("tamu", itemToDelete.index);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Data tamu ${itemToDelete.nama} berhasil dihapus`,
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Buku Tamu");
      XLSX.writeFile(
        workbook,
        `tamu_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`,
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

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const getStatistikBidang = () => {
    if (!filteredData || filteredData.length === 0) return [];

    const bidangMap: Record<string, number> = {};
    filteredData.forEach((item) => {
      const bidang = item["Bidang Dituju"] || "Lainnya";
      bidangMap[bidang] = (bidangMap[bidang] || 0) + 1;
    });

    return Object.entries(bidangMap)
      .map(([nama, jumlah]) => ({
        nama,
        jumlah,
        persentase: Math.round((jumlah / filteredData.length) * 100),
      }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);
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
  const statBidang = getStatistikBidang();

  const columns = [
    {
      key: "no",
      header: "No",
      width: 50,
      render: (_item: TamuItem, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 90,
      sortable: true,
      render: (item: TamuItem) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs">
            {item.Timestamp
              ? new Date(item.Timestamp).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "nama",
      header: "Nama",
      width: 120,
      sortable: true,
      render: (item: TamuItem) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 bg-green-100 shrink-0">
            <AvatarFallback className="text-green-600 text-xs">
              {item.Nama ? getInitials(item.Nama) : "?"}
            </AvatarFallback>
          </Avatar>
          <span
            className="text-xs truncate max-w-[80px]"
            title={item.Nama || "-"}
          >
            {item.Nama || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "jk",
      header: "JK",
      width: 40,
      render: (item: TamuItem) => (
        <Badge
          variant="outline"
          className={`text-[10px] px-1 py-0 ${
            item["Jenis Kelamin"] === "Laki-laki"
              ? "bg-[#c9973a]/10 text-[#c9973a] border-blue-200"
              : "bg-pink-50 text-pink-700 border-pink-200"
          }`}
        >
          {item["Jenis Kelamin"] === "Laki-laki"
            ? "L"
            : item["Jenis Kelamin"] === "Perempuan"
              ? "P"
              : "-"}
        </Badge>
      ),
    },
    {
      key: "usia",
      header: "Usia",
      width: 60,
      render: (item: TamuItem) => (
        <span className="text-xs">{item["Rentang Usia"] || "-"}</span>
      ),
    },
    {
      key: "instansi",
      header: "Instansi",
      width: 120,
      sortable: true,
      render: (item: TamuItem) => (
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
          <span
            className="text-xs truncate max-w-[90px]"
            title={item.Instansi || "-"}
          >
            {item.Instansi || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "jabatan",
      header: "Jabatan",
      width: 100,
      render: (item: TamuItem) => (
        <span className="text-xs truncate" title={item.Jabatan || "-"}>
          {item.Jabatan || "-"}
        </span>
      ),
    },
    {
      key: "bidang",
      header: "Bidang",
      width: 90,
      render: (item: TamuItem) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-1 py-0 truncate max-w-[80px]"
          title={item["Bidang Dituju"] || "-"}
        >
          {item["Bidang Dituju"] || "-"}
        </Badge>
      ),
    },
    {
      key: "tujuan",
      header: "Tujuan",
      width: 100,
      render: (item: TamuItem) => (
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-gray-400 shrink-0" />
          <span
            className="text-xs truncate max-w-[70px]"
            title={item.Tujuan || "-"}
          >
            {item.Tujuan ? item.Tujuan.substring(0, 15) + "..." : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "nohp",
      header: "No HP",
      width: 90,
      render: (item: TamuItem) => (
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
          <span
            className="text-xs truncate max-w-[60px]"
            title={item["No HP"] || "-"}
          >
            {item["No HP"] || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "detail",
      header: "",
      width: 40,
      render: (item: TamuItem) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTamu(item);
            setDialogOpen(true);
          }}
          className="hover:bg-[#c9973a]/10 h-6 w-6 p-0"
        >
          <Eye className="h-3 w-3 text-green-600" />
        </Button>
      ),
    },
    {
      key: "aksi",
      header: "",
      width: 40,
      render: (item: TamuItem, index: number) => (
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

  if (initialLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

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
        <span className="font-medium text-gray-700">Data Buku Tamu</span>
      </div>

      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-800 p-8 rounded-3xl shadow-xl shadow-emerald-100">
        {/* Dekorasi Cahaya */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-400/20 text-emerald-100 hover:bg-emerald-400/30 border-none shadow-none font-bold text-[10px] tracking-widest uppercase">
                Sistem Database
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              DATA BUKU <span className="text-emerald-200">TAMU</span>
            </h1>
            <p className="text-emerald-100/60 text-xs font-medium mt-1 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Monitoring {total || 0} kunjungan tamu tercatat secara real-time
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
              className="bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-900/20 gap-2"
            >
              <Download className="h-4 w-4" />
              Ekspor Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: "Total Kunjungan", value: stat.total, icon: Users, color: "#10b981", sub: "Total keseluruhan" },
            { label: "Hari Ini", value: stat.hariIni, icon: Calendar, color: "#3b82f6", sub: `${stat.total ? Math.round((stat.hariIni / stat.total) * 100) : 0}% dari total` },
            { label: "Minggu Ini", value: stat.mingguIni, icon: TrendingUp, color: "#8b5cf6", sub: `${stat.total ? Math.round((stat.mingguIni / stat.total) * 100) : 0}% dari total` },
            { label: "Rata-rata/Hari", value: Math.round(stat.mingguIni / 7) || 0, icon: Clock, color: "#f59e0b", sub: "7 hari terakhir" }
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

      {/* Distribusi Bidang */}
      {statBidang.length > 0 && (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                  Distribusi Kunjungan
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Bidang Terpopuler</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {statBidang.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span
                      className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate max-w-[100px]"
                      title={item.nama}
                    >
                      {item.nama}
                    </span>
                    <span className="text-emerald-600 font-black text-xs">{item.persentase}%</span>
                  </div>
                  <Progress value={item.persentase} className="h-1.5 bg-emerald-50" />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold">{item.jumlah} Tamu</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border-none shadow-md bg-white animate-in slide-in-from-top-4 duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, instansi, atau tujuan..."
                    className="pl-10 border-gray-100 bg-gray-50/50 h-11 text-sm rounded-xl focus-visible:ring-emerald-500"
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
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
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                 Tampilan Tabel
              </span>
           </div>
           <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-200">
              {filteredData.length} HASIL
           </Badge>
        </div>
        <VirtualTable
          data={filteredData}
          columns={columns}
          onRowClick={(item) => {
            setSelectedTamu(item);
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
          rowClassName="hover:bg-emerald-50/30 transition-colors cursor-pointer border-b border-gray-50/50"
          emptyMessage="Tidak ada data tamu ditemukan"
          rowHeight={56}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedTamu(null);
        }}
      >
        <DialogContent className="max-w-3xl border-none p-0 overflow-hidden rounded-3xl shadow-2xl">
          {selectedTamu && (
            <div className="flex flex-col">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl bg-white/10">
                    <AvatarFallback className="text-2xl font-black text-white">
                      {selectedTamu.Nama ? getInitials(selectedTamu.Nama) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <DialogTitle asChild>
                      <h2 className="text-2xl font-black tracking-tight uppercase italic mb-1">
                        {selectedTamu.Nama || "Tamu Anonim"}
                      </h2>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Informasi detail untuk tamu {selectedTamu.Nama || "Anonim"}
                    </DialogDescription>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5">
                        {selectedTamu.Instansi || "Personal"}
                      </Badge>
                      <Badge className="bg-emerald-400/20 text-emerald-100 hover:bg-emerald-400/30 border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5">
                        {selectedTamu.Jabatan || "Pengunjung"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Groups */}
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Pribadi</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jenis Kelamin</p>
                          <p className="text-xs font-black text-gray-800">{selectedTamu["Jenis Kelamin"] || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rentang Usia</p>
                          <p className="text-xs font-black text-gray-800">{selectedTamu["Rentang Usia"] || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nomor Handphone</p>
                        <p className="text-xs font-black text-gray-800 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {selectedTamu["No HP"] || "-"}
                        </p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat</span>
                      </div>
                      <p className="text-xs font-bold text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                        {selectedTamu.Alamat || "Alamat tidak tersedia"}
                      </p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tujuan Kunjungan</span>
                      </div>
                      <Badge className="bg-purple-50 text-purple-700 border-purple-100 font-bold mb-2">
                        {selectedTamu["Bidang Dituju"] || "Umum"}
                      </Badge>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                          {selectedTamu.Tujuan || "Tidak ada tujuan spesifik"}
                        </p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Kunjungan</span>
                      </div>
                      <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <div className="text-[10px] font-black text-orange-700 uppercase tracking-tighter">
                          {selectedTamu.Timestamp || "-"}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                <Button 
                  onClick={() => setDialogOpen(false)}
                  variant="ghost" 
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100"
                >
                  Close Record
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
