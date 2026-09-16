export default function RoomDetailLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header with back button + room name */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-muted rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
      </div>

      {/* Description card */}
      <div className="h-16 bg-muted rounded-2xl" />

      {/* Quizzes section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded-xl" />
        </div>
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
      </div>

      {/* Members section */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-16 bg-muted rounded-2xl" />
        <div className="h-16 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
