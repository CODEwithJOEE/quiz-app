export default function ProfileLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="h-6 w-20 bg-muted rounded-lg" />

      {/* Profile card */}
      <div className="bg-card p-6 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-muted" />
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-5 w-24 bg-muted rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card p-4 rounded-2xl space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-muted rounded-xl" />
          <div className="h-16 bg-muted rounded-xl" />
          <div className="h-16 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Account info */}
      <div className="bg-card p-4 rounded-2xl space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-12 bg-muted rounded-xl" />
        <div className="h-12 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
