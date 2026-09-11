export default function AttemptsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="h-10 bg-muted rounded-xl" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-muted rounded-2xl" />
      ))}
    </div>
  );
}
