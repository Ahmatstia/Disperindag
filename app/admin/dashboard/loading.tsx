// app/admin/dashboard/loading.tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <LoadingSpinner />
    </div>
  );
}
