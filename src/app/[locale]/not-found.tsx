import { Link } from "@/i18n/navigation";
import { Home, Search } from "lucide-react";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Hindi nahanap ang page na hinahanap mo. Baka na-delete, naka-close, o
        wala na sa system.
      </p>
      <div className="flex gap-2">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 bg-muted text-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-border transition-colors"
        >
          Rooms
        </Link>
      </div>
    </div>
  );
}
