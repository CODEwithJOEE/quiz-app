export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import CreateRoomForm from "./CreateRoomForm";

export default async function NewRoomPage() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect("/rooms");

  return (
    <div className="space-y-5">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Link
          href="/rooms"
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label="Back to rooms"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">Create Room</h1>
          <p className="text-xs text-muted-foreground">
            Organize students into sections
          </p>
        </div>
      </div>

      <CreateRoomForm />
    </div>
  );
}
