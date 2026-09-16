export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Shield,
  GraduationCap,
  DoorOpen,
  ClipboardList,
  Target,
  AlertTriangle,
  Camera,
  Trash2,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getDashboardData } from "./actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

// Helper to build back href
const backFrom = (path: string) => encodeURIComponent(path);

export default async function AdminDashboardPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  if (me.role !== "super_admin") redirect("/home");

  const data = await getDashboardData();
  if (!data.ok) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Hindi ma-load ang dashboard data.
        </p>
      </Card>
    );
  }

  const { stats, recentUsers, recentQuizzes, recentIntegrityEvents } = data;
  const dashboardPath = backFrom("/admin/dashboard");
  const adminUsersLink = `/admin/users?from=${dashboardPath}`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">System overview</p>
      </div>

      {/* USER STATS */}
      <div className="space-y-3">
        <SectionHeader icon={Users} title="Users" />
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label="Admins"
            value={stats.admins}
            tone="purple"
            href={`/admin/users?role=super_admin&from=${dashboardPath}`}
          />
          <StatCard
            icon={<GraduationCap className="w-4 h-4" />}
            label="Teachers"
            value={stats.teachers}
            tone="blue"
            href={`/admin/users?role=teacher&from=${dashboardPath}`}
          />
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Students"
            value={stats.students}
            tone="green"
            href={`/admin/users?role=student&from=${dashboardPath}`}
          />
        </div>
      </div>

      {/* CONTENT STATS */}
      <div className="space-y-3">
        <SectionHeader icon={TrendingUp} title="Content" />
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon={<DoorOpen className="w-4 h-4" />}
            label="Rooms"
            value={stats.rooms}
            tone="gray"
          />
          <StatCard
            icon={<ClipboardList className="w-4 h-4" />}
            label="Quizzes"
            value={stats.quizzes}
            tone="gray"
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Attempts"
            value={stats.attempts}
            tone="gray"
          />
        </div>
      </div>

      {/* FLAGS */}
      {(stats.pendingDeletions > 0 || stats.pendingPhotos > 0) && (
        <div className="space-y-3">
          <SectionHeader icon={AlertTriangle} title="Needs Attention" />
          <div className="space-y-2">
            {stats.pendingDeletions > 0 && (
              <Link href={adminUsersLink} className="block">
                <Card className="p-4 hover:border-red-300 dark:hover:border-red-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Pending Deletions</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.pendingDeletions} account(s) scheduled for
                        deletion
                      </p>
                    </div>
                    <Badge variant="danger">{stats.pendingDeletions}</Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            )}

            {stats.pendingPhotos > 0 && (
              <Link href={adminUsersLink} className="block">
                <Card className="p-4 hover:border-amber-300 dark:hover:border-amber-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        Pending Photo Approvals
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.pendingPhotos} photo(s) waiting for approval
                      </p>
                    </div>
                    <Badge variant="warning">{stats.pendingPhotos}</Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY */}
      <div className="space-y-3">
        <SectionHeader icon={Activity} title="Recent Activity" />

        {/* Recent users */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">New Users</h3>
            <Link
              href={adminUsersLink}
              className="text-xs text-brand hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Wala pang recent users.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentUsers.map((u: any) => (
                <li key={u.id} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                      u.role === "teacher"
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        : u.role === "super_admin"
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                          : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                    }`}
                  >
                    {u.full_name
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{u.full_name}</p>
                    <p className="text-muted-foreground truncate text-[10px]">
                      {u.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      u.role === "teacher"
                        ? "info"
                        : u.role === "super_admin"
                          ? "danger"
                          : "success"
                    }
                  >
                    {u.role === "teacher"
                      ? "Teacher"
                      : u.role === "super_admin"
                        ? "Admin"
                        : "Student"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent quizzes */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Recently Published Quizzes</h3>
          </div>
          {recentQuizzes.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Wala pang published quizzes.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentQuizzes.map((q: any) => (
                <li key={q.id} className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ClipboardList className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{q.title}</p>
                    <p className="text-muted-foreground truncate text-[10px]">
                      {q.rooms?.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* INTEGRITY EVENTS */}
      {recentIntegrityEvents.length > 0 && (
        <div className="space-y-3">
          <SectionHeader icon={AlertTriangle} title="Recent Violations" />
          <Card className="p-4">
            <ul className="space-y-2">
              {recentIntegrityEvents.map((ev: any) => (
                <li key={ev.id} className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {ev.attempts?.profiles?.full_name ?? "Unknown"}
                    </p>
                    <p className="text-muted-foreground truncate text-[10px]">
                      {ev.event_type} • {ev.attempts?.quizzes?.title}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-[10px] shrink-0">
                    {new Date(ev.occurred_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* QUICK LINKS */}
      <div className="space-y-3">
        <SectionHeader icon={ArrowRight} title="Quick Links" />
        <Link href={adminUsersLink} className="block">
          <Card className="p-4 hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Manage Users</p>
                  <p className="text-xs text-muted-foreground">
                    Create, edit, at manage accounts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// =====================================================
// Helpers
// =====================================================

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <Icon className="w-4 h-4 text-brand" />
      <h2 className="font-semibold text-sm">{title}</h2>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "purple" | "blue" | "green" | "gray";
  href?: string;
}) {
  const tones = {
    purple:
      "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    gray: "bg-muted text-foreground",
  };

  const content = (
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

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
