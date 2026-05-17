export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#1a2744]/60 ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
