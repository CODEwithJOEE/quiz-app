export default function PendingPhotosLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-40 bg-muted rounded-lg" />
        <div className="h-3 w-32 bg-muted rounded" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
