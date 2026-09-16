export default function RoomsListLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header with "+ New Room" button placeholder */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded-lg" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
        <div className="h-9 w-28 bg-muted rounded-xl" />
      </div>

      {/* Room cards */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
