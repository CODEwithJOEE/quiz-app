export const dynamic = "force-dynamic";

import { getCurrentProfile } from "@/lib/auth";
import { getStudentInvitations } from "@/lib/rooms";
import { createClient } from "@/lib/supabase/server";
import { redirect, Link } from "@/i18n/navigation";
import {
  GraduationCap,
  DoorOpen,
  Settings,
  ArrowRight,
  Inbox,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Avatar from "@/components/Avatar";
import InvitationCard from "./InvitationCard";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const t = await getTranslations("Home");

  const invitations =
    me.role === "student" ? await getStudentInvitations(me.id) : [];

  const greetingKey = getGreetingKey();
  const initials = me.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  let signedAvatarUrl: string | null = null;
  if (me.avatar_url && !me.avatar_pending) {
    const supabase = await createClient();
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(me.avatar_url, 3600);
    signedAvatarUrl = data?.signedUrl ?? null;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <Avatar
          url={signedAvatarUrl}
          initials={initials}
          size="lg"
          pending={me.avatar_pending}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t(greetingKey)},</p>
          <p className="font-semibold text-lg truncate">{me.full_name}</p>
        </div>
      </div>

      {/* Invitations */}
      {me.role === "student" && invitations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">{t("roomInvitations")}</h2>
            <Badge variant="info">{invitations.length}</Badge>
          </div>
          <div className="space-y-3">
            {invitations.map((inv: any) => (
              <InvitationCard key={inv.id} invitation={inv} />
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {t("quickActions")}
        </h2>

        {me.role === "super_admin" && (
          <QuickLink
            href={`/admin/users?from=${encodeURIComponent("/home")}`}
            locale={locale}
            icon={<Settings className="w-5 h-5" />}
            title={t("manageUsers")}
            description={t("manageUsersDesc")}
            color="purple"
          />
        )}

        {me.role === "teacher" && (
          <>
            <QuickLink
              href="/students"
              locale={locale}
              icon={<GraduationCap className="w-5 h-5" />}
              title={t("myStudents")}
              description={t("myStudentsDesc")}
              color="blue"
            />
            <QuickLink
              href="/rooms"
              locale={locale}
              icon={<DoorOpen className="w-5 h-5" />}
              title={t("myRooms")}
              description={t("myRoomsDesc")}
              color="blue"
            />
          </>
        )}

        {me.role === "student" && (
          <>
            <QuickLink
              href="/rooms"
              locale={locale}
              icon={<DoorOpen className="w-5 h-5" />}
              title={t("myRooms")}
              description={t("myRoomsStudentDesc")}
              color="blue"
            />
            <QuickLink
              href="/history"
              locale={locale}
              icon={<History className="w-5 h-5" />}
              title={t("quizHistory")}
              description={t("quizHistoryDesc")}
              color="purple"
            />
          </>
        )}
      </div>
    </div>
  );
}

function getGreetingKey():
  | "greetingMorning"
  | "greetingAfternoon"
  | "greetingEvening" {
  const h = new Date().getHours();
  if (h < 12) return "greetingMorning";
  if (h < 18) return "greetingAfternoon";
  return "greetingEvening";
}

function QuickLink({
  href,
  icon,
  title,
  description,
  color = "blue",
  locale,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "blue" | "purple";
  locale?: string;
}) {
  const colorClasses =
    color === "purple"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

  return (
    <Link
      href={href}
      locale={locale}
      className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className={`w-10 h-10 rounded-xl ${colorClasses} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}
