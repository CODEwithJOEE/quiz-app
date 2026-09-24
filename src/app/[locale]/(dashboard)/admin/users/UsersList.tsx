"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, Users, Shield, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Collapsible from "@/components/ui/Collapsible";
import UserRow from "./UserRow";

type Role = "super_admin" | "teacher" | "student" | "all";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "teacher" | "student";
  created_at: string;
  grade_level?: string | null;
  section?: string | null;
  avatar_url?: string | null;
  avatar_pending?: boolean | null;
  signedAvatarUrl?: string | null;
  deletion_scheduled_for?: string | null;
};

export default function UsersList({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const t = useTranslations("UsersList");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role>("all");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const counts = useMemo(
    () => ({
      all: users.length,
      super_admin: users.filter((u) => u.role === "super_admin").length,
      teacher: users.filter((u) => u.role === "teacher").length,
      student: users.filter((u) => u.role === "student").length,
    }),
    [users],
  );

  const admins = filtered.filter((u) => u.role === "super_admin");
  const teachers = filtered.filter((u) => u.role === "teacher");
  const students = filtered.filter((u) => u.role === "student");

  const hasFilters = search || roleFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <button
            onClick={() => setShowFilter((s) => !s)}
            className={`h-10 px-3 rounded-xl border transition-colors flex items-center gap-1.5 text-sm font-medium shrink-0 ${
              roleFilter !== "all"
                ? "border-brand bg-blue-50 dark:bg-blue-950 text-brand"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Filter className="w-4 h-4" />
            {roleFilter === "all"
              ? t("filter")
              : roleFilter === "super_admin"
                ? t("admins")
                : roleFilter === "teacher"
                  ? t("teachers")
                  : t("students")}
          </button>
        </div>

        {showFilter && (
          <div className="bg-card rounded-xl border border-border p-2 space-y-1">
            {[
              { value: "all" as Role, label: t("allUsers"), count: counts.all },
              {
                value: "super_admin" as Role,
                label: t("admins"),
                count: counts.super_admin,
              },
              {
                value: "teacher" as Role,
                label: t("teachers"),
                count: counts.teacher,
              },
              {
                value: "student" as Role,
                label: t("students"),
                count: counts.student,
              },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setRoleFilter(opt.value);
                  setShowFilter(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  roleFilter === opt.value
                    ? "bg-brand text-brand-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-xs ${
                    roleFilter === opt.value
                      ? "text-brand-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {hasFilters && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t("showing")}{" "}
              <b className="text-foreground">{filtered.length}</b> {t("of")}{" "}
              {users.length}
            </span>
            <button
              onClick={resetFilters}
              className="text-brand hover:underline font-medium"
            >
              {t("resetFilters")}
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Users}
          title={users.length === 0 ? t("noUsers") : t("noMatch")}
          description={users.length === 0 ? t("noUsersDesc") : t("noMatchDesc")}
        />
      )}

      {admins.length > 0 && (
        <Collapsible
          title={t("admins")}
          icon={
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          }
          count={admins.length}
          badge={<Badge variant="danger">{admins.length}</Badge>}
          defaultOpen={true}
        >
          <ul className="space-y-2">
            {admins.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={currentUserId} />
            ))}
          </ul>
        </Collapsible>
      )}

      {teachers.length > 0 && (
        <Collapsible
          title={t("teachers")}
          icon={
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          }
          count={teachers.length}
          badge={<Badge variant="info">{teachers.length}</Badge>}
          defaultOpen={true}
        >
          <ul className="space-y-2">
            {teachers.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={currentUserId} />
            ))}
          </ul>
        </Collapsible>
      )}

      {students.length > 0 && (
        <Collapsible
          title={t("students")}
          icon={
            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
          }
          count={students.length}
          badge={<Badge variant="success">{students.length}</Badge>}
          defaultOpen={true}
        >
          <ul className="space-y-2">
            {students.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={currentUserId} />
            ))}
          </ul>
        </Collapsible>
      )}
    </div>
  );
}
