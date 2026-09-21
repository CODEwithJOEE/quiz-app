"use client";

import { Users, Shield, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Avatar from "@/components/Avatar";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import DeleteStudentModal from "@/app/(dashboard)/students/DeleteStudentModal";

export default function UserRow({
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
      fallbackBg:
        "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    },
    teacher: {
      label: "Teacher",
      variant: "info" as const,
      icon: GraduationCap,
      fallbackBg:
        "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    },
    student: {
      label: "Student",
      variant: "success" as const,
      icon: Users,
      fallbackBg:
        "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
    },
  }[user.role as "super_admin" | "teacher" | "student"];

  if (!roleConfig) return null;

  const Icon = roleConfig.icon;
  const initials = user.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showActions = user.role !== "super_admin" && user.id !== currentUserId;
  const hasGradeSection =
    user.role === "student" && (user.grade_level || user.section);

  return (
    <li className="p-3 bg-card rounded-2xl border border-border shadow-sm space-y-2">
      {/* Row 1: avatar + name/email + role badge */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          url={user.signedAvatarUrl}
          initials={initials}
          size="md"
          pending={user.avatar_pending ?? false}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <Badge variant={roleConfig.variant}>
          <Icon className="w-3 h-3" />
          {roleConfig.label}
        </Badge>
      </div>

      {/* Row 2: grade/section chips (left) + actions (right) */}
      {(hasGradeSection || showActions) && (
        <div className="flex items-center justify-between gap-2 pl-12">
          <div className="flex flex-wrap gap-1 min-w-0">
            {hasGradeSection && user.grade_level && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                {user.grade_level}
              </span>
            )}
            {hasGradeSection && user.section && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 whitespace-nowrap">
                {user.section}
              </span>
            )}
          </div>

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
        </div>
      )}
    </li>
  );
}
