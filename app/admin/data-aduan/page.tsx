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
  Users,
  Building2,
  Phone,
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
import { getAduanDataOptimized, deleteData } from "@/lib/apps-script";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import Link from "next/link";

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
  [key: string]: string | undefined;
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
  } = useInfiniteData<AduanItem>({
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
        let valA: string | number = a[sortBy as keyof AduanItem] || "";
        let valB: string | number = b[sortBy as keyof AduanItem] || "";

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
              ? "bg-[#c9973a]/10 text-[#c9973a] border-[#c9973a]/30"
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
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAduan(item);
            setDialogOpen(true);
          }}
          className="hover:bg-rose-100 h-6 w-6 p-0"
        >
          <Eye className="h-3 w-3 text-rose-600" />
        </Button>
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

      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-700 to-pink-800 p-8 rounded-3xl shadow-xl shadow-rose-100">
        {/* Dekorasi Cahaya */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-400/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-rose-400/20 text-rose-100 hover:bg-rose-400/30 border-none shadow-none font-bold text-[10px] tracking-widest uppercase">
                Monitoring System
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              DATA LAYANAN <span className="text-rose-200">ADUAN</span>
            </h1>
            <p className="text-rose-100/60 text-xs font-medium mt-1 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Monitoring {total || 0} aduan masuk untuk respon cepat & efisien
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
              Refresh
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
              Filter
            </Button>
            <Button
              onClick={exportToExcel}
              size="sm"
              className="bg-rose-500 hover:bg-rose-400 text-white border-none shadow-lg shadow-rose-900/20 gap-2"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: "Total Aduan", value: stat.total, icon: AlertCircle, color: "#f43f5e", sub: "Aduan masuk" },
            { label: "Aduan Baru", value: stat.baru, icon: Clock, color: "#eab308", sub: `${Math.round((stat.baru / (stat.total || 1)) * 100)}% dari total` },
            { label: "Diproses", value: stat.diproses, icon: User, color: "#c9973a", sub: `${Math.round((stat.diproses / (stat.total || 1)) * 100)}% dari total` },
            { label: "Selesai", value: stat.selesai, icon: Users, color: "#10b981", sub: `${Math.round((stat.selesai / (stat.total || 1)) * 100)}% dari total` }
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
          <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-500 w-full" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search name, instance, or report details..."
                    className="pl-10 border-gray-100 bg-gray-50/50 h-11 text-sm rounded-xl focus-visible:ring-rose-500"
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                      placeholder="Select date"
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
                    <Button
                      onClick={exportToExcel}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 h-11 rounded-xl shadow-lg shadow-emerald-900/10 border-none px-6"
                    >
                      <Download className="h-4 w-4" />
                      Export Excel
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Section */}
      <div className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                 Complaints Register
              </span>
           </div>
           <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-200">
              {filteredData.length} RESULTS
           </Badge>
        </div>
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
          rowClassName="hover:bg-rose-50/30 transition-colors cursor-pointer border-b border-gray-50/50"
          emptyMessage="No complaint records found"
          rowHeight={56}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedAduan(null);
        }}
      >
        <DialogContent className="max-w-3xl border-none p-0 overflow-hidden rounded-3xl shadow-2xl">
          {selectedAduan && (
            <div className="flex flex-col">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-rose-600 to-pink-700 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl bg-white/10">
                    <AvatarFallback className="text-2xl font-black text-white">
                      {selectedAduan.Nama ? getInitials(selectedAduan.Nama) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <DialogTitle asChild>
                      <h2 className="text-2xl font-black tracking-tight uppercase italic mb-1">
                        {selectedAduan.Nama || "Anonymous Reporter"}
                      </h2>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Detail complaint from {selectedAduan.Nama || "Unknown"}
                    </DialogDescription>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5">
                        {selectedAduan.Instansi || "Personal"}
                      </Badge>
                      <Badge className={cn(
                        "border-none font-bold text-[10px] tracking-widest uppercase px-2 py-0.5 shadow-sm",
                        selectedAduan.Status === "Selesai" ? "bg-emerald-400 text-emerald-950" : 
                        selectedAduan.Status === "Sedang Diproses" ? "bg-amber-400 text-amber-950" : 
                        "bg-rose-400 text-rose-950"
                      )}>
                        {selectedAduan.Status?.toUpperCase() || "PENDING"}
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
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reporter Info</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Profession</p>
                          <p className="text-xs font-black text-gray-800">{selectedAduan.Pekerjaan || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                          <p className="text-xs font-black text-gray-800">{selectedAduan["Jenis Kelamin"] || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-xs font-black text-gray-800 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-rose-600" />
                          {selectedAduan["No HP"] || "-"}
                        </p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</span>
                      </div>
                      <p className="text-xs font-bold text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                        {selectedAduan.Alamat || "No address provided"}
                      </p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complaint Details</span>
                      </div>
                      <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-100 min-h-[120px]">
                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                          {selectedAduan["Hal Peristiwa"] || "No specific details provided"}
                        </p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</span>
                      </div>
                      <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <div className="text-[10px] font-black text-orange-700 uppercase tracking-tighter">
                          {selectedAduan.Timestamp || "-"}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
                <Button 
                  onClick={() => setDialogOpen(false)}
                  variant="ghost" 
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100"
                >
                  Close Record
                </Button>
                {selectedAduan.Status !== "Selesai" && (
                   <Button 
                     className="rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                   >
                     Mark as Resolved
                   </Button>
                )}
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
