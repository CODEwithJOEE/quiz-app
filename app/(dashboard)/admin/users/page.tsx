export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Users, Shield, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { attachSignedAvatarUrls } from "@/lib/avatars";
import CreateUserForm from "@/components/CreateUserForm";
import BackButton from "@/components/BackButton";
import UsersList from "./UsersList";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "super_admin") redirect("/home");

  const { from } = await searchParams;
  const backHref = from ? decodeURIComponent(from) : "/home";

  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, created_at, grade_level, section, avatar_url, avatar_pending, deletion_scheduled_for",
    )
    .order("created_at", { ascending: false });

  const usersWithAvatars = await attachSignedAvatarUrls(users ?? []);
  const activeUsers = usersWithAvatars.filter(
    (u: any) => !u.deletion_scheduled_for,
  );

  const teachers = activeUsers.filter((u) => u.role === "teacher");
  const students = activeUsers.filter((u) => u.role === "student");
  const admins = activeUsers.filter((u) => u.role === "super_admin");

  return (
    <div className="space-y-5">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <BackButton href={backHref} ariaLabel="Back" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-xs text-muted-foreground">
            Manage teachers and students
          </p>
        </div>
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

      {/* Users list */}
      <UsersList users={activeUsers} currentUserId={me.id} />
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
