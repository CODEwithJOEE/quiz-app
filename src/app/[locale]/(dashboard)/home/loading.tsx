export default function HomeLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Greeting with avatar */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-5 w-40 bg-muted rounded" />
        </div>
      </div>

      {/* Invitations block (optional) */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-24 bg-muted rounded-2xl" />
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-16 bg-muted rounded-2xl" />
        <div className="h-16 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
