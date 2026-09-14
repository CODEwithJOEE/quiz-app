export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { GraduationCap, Users, Mail, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import CreateUserForm from "@/components/CreateUserForm";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import BulkImportModal from "./BulkImportModal";
import DeleteStudentModal from "./DeleteStudentModal";
import PendingDeletionCard from "./PendingDeletionCard";

export default async function TeacherStudentsPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  if (me.role !== "teacher") redirect("/home");

  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, created_at, deletion_scheduled_for, deleted_at",
    )
    .eq("role", "student")
    .eq("created_by", me.id)
    .order("created_at", { ascending: false });

  const list = students ?? [];
  const active = list.filter((s) => !s.deletion_scheduled_for);
  const pendingDeletion = list.filter((s) => s.deletion_scheduled_for);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">My Students</h1>
          <p className="text-xs text-muted-foreground">
            {active.length} active
            {pendingDeletion.length > 0 &&
              ` • ${pendingDeletion.length} pending deletion`}
          </p>
        </div>
        <BulkImportModal />
      </div>

      {/* Create form */}
      <CreateUserForm allowedRoles={["student"]} />

      {/* Pending Deletion Section */}
      {pendingDeletion.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h2 className="font-semibold text-red-700 dark:text-red-300">
              Pending Deletion
            </h2>
            <Badge variant="danger">{pendingDeletion.length}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Accounts below are scheduled for permanent deletion. Restore within
            7 days.
          </p>
          <ul className="space-y-2">
            {pendingDeletion.map((s) => (
              <PendingDeletionCard key={s.id} student={s} />
            ))}
          </ul>
        </div>
      )}

      {/* Active Students */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">Active Students</h2>
          <Badge>{active.length}</Badge>
        </div>

        {active.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Wala pang active students"
            description="Create your first student above."
          />
        ) : (
          <ul className="space-y-2">
            {active.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: any }) {
  const initials = student.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border shadow-sm">
      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 flex items-center justify-center font-bold text-xs shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.full_name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span className="truncate">{student.email}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ResetPasswordModal
          studentId={student.id}
          studentName={student.full_name}
          studentEmail={student.email}
        />
        <DeleteStudentModal
          studentId={student.id}
          studentName={student.full_name}
          studentEmail={student.email}
        />
      </div>
    </li>
  );
}
