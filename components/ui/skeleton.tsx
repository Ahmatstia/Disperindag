// components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function StatistikSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-md">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
