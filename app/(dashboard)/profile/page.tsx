export const dynamic = "force-dynamic";

import { getCurrentProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Palette,
  Info,
  BarChart3,
  DoorOpen,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Users,
  HelpCircle,
  History as HistoryIcon,
  ArrowRight,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import EditNameModal from "./EditNameModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { getProfileStats } from "./actions";

const APP_VERSION = "1.0.0";

export default async function ProfilePage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const stats = await getProfileStats();

  const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    teacher: "Teacher",
    student: "Student",
  };

  const roleVariant: Record<string, "info" | "success" | "danger"> = {
    super_admin: "danger",
    teacher: "info",
    student: "success",
  };

  const initials = me.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Profile</h1>

      {/* Profile card */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand/20">
            {initials}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-lg">{me.full_name}</p>
            <Badge variant={roleVariant[me.role]}>
              <Shield className="w-3 h-3" />
              {roleLabel[me.role]}
            </Badge>
          </div>
          <EditNameModal currentName={me.full_name} />
        </div>
      </Card>

      {/* Stats (role-aware) */}
      {stats && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">Your Stats</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {me.role === "teacher" && (
              <>
                <StatBox
                  icon={<DoorOpen className="w-3.5 h-3.5" />}
                  label="Rooms"
                  value={(stats as any).rooms ?? 0}
                />
                <StatBox
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  label="Students"
                  value={(stats as any).students ?? 0}
                />
                <StatBox
                  icon={<ClipboardList className="w-3.5 h-3.5" />}
                  label="Quizzes"
                  value={(stats as any).quizzes ?? 0}
                />
              </>
            )}

            {me.role === "student" && (
              <>
                <StatBox
                  icon={<DoorOpen className="w-3.5 h-3.5" />}
                  label="Rooms"
                  value={(stats as any).rooms ?? 0}
                />
                <StatBox
                  icon={<ClipboardList className="w-3.5 h-3.5" />}
                  label="Quizzes"
                  value={(stats as any).quizzes ?? 0}
                />
                <StatBox
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  label="Avg Score"
                  value={`${(stats as any).avgScore ?? 0}%`}
                />
              </>
            )}

            {me.role === "super_admin" && (
              <div className="col-span-3">
                <StatBox
                  icon={<Users className="w-3.5 h-3.5" />}
                  label="Total Users"
                  value={(stats as any).users ?? 0}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* My Progress — Student only */}
      {me.role === "student" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <HistoryIcon className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">My Progress</h2>
          </div>
          <Link href="/history" className="block">
            <Card className="p-4 hover:border-brand/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Quiz History</p>
                  <p className="text-xs text-muted-foreground">
                    Tingnan lahat ng past attempts mo
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Account Info */}
      <Card>
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">Account Info</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <InfoRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={me.email}
          />
          <InfoRow
            icon={<Shield className="w-4 h-4" />}
            label="Role"
            value={roleLabel[me.role]}
          />
        </div>
      </Card>

      {/* Security */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Shield className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">Security</h2>
        </div>
        <ChangePasswordModal />
      </div>

      {/* Appearance */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Palette className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">Appearance</h2>
        </div>
        <Card className="p-4">
          <ThemeToggle />
        </Card>
      </div>

      {/* Help */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <HelpCircle className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">Help</h2>
        </div>
        <Link href="/help" className="block">
          <Card className="p-4 hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Documentation</p>
                <p className="text-xs text-muted-foreground">Guides at FAQs</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>

      {/* About */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Info className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">About</h2>
        </div>
        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Quiz App</p>
              <p className="text-xs text-muted-foreground">
                Version {APP_VERSION}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <LogoutButton />
    </div>
  );
}

// =====================================================
// Helpers
// =====================================================

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-muted/50 rounded-xl p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
        {icon}
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
