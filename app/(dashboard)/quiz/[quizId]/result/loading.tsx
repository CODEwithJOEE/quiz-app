export default function ResultLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Quiz title */}
      <div className="text-center space-y-2">
        <div className="h-5 w-40 bg-muted rounded mx-auto" />
        <div className="h-3 w-32 bg-muted rounded mx-auto" />
      </div>

      {/* Result card (score card) */}
      <div className="h-72 bg-muted rounded-2xl" />

      {/* Info card (status + submitted) */}
      <div className="h-24 bg-muted rounded-2xl" />

      {/* Back button */}
      <div className="h-12 bg-muted rounded-2xl" />
    </div>
  );
}
