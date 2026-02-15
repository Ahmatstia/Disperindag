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
import { getTamuDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

interface TamuItem {
  [key: string]: any; // Add index signature to allow access by string key
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
              ? "bg-blue-50 text-blue-700 border-blue-200"
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
          className="hover:bg-green-100 h-6 w-6 p-0"
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

      {/* Header */}
      <div className="bg-white border rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Data Buku Tamu
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Total {total || 0} kunjungan tercatat
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="gap-2 border-gray-200 hover:bg-white hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> 
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 border-gray-200 transition-all shadow-sm",
                showFilters ? "bg-green-50 text-green-700 border-green-200" : "hover:bg-white hover:text-green-600 hover:border-green-200"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              onClick={exportToExcel}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm shadow-green-200"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: "Total Kunjungan", value: stat.total, icon: Users, color: "green", sub: "Total keseluruhan" },
            { label: "Hari Ini", value: stat.hariIni, icon: Calendar, color: "blue", sub: `${stat.total ? Math.round((stat.hariIni / stat.total) * 100) : 0}% dari total` },
            { label: "Minggu Ini", value: stat.mingguIni, icon: TrendingUp, color: "purple", sub: `${stat.total ? Math.round((stat.mingguIni / stat.total) * 100) : 0}% dari total` },
            { label: "Rata-rata/Hari", value: Math.round(stat.mingguIni / 7) || 0, icon: Clock, color: "orange", sub: "7 hari terakhir" }
        ].map((item, idx) => (
            <Card key={idx} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <CardContent className="p-5">
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity bg-${item.color}-500 rounded-bl-3xl`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className={`text-2xl font-bold text-gray-800 mt-1`}>
                      {item.value}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        {item.sub}
                    </p>
                  </div>
                  <div className={`p-3 bg-${item.color}-50 rounded-xl group-hover:bg-${item.color}-100 transition-colors`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Distribusi Bidang */}
      {statBidang.length > 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Bidang yang Sering Dikunjungi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {statBidang.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span
                      className="text-gray-600 truncate max-w-[80px]"
                      title={item.nama}
                    >
                      {item.nama}
                    </span>
                    <span className="font-medium">{item.persentase}%</span>
                  </div>
                  <Progress value={item.persentase} className="h-1.5" />
                  <p className="text-xs text-gray-400 mt-1">
                    {item.jumlah} kunjungan
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border border-gray-200 animate-in slide-in-from-top duration-300">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama/instansi/bidang..."
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
              {/* Removed duplicate Export button */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Total Data */}
      <div className="text-sm text-gray-500">
        Menampilkan {filteredData.length} dari {total || 0} data
      </div>

      {/* Virtual Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
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
          rowClassName="hover:bg-green-50/50 transition-colors cursor-pointer"
          emptyMessage="Tidak ada data tamu"
          rowHeight={48}
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Avatar className="w-10 h-10 bg-green-100">
                <AvatarFallback className="text-green-600">
                  {selectedTamu?.Nama ? getInitials(selectedTamu.Nama) : "?"}
                </AvatarFallback>
              </Avatar>
              Detail Kunjungan - {selectedTamu?.Nama || "-"}
            </DialogTitle>
            <DialogDescription>Informasi lengkap tamu</DialogDescription>
          </DialogHeader>
          {selectedTamu && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{selectedTamu.Nama || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis Kelamin</p>
                  <p className="font-medium">
                    {selectedTamu["Jenis Kelamin"] || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rentang Usia</p>
                  <p className="font-medium">
                    {selectedTamu["Rentang Usia"] || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">No HP</p>
                  <p className="font-medium">
                    {selectedTamu["No HP"] || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instansi</p>
                  <p className="font-medium">
                    {selectedTamu.Instansi || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jabatan</p>
                  <p className="font-medium">{selectedTamu.Jabatan || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-medium">{selectedTamu.Alamat || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bidang Dituju</p>
                  <p className="font-medium">
                    {selectedTamu["Bidang Dituju"] || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Tujuan</p>
                  <p className="font-medium whitespace-pre-wrap">
                    {selectedTamu.Tujuan || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Waktu Kunjungan</p>
                  <p className="font-medium">
                    {selectedTamu.Timestamp || "-"}
                  </p>
                </div>
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
