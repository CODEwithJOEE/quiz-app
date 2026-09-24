export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  FileText,
  ClipboardList,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { attachSignedAvatarUrls } from "@/lib/avatars";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import InviteStudentsPanel from "./InviteStudentsPanel";
import DeleteRoomButton from "./DeleteRoomButton";
import QuizStatusBadge from "@/components/QuizStatusBadge";
import EditRoomModal from "./EditRoomModal";
import Collapsible from "@/components/ui/Collapsible";
import RoomStudentsSection from "./RoomStudentsSection";
import ClassmatesSection from "./ClassmatesSection";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; roomId: string }>;
}) {
  const { locale, roomId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("RoomDetail");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("id, name, subject, description, teacher_id")
    .eq("id", roomId)
    .single();

  if (!room) notFound();
  const isOwner = room.teacher_id === me.id;

  // =====================================================
  // FETCH MEMBERS
  // =====================================================
  const { data: members } = await supabase
    .from("room_members")
    .select(
      `
      id, status, invited_at, joined_at,
      profiles:student_id ( id, full_name, email, grade_level, section, avatar_url, avatar_pending )
    `,
    )
    .eq("room_id", roomId)
    .order("invited_at", { ascending: false });

  const memberIds = new Set((members ?? []).map((m: any) => m.profiles?.id));

  // =====================================================
  // FETCH AVAILABLE STUDENTS
  // =====================================================
  let myStudents: any[] = [];
  let allStudents: any[] = [];

  if (isOwner) {
    const { data: ownStudents } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, grade_level, section, created_by, avatar_url, avatar_pending",
      )
      .eq("role", "student")
      .eq("created_by", me.id)
      .order("full_name");

    myStudents = (ownStudents ?? []).filter((s: any) => !memberIds.has(s.id));

    const { data: everyone } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, grade_level, section, created_by, avatar_url, avatar_pending",
      )
      .eq("role", "student")
      .order("full_name");

    allStudents = (everyone ?? []).filter((s: any) => !memberIds.has(s.id));
  }

  // =====================================================
  // BATCH GENERATE SIGNED AVATAR URLs
  // =====================================================
  const allProfiles = [
    ...(members ?? []).map((m: any) => m.profiles).filter(Boolean),
    ...myStudents,
    ...allStudents,
  ];

  const uniqueProfiles = Array.from(
    new Map(allProfiles.map((p: any) => [p.id, p])).values(),
  );
  const profilesWithUrls = await attachSignedAvatarUrls(uniqueProfiles);

  const urlMap = new Map<string, string | null>(
    profilesWithUrls.map((p: any) => [p.id, p.signedAvatarUrl]),
  );

  const membersWithUrls = (members ?? []).map((m: any) => ({
    ...m,
    profiles: m.profiles
      ? { ...m.profiles, signedAvatarUrl: urlMap.get(m.profiles.id) ?? null }
      : null,
  }));

  const myStudentsWithUrls = myStudents.map((s: any) => ({
    ...s,
    signedAvatarUrl: urlMap.get(s.id) ?? null,
  }));

  const allStudentsWithUrls = allStudents.map((s: any) => ({
    ...s,
    signedAvatarUrl: urlMap.get(s.id) ?? null,
  }));

  const accepted = membersWithUrls.filter((m: any) => m.status === "accepted");
  const pending = membersWithUrls.filter((m: any) => m.status === "pending");

  // =====================================================
  // FETCH QUIZZES
  // =====================================================
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, description, status, created_at, published_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  let visibleQuizzes = quizzes ?? [];
  if (!isOwner) {
    visibleQuizzes = visibleQuizzes.filter(
      (q: any) => q.status === "published",
    );
  }

  return (
    <div className="space-y-5">
      {/* Back + Room header */}
      <div className="flex items-center gap-2">
        <Link
          href="/rooms"
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label={t("backToRoom")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{room.name}</h1>
          {room.subject && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              {room.subject}
            </div>
          )}
        </div>
        {isOwner && (
          <EditRoomModal
            roomId={room.id}
            initialName={room.name}
            initialSubject={room.subject}
            initialDescription={room.description}
          />
        )}
      </div>

      {/* Description */}
      {room.description && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{room.description}</p>
        </Card>
      )}

      {/* Quizzes */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-brand" />
            <h2 className="font-semibold">
              {isOwner ? t("quizzes") : t("availableQuizzes")}
            </h2>
            <Badge>{visibleQuizzes.length}</Badge>
          </div>
          {isOwner && (
            <Link href={`/rooms/${room.id}/quizzes/new`}>
              <Button size="sm">
                <Plus className="w-4 h-4" />
                {t("newQuiz")}
              </Button>
            </Link>
          )}
        </div>

        {visibleQuizzes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={isOwner ? t("noQuizzes") : t("noQuizzesStudentDesc")}
            description={
              isOwner ? t("noQuizzesOwnerDesc") : t("noQuizzesStudentDesc")
            }
          />
        ) : (
          <ul className="space-y-2">
            {visibleQuizzes.map((q: any) => (
              <li key={q.id}>
                <Link
                  href={`/quiz/${q.id}`}
                  className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{q.title}</p>
                      {q.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {q.description}
                        </p>
                      )}
                    </div>
                    {isOwner && <QuizStatusBadge status={q.status} />}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Teacher: members & invite */}
      {isOwner && (
        <>
          <Collapsible
            title={t("inviteStudents")}
            icon={<UserPlus className="w-4 h-4 text-brand" />}
            count={myStudentsWithUrls.length + allStudentsWithUrls.length}
            badge={
              <Badge>
                {myStudentsWithUrls.length + allStudentsWithUrls.length}
              </Badge>
            }
          >
            <InviteStudentsPanel
              roomId={room.id}
              availableStudents={myStudentsWithUrls}
              allStudents={allStudentsWithUrls}
              currentUserId={me.id}
            />
          </Collapsible>

          <RoomStudentsSection
            roomId={room.id}
            accepted={accepted}
            pending={pending}
            currentUserId={me.id}
          />

          <DeleteRoomButton roomId={room.id} />
        </>
      )}

      {/* Student: classmates */}
      {!isOwner && (
        <ClassmatesSection
          classmates={accepted
            .filter((m: any) => m.profiles?.id !== me.id)
            .map((m: any) => m.profiles)
            .filter(Boolean)}
        />
      )}
    </div>
  );
}
