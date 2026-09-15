export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Camera, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import PendingPhotoCard from "./PendingPhotoCard";

export default async function PendingPhotosPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  if (me.role !== "teacher" && me.role !== "super_admin") {
    redirect("/home");
  }

  const supabase = await createClient();

  // Get students with pending avatars
  let query = supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, avatar_uploaded_at, created_by")
    .eq("avatar_pending", true)
    .not("avatar_url", "is", null)
    .order("avatar_uploaded_at", { ascending: false });

  if (me.role === "teacher") {
    query = query.eq("created_by", me.id);
  }

  const { data: pendingStudents } = await query;

  // Generate signed URLs for each
  const studentsWithUrls = await Promise.all(
    (pendingStudents ?? []).map(async (s) => {
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(s.avatar_url!, 3600);
      return {
        ...s,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Pending Photos</h1>
        <p className="text-xs text-muted-foreground">
          Review student profile photos
        </p>
      </div>

      {studentsWithUrls.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Walang pending photos"
          description="Wala pang students na nag-upload ng photo."
        />
      ) : (
        <ul className="space-y-3">
          {studentsWithUrls.map((s) => (
            <PendingPhotoCard key={s.id} student={s} />
          ))}
        </ul>
      )}
    </div>
  );
}
