import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "./use-toast";

interface UseInfiniteDataProps<T> {
  fetchFn: (
    page: number,
    limit: number,
  ) => Promise<{ data: T[]; total: number }>;
  initialLimit?: number;
  enabled?: boolean;
}

export function useInfiniteData<T>({
  fetchFn,
  initialLimit = 50,
  enabled = true,
}: UseInfiniteDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    if (!initialLoadDoneRef.current) {
      loadMore(true);
      initialLoadDoneRef.current = true;
    }
  }, [enabled]);

  const loadMore = useCallback(
    async (isInitial = false) => {
      if (loadingRef.current) return;
      if (!isInitial && !hasMore) return;

      loadingRef.current = true;
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      try {
        const currentPage = isInitial ? 1 : page;
        const result = await fetchFn(currentPage, initialLimit);

        setData((prev) => {
          if (isInitial) return result.data;
          const existingIds = new Set(
            prev.map((item) => (item as any).id || JSON.stringify(item)),
          );
          const newData = result.data.filter((item) => {
            const id = (item as any).id || JSON.stringify(item);
            return !existingIds.has(id);
          });
          return [...prev, ...newData];
        });

        setTotal(result.total);

        const totalLoaded = isInitial
          ? result.data.length
          : data.length + result.data.length;
        setHasMore(totalLoaded < result.total);

        if (!isInitial) {
          setPage((prev) => prev + 1);
        }

        setError(null);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Gagal memuat data");
        toast({
          title: "Error",
          description: "Gagal memuat data",
          variant: "destructive",
        });
      } finally {
        loadingRef.current = false;
        if (isInitial) {
          setInitialLoading(false);
        } else {
          setLoading(false);
        }
      }
    },
    [fetchFn, initialLimit, page, hasMore, data.length, toast],
  );

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    initialLoadDoneRef.current = false;
    loadMore(true);
  }, [loadMore]);

  const removeItem = useCallback((index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    data,
    loading,
    initialLoading,
    hasMore,
    total,
    error,
    loadMore,
    refresh,
    removeItem,
  };
}
