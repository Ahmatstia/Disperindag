// hooks/use-infinite-data.ts
import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteDataOptions<T> {
  fetchFn: (
    page: number,
    limit: number,
  ) => Promise<{
    data: T[];
    total: number;
    hasMore: boolean;
  }>;
  initialLimit?: number;
  enabled?: boolean;
}

export function useInfiniteData<T>({
  fetchFn,
  initialLimit = 50,
  enabled = true,
}: UseInfiniteDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const loadingRef = useRef(false);
  const initialLoadedRef = useRef(false);

  const loadData = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const result = await fetchFn(pageNum, initialLimit);

        setData((prev) =>
          isRefresh ? result.data : [...prev, ...result.data],
        );
        setTotal(result.total);
        setHasMore(result.hasMore);

        if (!isRefresh) {
          setPage(pageNum);
        }

        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        loadingRef.current = false;
      }
    },
    [fetchFn, initialLimit],
  );

  // Initial load
  useEffect(() => {
    if (enabled && !initialLoadedRef.current) {
      initialLoadedRef.current = true;
      loadData(1, true);
    }
  }, [enabled, loadData]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !loadingRef.current) {
      loadData(page + 1, false);
    }
  }, [hasMore, loading, page, loadData]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [loadData]);

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
