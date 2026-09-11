import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import CreateRoomForm from "./CreateRoomForm";

export default async function NewRoomPage() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect("/rooms");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link
          href="/rooms"
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold">Create Room</h1>
      </div>

      <CreateRoomForm />
    </div>
  );
}
