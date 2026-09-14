export const dynamic = "force-dynamic";

import { Users, Shield, GraduationCap, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import CreateUserForm from "@/components/CreateUserForm";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import DeleteStudentModal from "@/app/(dashboard)/students/DeleteStudentModal";
import PendingDeletionCard from "@/app/(dashboard)/students/PendingDeletionCard";

export default async function AdminUsersPage() {
  const me = await getCurrentProfile();
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, created_at, deletion_scheduled_for, deleted_at",
    )
    .order("created_at", { ascending: false });

  const all = users ?? [];
  const active = all.filter((u) => !u.deletion_scheduled_for);
  const pendingDeletion = all.filter((u) => u.deletion_scheduled_for);

  const teachers = active.filter((u) => u.role === "teacher");
  const students = active.filter((u) => u.role === "student");
  const admins = active.filter((u) => u.role === "super_admin");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">User Management</h1>
        <p className="text-xs text-muted-foreground">
          Manage teachers and students
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={<Shield className="w-4 h-4" />}
          label="Admins"
          value={admins.length}
          tone="purple"
        />
        <StatCard
          icon={<GraduationCap className="w-4 h-4" />}
          label="Teachers"
          value={teachers.length}
          tone="blue"
        />
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Students"
          value={students.length}
          tone="green"
        />
      </div>

      <CreateUserForm allowedRoles={["teacher", "student"]} />

      {/* Pending Deletion */}
      {pendingDeletion.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h2 className="font-semibold text-red-700 dark:text-red-300">
              Pending Deletion
            </h2>
            <Badge variant="danger">{pendingDeletion.length}</Badge>
          </div>
          <ul className="space-y-2">
            {pendingDeletion.map((u) => (
              <PendingDeletionCard key={u.id} student={u} />
            ))}
          </ul>
        </div>
      )}

      {/* All Users */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">All Users</h2>
          <Badge>{active.length}</Badge>
        </div>

        {active.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Wala pang users"
            description="Create your first user above."
          />
        ) : (
          <ul className="space-y-2">
            {active.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={me?.id ?? ""} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "purple" | "blue" | "green";
}) {
  const tones = {
    purple:
      "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
  };

  return (
    <div className={`p-3 rounded-2xl ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 opacity-80">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function UserRow({
  user,
  currentUserId,
}: {
  user: any;
  currentUserId: string;
}) {
  const roleConfig = {
    super_admin: {
      label: "Admin",
      variant: "danger" as const,
      icon: Shield,
      color:
        "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    },
    teacher: {
      label: "Teacher",
      variant: "info" as const,
      icon: GraduationCap,
      color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    },
    student: {
      label: "Student",
      variant: "success" as const,
      icon: Users,
      color:
        "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
    },
  }[user.role as "super_admin" | "teacher" | "student"];

  const Icon = roleConfig.icon;
  const initials = user.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showActions = user.role !== "super_admin" && user.id !== currentUserId;

  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border shadow-sm">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${roleConfig.color}`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.full_name}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <Badge variant={roleConfig.variant}>
        <Icon className="w-3 h-3" />
        {roleConfig.label}
      </Badge>
      {showActions && (
        <div className="flex items-center gap-1 shrink-0">
          <ResetPasswordModal
            studentId={user.id}
            studentName={user.full_name}
            studentEmail={user.email}
          />
          <DeleteStudentModal
            studentId={user.id}
            studentName={user.full_name}
            studentEmail={user.email}
          />
        </div>
      )}
    </li>
  );
}
