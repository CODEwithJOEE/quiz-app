export default function StudentsLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded-lg" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-xl" />
      </div>

      {/* Create form */}
      <div className="h-72 bg-muted rounded-2xl" />

      {/* Students list */}
      <div className="h-12 bg-muted rounded-2xl" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
