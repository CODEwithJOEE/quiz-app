export default function UsersLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-muted rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 bg-muted rounded-lg" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
      </div>

      {/* Create user form */}
      <div className="h-80 bg-muted rounded-2xl" />

      {/* Search bar */}
      <div className="h-10 bg-muted rounded-xl" />

      {/* User list */}
      <div className="space-y-2">
        <div className="h-14 bg-muted rounded-2xl" />
        <div className="h-14 bg-muted rounded-2xl" />
        <div className="h-14 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
