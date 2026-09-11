import { Users, Shield, GraduationCap, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CreateUserForm from "@/components/CreateUserForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  // Group by role
  const teachers = (users ?? []).filter((u) => u.role === "teacher");
  const students = (users ?? []).filter((u) => u.role === "student");
  const admins = (users ?? []).filter((u) => u.role === "super_admin");

  return (
    <div className="space-y-5">
      {/* Header */}
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

      {/* Create user form */}
      <CreateUserForm allowedRoles={["teacher", "student"]} />

      {/* All users */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">All Users</h2>
          <Badge>{users?.length ?? 0}</Badge>
        </div>

        {!users || users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Wala pang users"
            description="Create your first user above."
          />
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
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

function UserRow({ user }: { user: any }) {
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
    </li>
  );
}
