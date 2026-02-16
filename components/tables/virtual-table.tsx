
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface Column<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: number;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  initialLoading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  total?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyMessage?: string;
  rowHeight?: number;
}


export function VirtualTable<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  loading,
  initialLoading,
  hasMore,
  loadMore,
  sortBy,
  sortOrder,
  onSort,
  className,
  rowClassName,
  emptyMessage = "Tidak ada data",
  rowHeight = 48,
}: VirtualTableProps<T>) {
  // console.log("🎨 [Table] Render with data length:", data?.length);

  function handleSort(key: string) {
    if (onSort && columns.find((col) => col.key === key)?.sortable) {
      onSort(key);
    }
  }

  const renderSortIcon = (key: string) => {
    if (sortBy === key) {
      return sortOrder === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4 inline shrink-0" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4 inline shrink-0" />
      );
    }
    return null;
  };

  if (initialLoading) {
    return (
      <div className={cn("border rounded-xl bg-white shadow-sm overflow-hidden", className)}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b">
                    <tr>
                        {columns.map((column, i) => (
                            <th key={i} className="px-6 py-4 font-semibold whitespace-nowrap" style={{ width: column.width }}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50">
                            {columns.map((column, j) => (
                                <td key={j} className="px-6 py-4">
                                    <Skeleton className="h-4 w-full max-w-[100px]" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn("border rounded-xl p-12 text-center bg-white shadow-sm", className)}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-6xl mb-2">📭</div>
          <p className="text-gray-900 font-medium text-lg">Tidak ada data</p>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("border rounded-xl overflow-hidden bg-white shadow-sm", className)}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b backdrop-blur-sm sticky top-0 z-10">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-6 py-4 font-semibold whitespace-nowrap tracking-wider select-none",
                    column.sortable && "cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {renderSortIcon(column.key as string)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => {
              const getRowClassName = () => {
                 if (typeof rowClassName === "function") {
                   return rowClassName(item, index);
                 }
                 return rowClassName || "";
               };

              return (
                <tr
                  key={index}
                  className={cn(
                    "bg-white hover:bg-slate-50 transition-colors group",
                    onRowClick && "cursor-pointer",
                    getRowClassName()
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => {
                    const cellContent = column.render
                      ? column.render(item, index)
                      : (item[column.key as keyof T] as React.ReactNode);

                    return (
                      <td
                        key={colIndex}
                        className={cn("px-6 py-4 whitespace-nowrap text-gray-600", column.className)}
                        style={{ width: column.width }}
                      >
                         {cellContent !== undefined && cellContent !== null && cellContent !== "" ? (
                            cellContent
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Loading More Indicator */}
      {hasMore && (
        <div className="p-4 border-t flex justify-center">
            <button 
                onClick={loadMore} 
                disabled={loading}
                className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Memuat lebih banyak..." : "Muat Lebih Banyak"}
            </button>
        </div>
      )}
    </div>
  );
}

