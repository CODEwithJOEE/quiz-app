export default function QuizLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Quiz header card */}
      <div className="bg-card p-5 rounded-2xl space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-muted rounded-xl" />
          <div className="h-16 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Tabs */}
      <div className="h-10 bg-muted rounded-2xl" />

      {/* Question card */}
      <div className="h-48 bg-muted rounded-2xl" />
      <div className="h-48 bg-muted rounded-2xl" />
    </div>
  );
}
