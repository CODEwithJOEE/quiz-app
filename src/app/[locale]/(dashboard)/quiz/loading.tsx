export default function QuizListLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-24 bg-muted rounded-lg" />
        <div className="h-3 w-32 bg-muted rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
