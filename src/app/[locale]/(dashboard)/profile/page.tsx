export const dynamic = "force-dynamic";

import { getCurrentProfile } from "@/lib/auth";
import { redirect, Link } from "@/i18n/navigation";
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
  Camera,
  Globe,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import EditNameModal from "./EditNameModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { getProfileStats } from "./actions";
import Avatar from "@/components/Avatar";
import AvatarUpload from "./AvatarUpload";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { setRequestLocale, getTranslations } from "next-intl/server";

const APP_VERSION = "1.0.0";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Profile");
  const tRoles = await getTranslations("Roles");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const stats = await getProfileStats();

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

  let signedAvatarUrl: string | null = null;
  if (me.avatar_url) {
    const supabase = await createClient();
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(me.avatar_url, 3600);
    signedAvatarUrl = data?.signedUrl ?? null;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">{t("title")}</h1>

      {/* Profile card */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar
            url={signedAvatarUrl}
            initials={initials}
            size="xl"
            pending={me.avatar_pending}
          />
          <div className="space-y-1">
            <p className="font-semibold text-lg">{me.full_name}</p>
            <Badge variant={roleVariant[me.role]}>
              <Shield className="w-3 h-3" />
              {tRoles(me.role)}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <EditNameModal currentName={me.full_name} />
            <AvatarUpload
              currentUrl={me.avatar_url}
              pending={me.avatar_pending}
              rejectedReason={me.avatar_rejected_reason}
              role={me.role}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      {stats && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">{t("yourStats")}</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {me.role === "teacher" && (
              <>
                <StatBox
                  icon={<DoorOpen className="w-3.5 h-3.5" />}
                  label={t("rooms")}
                  value={(stats as any).rooms ?? 0}
                />
                <StatBox
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  label={t("students")}
                  value={(stats as any).students ?? 0}
                />
                <StatBox
                  icon={<ClipboardList className="w-3.5 h-3.5" />}
                  label={t("quizzes")}
                  value={(stats as any).quizzes ?? 0}
                />
              </>
            )}

            {me.role === "student" && (
              <>
                <StatBox
                  icon={<DoorOpen className="w-3.5 h-3.5" />}
                  label={t("rooms")}
                  value={(stats as any).rooms ?? 0}
                />
                <StatBox
                  icon={<ClipboardList className="w-3.5 h-3.5" />}
                  label={t("quizzes")}
                  value={(stats as any).quizzes ?? 0}
                />
                <StatBox
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  label={t("avgScore")}
                  value={`${(stats as any).avgScore ?? 0}%`}
                />
              </>
            )}

            {me.role === "super_admin" && (
              <div className="col-span-3">
                <StatBox
                  icon={<Users className="w-3.5 h-3.5" />}
                  label={t("yourStats")}
                  value={(stats as any).users ?? 0}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Student Photos — teacher only */}
      {me.role === "teacher" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Camera className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">{t("studentPhotos")}</h2>
          </div>
          <Link href="/pending-photos" locale={locale} className="block">
            <Card className="p-4 hover:border-brand/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {t("reviewPendingPhotos")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("approveOrReject")}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* My Progress — Student only */}
      {me.role === "student" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <HistoryIcon className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">{t("myProgress")}</h2>
          </div>
          <Link href="/history" locale={locale} className="block">
            <Card className="p-4 hover:border-brand/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t("quizHistory")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("myProgress")}
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
            <h2 className="font-semibold text-sm">{t("accountInfo")}</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <InfoRow
            icon={<Mail className="w-4 h-4" />}
            label={t("email")}
            value={me.email}
          />
          <InfoRow
            icon={<Shield className="w-4 h-4" />}
            label={t("role")}
            value={tRoles(me.role)}
          />
        </div>
        {me.role === "student" && (me.grade_level || me.section) && (
          <>
            {me.grade_level && (
              <InfoRow
                icon={<GraduationCap className="w-4 h-4" />}
                label={t("gradeLevel")}
                value={me.grade_level}
              />
            )}
            {me.section && (
              <InfoRow
                icon={<Users className="w-4 h-4" />}
                label={t("section")}
                value={me.section}
              />
            )}
          </>
        )}
      </Card>

      {/* Security */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Shield className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">{t("security")}</h2>
        </div>
        <ChangePasswordModal />
      </div>

      {/* Appearance */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Palette className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">{t("appearance")}</h2>
        </div>
        <Card className="p-4">
          <ThemeToggle />
        </Card>

        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Globe className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">{t("language")}</h2>
          </div>
          <Card className="p-4">
            <LanguageSwitcher />
          </Card>
        </div>
      </div>

      {/* Help */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <HelpCircle className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">{t("help")}</h2>
        </div>
        <Link href="/help" locale={locale} className="block">
          <Card className="p-4 hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("documentation")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("guidesAndFaqs")}
                </p>
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
          <h2 className="font-semibold text-sm">{t("about")}</h2>
        </div>
        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Quiz App</p>
              <p className="text-xs text-muted-foreground">
                {t("version")} {APP_VERSION}
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
