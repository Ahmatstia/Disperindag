"use client";

import { useEffect, useState } from "react";

// Fungsi JSONP di client side
function fetchJSONP<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}`;

    const script = document.createElement("script");
    script.src = `${url}?callback=${callbackName}`;

    window[callbackName] = (data: T) => {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    script.onerror = () => {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error("JSONP request failed"));
    };

    document.body.appendChild(script);
  });
}

interface DataFetcherProps<T> {
  url: string;
  children: (
    data: T | null,
    loading: boolean,
    error: string | null,
  ) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await fetchJSONP<T>(url);
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return <>{children(data, loading, error)}</>;
}
