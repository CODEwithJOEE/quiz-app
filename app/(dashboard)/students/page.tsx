export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { attachSignedAvatarUrls } from "@/lib/avatars";
import CreateUserForm from "@/components/CreateUserForm";
import BulkImportModal from "./BulkImportModal";
import StudentsList from "./StudentsList";

export default async function TeacherStudentsPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  if (me.role !== "teacher") redirect("/home");

  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, created_at, grade_level, section, avatar_url, avatar_pending, deletion_scheduled_for",
    )
    .eq("role", "student")
    .eq("created_by", me.id)
    .order("created_at", { ascending: false });

  // ✅ Generate signed URLs
  const withAvatars = await attachSignedAvatarUrls(students ?? []);

  const activeStudents = withAvatars.filter((s) => !s.deletion_scheduled_for);
  const pendingDeletion = withAvatars.filter((s) => s.deletion_scheduled_for);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">My Students</h1>
          <p className="text-xs text-muted-foreground">
            {activeStudents.length} active
            {pendingDeletion.length > 0 &&
              ` • ${pendingDeletion.length} pending deletion`}
          </p>
        </div>
        <BulkImportModal />
      </div>

      {/* Create form */}
      <CreateUserForm allowedRoles={["student"]} />

      {/* Students list */}
      <StudentsList
        activeStudents={activeStudents}
        pendingDeletion={pendingDeletion}
      />
    </div>
  );
}
