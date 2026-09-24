export default function HistoryLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-muted rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
      </div>

      {/* Search */}
      <div className="h-10 bg-muted rounded-xl" />

      {/* History list */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
