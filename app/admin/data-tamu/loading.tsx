// app/admin/data-tamu/loading.tsx
import { LoadingTable } from "@/components/ui/loading-spinner";

export default function TamuLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
      <LoadingTable />
    </div>
  );
}
