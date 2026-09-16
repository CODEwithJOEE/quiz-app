export const dynamic = "force-dynamic";

import { getCurrentProfile } from "@/lib/auth";
import { getStudentInvitations } from "@/lib/rooms";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
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

export default async function HomePage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const invitations =
    me.role === "student" ? await getStudentInvitations(me.id) : [];

  const greeting = getGreeting();
  const initials = me.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ✅ Generate signed URL for own avatar
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
          <p className="text-xs text-muted-foreground">{greeting},</p>
          <p className="font-semibold text-lg truncate">{me.full_name}</p>
        </div>
      </div>

      {/* Invitations (student) — show only kung may pending */}
      {me.role === "student" && invitations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-sm">Room Invitations</h2>
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
          Quick Actions
        </h2>

        {me.role === "super_admin" && (
          <QuickLink
            href="/admin/users"
            icon={<Settings className="w-5 h-5" />}
            title="Manage Users"
            description="Create teachers & students"
            color="purple"
          />
        )}

        {me.role === "teacher" && (
          <>
            <QuickLink
              href="/students"
              icon={<GraduationCap className="w-5 h-5" />}
              title="My Students"
              description="Add and manage students"
              color="blue"
            />
            <QuickLink
              href="/rooms"
              icon={<DoorOpen className="w-5 h-5" />}
              title="My Rooms"
              description="Create rooms & quizzes"
              color="blue"
            />
          </>
        )}

        {me.role === "student" && (
          <>
            <QuickLink
              href="/rooms"
              icon={<DoorOpen className="w-5 h-5" />}
              title="My Rooms"
              description="View your classes"
              color="blue"
            />
            {/* ✅ BAGO — nasa labas na ng invitations block */}
            <QuickLink
              href="/history"
              icon={<History className="w-5 h-5" />}
              title="Quiz History"
              description="Tingnan ang past attempts at scores"
              color="purple"
            />
          </>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function QuickLink({
  href,
  icon,
  title,
  description,
  color = "blue",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "blue" | "purple";
}) {
  const colorClasses =
    color === "purple"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

  return (
    <Link
      href={href}
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
