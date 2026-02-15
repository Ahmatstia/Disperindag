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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/filters/date-picker";
import { VirtualTable } from "@/components/tables/virtual-table";
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { getAduanDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";

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

  const getStatistik = () => {
    return { total: filteredData.length };
  };

  const stat = getStatistik();

  const columns = [
    {
      key: "no",
      header: "No",
      width: 60,
      render: (_: AduanItem, index: number) => index + 1,
    },
    {
      key: "timestamp",
      header: "Tanggal",
      width: 100,
      sortable: true,
      render: (item: AduanItem) => (
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
      render: (item: AduanItem) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 bg-red-100 shrink-0">
            <AvatarFallback className="text-red-600 font-semibold">
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
      render: (item: AduanItem) => item.Pekerjaan || "-",
    },
    {
      key: "instansi",
      header: "Instansi",
      width: 150,
      sortable: true,
      render: (item: AduanItem) => item.Instansi || "-",
    },
    {
      key: "jk",
      header: "JK",
      width: 50,
      render: (item: AduanItem) => (
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
      render: (item: AduanItem) => item["Rentang Usia"] || "-",
    },
    {
      key: "peristiwa",
      header: "Peristiwa",
      width: 200,
      render: (item: AduanItem) => (
        <div className="truncate" title={item["Hal Peristiwa"]}>
          {item["Hal Peristiwa"]?.substring(0, 30)}...
        </div>
      ),
    },
    {
      key: "lokasi",
      header: "Lokasi",
      width: 120,
      render: (item: AduanItem) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-sm truncate">
            {item["Lokasi Peristiwa"] || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "tglKejadian",
      header: "Tgl Kejadian",
      width: 100,
      render: (item: AduanItem) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-sm">{item["Tanggal Kejadian"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "detail",
      header: "Detail",
      width: 60,
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
              className="hover:bg-red-100"
            >
              <Eye className="h-4 w-4 text-red-600" />
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
                      <div className="bg-white p-3 rounded border">
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
                          <span>{selectedAduan["Lokasi Peristiwa"]}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Tanggal Kejadian
                        </p>
                        <div className="bg-white p-2 rounded border flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{selectedAduan["Tanggal Kejadian"]}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Tindak Lanjut yang Diharapkan
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
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      width: 60,
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
          className="hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      ),
    },
  ];

  if (initialLoading) return <LoadingTable />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-600 to-red-800 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Data Layanan Aduan
            </h1>
            <p className="text-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Total {total} aduan telah masuk
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
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        <Card className="border-0 shadow-lg bg-linear-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Aduan</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stat.total}
                </p>
                <p className="text-xs text-gray-400 mt-1">dari {total} total</p>
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
                  placeholder="Cari nama/instansi/aduan..."
                  className="w-75"
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
        data={filteredData as Record<string, unknown>[]}
        columns={columns as any}
        onRowClick={(item) => setSelectedAduan(item as AduanItem)}
        initialLoading={initialLoading}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        className="border-0 shadow-lg"
        rowClassName="hover:bg-red-50/50 transition-colors"
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
