"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string | number;
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
  total,
  sortBy,
  sortOrder,
  onSort,
  className,
  rowClassName,
  emptyMessage = "Tidak ada data",
  rowHeight = 53,
}: VirtualTableProps<T>) {
  const listRef = useRef<List>(null);
  const loadingRef = useRef(false);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      setContainerHeight(Math.min(600, vh - 300));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleSort = (key: string) => {
    if (onSort && columns.find((col) => col.key === key)?.sortable) {
      onSort(key);
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortBy === key) {
      return sortOrder === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4 inline" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4 inline" />
      );
    }
    return null;
  };

  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      if (!hasMore || loading || loadingRef.current || !listRef.current) return;

      const listHeight = rowHeight * 10; // Approximate height
      const totalHeight = data.length * rowHeight;

      if (scrollOffset + listHeight >= totalHeight * 0.8) {
        loadingRef.current = true;
        loadMore?.();

        setTimeout(() => {
          loadingRef.current = false;
        }, 1000);
      }
    },
    [hasMore, loading, data.length, rowHeight, loadMore],
  );

  useEffect(() => {
    loadingRef.current = false;
  }, [data]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = data[index];

    const getRowClassName = () => {
      if (typeof rowClassName === "function") {
        return rowClassName(item, index);
      }
      return rowClassName || "";
    };

    return (
      <div
        style={{
          ...style,
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid hsl(var(--border))",
        }}
        className={cn(
          "hover:bg-muted/50 transition-colors",
          onRowClick && "cursor-pointer",
          getRowClassName(),
        )}
        onClick={() => onRowClick?.(item)}
        role="row"
      >
        {columns.map((column, colIndex) => {
          const cellContent = column.render
            ? column.render(item, index)
            : (item[column.key as keyof T] as React.ReactNode);

          return (
            <div
              key={colIndex}
              className={cn(
                "px-4 py-3 flex items-center text-sm overflow-hidden text-ellipsis whitespace-nowrap",
                column.className,
              )}
              style={{
                width: column.width || "150px",
                minWidth: column.width || "150px",
              }}
              title={typeof cellContent === "string" ? cellContent : undefined}
            >
              {cellContent || "-"}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className={cn("border rounded-lg", className)}>
      <div className="flex border-b bg-muted/50 sticky top-0 z-10">
        {columns.map((column, i) => (
          <div
            key={i}
            className="px-4 py-3 font-medium text-sm"
            style={{ width: column.width || "150px" }}
          >
            {column.header}
          </div>
        ))}
      </div>
      <div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b">
            {columns.map((column, j) => (
              <div
                key={j}
                className="px-4 py-3"
                style={{ width: column.width || "150px" }}
              >
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (initialLoading) {
    return renderSkeleton();
  }

  if (data.length === 0) {
    return (
      <div className={cn("border rounded-lg p-12 text-center", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="text-6xl">📭</div>
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("border rounded-lg overflow-hidden bg-white", className)}
    >
      {/* Header */}
      <div className="flex border-b bg-muted/50 sticky top-0 z-10">
        {columns.map((column, i) => (
          <div
            key={i}
            className={cn(
              "px-4 py-3 font-medium text-sm flex items-center",
              column.sortable && "cursor-pointer hover:bg-muted/70",
            )}
            style={{ width: column.width || "150px" }}
            onClick={() => handleSort(column.key as string)}
          >
            {column.header}
            {renderSortIcon(column.key as string)}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div style={{ height: containerHeight - 45 }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={data.length}
              itemSize={rowHeight}
              width={width}
              onScroll={handleScroll}
              overscanCount={5}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>

      {/* Footer */}
      {(loading || hasMore) && (
        <div className="border-t p-3 text-center bg-white">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Memuat data...
              </span>
            </div>
          ) : hasMore ? (
            <p className="text-sm text-muted-foreground">
              Scroll ke bawah untuk memuat lebih banyak
            </p>
          ) : null}
        </div>
      )}

      {!hasMore && data.length > 0 && (
        <div className="border-t p-3 text-center bg-white">
          <p className="text-sm text-muted-foreground">
            {total
              ? `Menampilkan ${data.length} dari ${total} data`
              : "Semua data telah ditampilkan"}
          </p>
        </div>
      )}
    </div>
  );
}
