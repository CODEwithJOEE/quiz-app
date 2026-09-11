import { redirect } from "next/navigation";
import { GraduationCap, Users, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import CreateUserForm from "@/components/CreateUserForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function TeacherStudentsPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  if (me.role !== "teacher") redirect("/home");

  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("role", "student")
    .eq("created_by", me.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">My Students</h1>
        <p className="text-xs text-muted-foreground">
          {students?.length ?? 0} student
          {(students?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Create student */}
      <CreateUserForm allowedRoles={["student"]} />

      {/* Students list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">All Students</h2>
          <Badge>{students?.length ?? 0}</Badge>
        </div>

        {!students || students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Wala pang students"
            description="Create your first student above."
          />
        ) : (
          <ul className="space-y-2">
            {students.map((s) => (
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
    </li>
  );
}
