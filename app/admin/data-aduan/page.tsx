// app/admin/data-aduan/page.tsx
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
  MapPin,
  AlertCircle,
  User,
  Clock,
  Download,
  ChevronRight,
  Search,
  X,
  BarChart3,
  Users,
  Building2,
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
import { getAduanDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
  Status?: string;
}

export default function AduanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<AduanItem[]>([]);
  const [selectedAduan, setSelectedAduan] = useState<AduanItem | null>(null);
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
    data: aduanData,
    initialLoading,
    loading,
    hasMore,
    total,
    loadMore,
    refresh,
    removeItem: removeLocalItem,
  } = useInfiniteData({
    fetchFn: (page, limit) => getAduanDataOptimized(page, limit),
    initialLimit: 50,
    enabled: true,
  });

  useEffect(() => {
    let filtered = [...aduanData];

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

    if (selectedDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.Timestamp || "");
        return itemDate.toDateString() === selectedDate.toDateString();
      });
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        let valA = a[sortBy as keyof AduanItem] || "";
        let valB = b[sortBy as keyof AduanItem] || "";

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
  }, [searchTerm, selectedDate, aduanData, sortBy, sortOrder]);

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
      const result = await deleteData("aduan", itemToDelete.index);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Data aduan ${itemToDelete.nama} berhasil dihapus`,
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Aduan");
      XLSX.writeFile(
        workbook,
        `aduan_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`,
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

  // Statistik berdasarkan status (dengan fallback jika Status tidak ada)
  const getStatistik = () => {
    const total = filteredData.length;
    const baru = filteredData.filter(
      (d) => !d.Status || d.Status === "Baru" || d.Status === "",
    ).length;
    const diproses = filteredData.filter((d) => d.Status === "Diproses").length;
    const selesai = filteredData.filter((d) => d.Status === "Selesai").length;

    return { total, baru, diproses, selesai };
  };

  const stat = getStatistik();

  const columns = [
    {
      key: "no",
      header: "No",
      width: 50,
      render: (_: AduanItem, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 90,
      sortable: true,
      render: (item: AduanItem) => (
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
      render: (item: AduanItem) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 bg-red-100 shrink-0">
            <AvatarFallback className="text-red-600 text-xs">
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
      key: "instansi",
      header: "Instansi",
      width: 120,
      sortable: true,
      render: (item: AduanItem) => (
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs truncate max-w-[90px]" title={item.Instansi}>
            {item.Instansi || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "jk",
      header: "JK",
      width: 40,
      render: (item: AduanItem) => (
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
      key: "peristiwa",
      header: "Peristiwa",
      width: 150,
      render: (item: AduanItem) => (
        <div
          className="text-xs truncate max-w-[130px]"
          title={item["Hal Peristiwa"]}
        >
          {item["Hal Peristiwa"]?.substring(0, 25)}...
        </div>
      ),
    },
    {
      key: "lokasi",
      header: "Lokasi",
      width: 100,
      render: (item: AduanItem) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span
            className="text-xs truncate max-w-[70px]"
            title={item["Lokasi Peristiwa"]}
          >
            {item["Lokasi Peristiwa"] || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "tglKejadian",
      header: "Tgl Kejadian",
      width: 90,
      render: (item: AduanItem) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs">{item["Tanggal Kejadian"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "detail",
      header: "",
      width: 40,
      render: (item: AduanItem) => (
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
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAduan(item);
              }}
              className="hover:bg-red-100 h-6 w-6 p-0"
            >
              <Eye className="h-3 w-3 text-red-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Avatar className="w-10 h-10 bg-red-100">
                  <AvatarFallback className="text-red-600">
                    {getInitials(item.Nama)}
                  </AvatarFallback>
                </Avatar>
                Detail Aduan - {item.Nama}
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap aduan masyarakat
              </DialogDescription>
            </DialogHeader>
            {selectedAduan && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-4 h-4" /> Identitas Pelapor
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Nama</p>
                      <p className="font-medium">{selectedAduan.Nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pekerjaan</p>
                      <p className="font-medium">{selectedAduan.Pekerjaan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instansi</p>
                      <p className="font-medium">{selectedAduan.Instansi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-medium">
                        {selectedAduan["Jenis Kelamin"]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rentang Usia</p>
                      <p className="font-medium">
                        {selectedAduan["Rentang Usia"]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="font-medium">{selectedAduan.Timestamp}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Detail Aduan
                  </h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Hal/Peristiwa
                      </p>
                      <div className="bg-white p-3 rounded border text-sm">
                        {selectedAduan["Hal Peristiwa"]}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Lokasi Peristiwa
                        </p>
                        <div className="bg-white p-2 rounded border flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {selectedAduan["Lokasi Peristiwa"]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Tanggal Kejadian
                        </p>
                        <div className="bg-white p-2 rounded border flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {selectedAduan["Tanggal Kejadian"]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Tindak Lanjut yang Diharapkan
                      </p>
                      <div className="bg-white p-3 rounded border text-sm">
                        {selectedAduan["Tindak Lanjut"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ),
    },
    {
      key: "aksi",
      header: "",
      width: 40,
      render: (item: AduanItem, index: number) => (
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
        <span className="font-medium text-gray-700">Data Aduan</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Data Layanan Aduan
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Total {total} aduan telah masuk
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refresh}
              variant="outline"
              className="gap-2 border-gray-200 hover:bg-red-50 hover:text-red-600"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-gray-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Total Aduan</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {stat.total}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Aduan Baru</p>
                <p className="text-xl font-bold text-yellow-600 mt-1">
                  {stat.baru}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.baru / (stat.total || 1)) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Diproses</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {stat.diproses}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.diproses / (stat.total || 1)) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Selesai</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {stat.selesai}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {Math.round((stat.selesai / (stat.total || 1)) * 100)}%
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
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
                    placeholder="Cari nama/instansi/aduan..."
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
            setSelectedAduan(item);
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
          rowClassName="hover:bg-red-50/50 transition-colors cursor-pointer"
          emptyMessage="Tidak ada data aduan"
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
