export const dynamic = "force-dynamic";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { attachSignedAvatarUrls } from "@/lib/avatars";
import CreateUserForm from "@/components/CreateUserForm";
import BulkImportModal from "./BulkImportModal";
import StudentsList from "./StudentsList";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function TeacherStudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Students");

  const me = await getCurrentProfile();

  if (!me) return redirect({ href: "/login", locale });
  if (me.role !== "teacher") return redirect({ href: "/home", locale });

  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, created_at, grade_level, section, avatar_url, avatar_pending, deletion_scheduled_for",
    )
    .eq("role", "student")
    .eq("created_by", me.id)
    .order("created_at", { ascending: false });

  const withAvatars = await attachSignedAvatarUrls(students ?? []);

  const activeStudents = withAvatars.filter((s) => !s.deletion_scheduled_for);
  const pendingDeletion = withAvatars.filter((s) => s.deletion_scheduled_for);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">
            {pendingDeletion.length > 0
              ? t("subtitleWithPending", {
                  active: activeStudents.length,
                  pending: pendingDeletion.length,
                })
              : t("subtitle", { active: activeStudents.length })}
          </p>
        </div>
        <BulkImportModal />
      </div>

      <CreateUserForm allowedRoles={["student"]} />

      <StudentsList
        activeStudents={activeStudents}
        pendingDeletion={pendingDeletion}
      />
    </div>
  );
}
