export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import CreateQuizForm from "./CreateQuizForm";

export default async function NewQuizPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect("/rooms");

  return (
    <div className="space-y-5">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Link
          href={`/rooms/${roomId}`}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label="Back to room"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">Create New Quiz</h1>
          <p className="text-xs text-muted-foreground">
            Fill in the details below
          </p>
        </div>
      </div>

      <CreateQuizForm roomId={roomId} />
    </div>
  );
}
