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
  MapPin,
  Briefcase,
  Target,
  XCircle,
  AlertCircle,
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
import { getTamuDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";

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

  const {
    data: tamuData,
    initialLoading,
    loading,
    hasMore,
    total,
    loadMore,
    refresh,
    removeItem: removeLocalItem,
  } = useInfiniteData({
    fetchFn: (page, limit) => getTamuDataOptimized(page, limit),
    initialLimit: 50,
    enabled: true,
  });

  useEffect(() => {
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
        let valA = a[sortBy as keyof TamuItem] || "";
        let valB = b[sortBy as keyof TamuItem] || "";

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
    } catch (error) {
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
          <Avatar className="w-8 h-8 bg-green-100 flex-shrink-0">
            <AvatarFallback className="text-green-600 font-semibold">
              {getInitials(item.Nama)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium truncate">{item.Nama || "-"}</span>
        </div>
      ),
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
      key: "nohp",
      header: "No HP",
      width: 120,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{item["No HP"] || "-"}</span>
        </div>
      ),
    },
    {
      key: "instansi",
      header: "Instansi",
      width: 150,
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{item.Instansi || "-"}</span>
        </div>
      ),
    },
    {
      key: "jabatan",
      header: "Jabatan",
      width: 120,
      sortable: true,
      render: (item: any) => item.Jabatan || "-",
    },
    {
      key: "alamat",
      header: "Alamat",
      width: 150,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate" title={item.Alamat}>
            {item.Alamat?.substring(0, 20)}...
          </span>
        </div>
      ),
    },
    {
      key: "bidang",
      header: "Bidang",
      width: 100,
      render: (item: any) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          {item["Bidang Dituju"] || "-"}
        </Badge>
      ),
    },
    {
      key: "tujuan",
      header: "Tujuan",
      width: 150,
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate" title={item.Tujuan}>
            {item.Tujuan?.substring(0, 20)}...
          </span>
        </div>
      ),
    },
    {
      key: "detail",
      header: "Detail",
      width: 60,
      render: (item: any) => (
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
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTamu(item);
              }}
              className="hover:bg-green-100"
            >
              <Eye className="h-4 w-4 text-green-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Avatar className="w-10 h-10 bg-green-100">
                  <AvatarFallback className="text-green-600">
                    {getInitials(item.Nama)}
                  </AvatarFallback>
                </Avatar>
                Detail Kunjungan - {item.Nama}
              </DialogTitle>
              <DialogDescription>Informasi lengkap tamu</DialogDescription>
            </DialogHeader>
            {selectedTamu && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Nama
                    </p>
                    <p className="font-medium">{selectedTamu.Nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Jenis Kelamin
                    </p>
                    <p className="font-medium">
                      {selectedTamu["Jenis Kelamin"]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Rentang Usia
                    </p>
                    <p className="font-medium">
                      {selectedTamu["Rentang Usia"]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> No HP
                    </p>
                    <p className="font-medium">{selectedTamu["No HP"]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Instansi
                    </p>
                    <p className="font-medium">{selectedTamu.Instansi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Jabatan
                    </p>
                    <p className="font-medium">{selectedTamu.Jabatan}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Alamat
                    </p>
                    <p className="font-medium">{selectedTamu.Alamat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Bidang Dituju
                    </p>
                    <p className="font-medium">
                      {selectedTamu["Bidang Dituju"]}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Tujuan
                    </p>
                    <p className="font-medium whitespace-pre-wrap">
                      {selectedTamu.Tujuan}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Waktu Kunjungan
                    </p>
                    <p className="font-medium">{selectedTamu.Timestamp}</p>
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

  if (initialLoading) return <LoadingTable />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-800 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Data Buku Tamu Digital
            </h1>
            <p className="text-green-100 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total {total} kunjungan tercatat
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Kunjungan
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stat.total}
                </p>
                <p className="text-xs text-gray-400 mt-1">dari {total} total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Hari Ini</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stat.hariIni}
                </p>
                <p className="text-xs text-gray-400 mt-1">kunjungan</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Minggu Ini</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {stat.mingguIni}
                </p>
                <p className="text-xs text-gray-400 mt-1">kunjungan</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
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
                  placeholder="Cari nama/instansi/bidang/tujuan..."
                  className="w-[300px]"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <DatePicker date={selectedDate} setDate={setSelectedDate} />
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
        onRowClick={(item) => setSelectedTamu(item)}
        initialLoading={initialLoading}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        className="border-0 shadow-lg"
        rowClassName="hover:bg-green-50/50 transition-colors"
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
