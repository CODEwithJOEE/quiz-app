export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="h-7 w-32 bg-muted rounded-lg" />

      {/* Card skeleton */}
      <div className="h-24 bg-muted rounded-2xl" />

      {/* Card skeleton */}
      <div className="h-32 bg-muted rounded-2xl" />

      {/* Card skeleton */}
      <div className="h-20 bg-muted rounded-2xl" />
    </div>
  );
}
