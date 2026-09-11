export default function RoomsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-32 bg-muted rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
