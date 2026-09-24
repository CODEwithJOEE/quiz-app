export default function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-32 bg-muted rounded-lg" />
        <div className="h-3 w-24 bg-muted rounded" />
      </div>

      {/* Users stats */}
      <div className="space-y-3">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
        </div>
      </div>

      {/* Content stats */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
        </div>
      </div>

      {/* Recent activity */}
      <div className="space-y-3">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-44 bg-muted rounded-2xl" />
        <div className="h-32 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
