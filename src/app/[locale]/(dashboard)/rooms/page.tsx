export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { DoorOpen, Plus, Users, Clock, BookOpen, Inbox } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getTeacherRooms, getStudentRooms } from "@/lib/rooms";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // ✅ ITO ANG FIX
  setRequestLocale(locale);

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  if (me.role === "teacher" || me.role === "super_admin") {
    const rooms = await getTeacherRooms(me.id);
    return <TeacherRoomsView rooms={rooms} locale={locale} />;
  }

  const rooms = await getStudentRooms(me.id);
  return <StudentRoomsView rooms={rooms} locale={locale} />;
}

async function TeacherRoomsView({
  rooms,
  locale,
}: {
  rooms: any[];
  locale: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Rooms");

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{t("myRooms")}</h1>
          <p className="text-xs text-muted-foreground">
            {t("roomCount", { count: rooms.length })}
          </p>
        </div>
        <Link href="/rooms/new" locale={locale}>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            {t("newRoom")}
          </Button>
        </Link>
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title={t("noRooms")}
          description={t("noRoomsTeacherDesc")}
          action={
            <Link href="/rooms/new" locale={locale}>
              <Button size="sm">
                <Plus className="w-4 h-4" />
                {t("newRoom")}
              </Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {rooms.map((r) => (
            <li key={r.id}>
              <Link
                href={`/rooms/${r.id}`}
                locale={locale}
                className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <DoorOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{r.name}</p>
                      {r.subject && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <BookOpen className="w-3 h-3" />
                          {r.subject}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="success">
                      <Users className="w-3 h-3" />
                      {t("joined", { count: r.student_count })}
                    </Badge>
                    {r.pending_count > 0 && (
                      <Badge variant="warning">
                        <Clock className="w-3 h-3" />
                        {t("pending", { count: r.pending_count })}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function StudentRoomsView({
  rooms,
  locale,
}: {
  rooms: any[];
  locale: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Rooms");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">{t("myRooms")}</h1>
        <p className="text-xs text-muted-foreground">
          {t("roomCount", { count: rooms.length })}
        </p>
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t("noRooms")}
          description={t("noRoomsStudentDesc")}
        />
      ) : (
        <ul className="space-y-3">
          {rooms.map((m) => (
            <li key={m.id}>
              <Link
                href={`/rooms/${m.rooms.id}`}
                locale={locale}
                className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{m.rooms.name}</p>
                    {m.rooms.subject && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        {m.rooms.subject}
                      </div>
                    )}
                    {m.rooms.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {m.rooms.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
