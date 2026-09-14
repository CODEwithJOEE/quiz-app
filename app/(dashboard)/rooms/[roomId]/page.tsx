export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  DoorOpen,
  BookOpen,
  Users,
  Clock,
  Plus,
  FileText,
  ClipboardList,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import InviteStudentsPanel from "./InviteStudentsPanel";
import DeleteRoomButton from "./DeleteRoomButton";
import QuizStatusBadge from "@/components/QuizStatusBadge";
import EditRoomModal from "./EditRoomModal";
import RemoveStudentModal from "./RemoveStudentModal";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("id, name, subject, description, teacher_id")
    .eq("id", roomId)
    .single();

  if (!room) notFound();
  const isOwner = room.teacher_id === me.id;

  const { data: members } = await supabase
    .from("room_members")
    .select(
      `
      id, status, invited_at, joined_at,
      profiles:student_id ( id, full_name, email )
    `,
    )
    .eq("room_id", roomId)
    .order("invited_at", { ascending: false });

  const memberIds = new Set((members ?? []).map((m: any) => m.profiles?.id));

  let myStudents: any[] = [];
  let allStudents: any[] = [];

  if (isOwner) {
    // My students (created by me)
    const { data: ownStudents } = await supabase
      .from("profiles")
      .select("id, full_name, email, section, created_by")
      .eq("role", "student")
      .eq("created_by", me.id)
      .order("full_name");

    myStudents = (ownStudents ?? []).filter((s: any) => !memberIds.has(s.id));

    // All students (for cross-teacher invite)
    const { data: everyone } = await supabase
      .from("profiles")
      .select("id, full_name, email, section, created_by")
      .eq("role", "student")
      .order("full_name");

    allStudents = (everyone ?? []).filter((s: any) => !memberIds.has(s.id));
  }

  const accepted = (members ?? []).filter((m: any) => m.status === "accepted");
  const pending = (members ?? []).filter((m: any) => m.status === "pending");

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
          aria-label="Back to rooms"
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
              {isOwner ? "Quizzes" : "Available Quizzes"}
            </h2>
            <Badge>{visibleQuizzes.length}</Badge>
          </div>
          {isOwner && (
            <Link href={`/rooms/${room.id}/quizzes/new`}>
              <Button size="sm">
                <Plus className="w-4 h-4" />
                New Quiz
              </Button>
            </Link>
          )}
        </div>

        {visibleQuizzes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              isOwner ? "Wala pang quizzes" : "Wala pang available quizzes"
            }
            description={
              isOwner
                ? "Create your first quiz para ma-take ng students."
                : "Hintayin ang teacher mo mag-publish ng quiz."
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
          <InviteStudentsPanel
            roomId={room.id}
            availableStudents={myStudents}
            allStudents={allStudents}
            currentUserId={me.id}
          />

          {/* Joined students */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <h2 className="font-semibold">Joined Students</h2>
              <Badge variant="success">{accepted.length}</Badge>
            </div>

            {accepted.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Wala pang joined"
                description="Mag-invite ng students sa itaas."
              />
            ) : (
              <ul className="space-y-2">
                {accepted.map((m: any) => (
                  <StudentRow
                    key={m.id}
                    student={m.profiles}
                    roomId={room.id}
                    canRemove={true}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Pending */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="font-semibold">Pending Invitations</h2>
                <Badge variant="warning">{pending.length}</Badge>
              </div>
              <ul className="space-y-2">
                {pending.map((m: any) => (
                  <StudentRow
                    key={m.id}
                    student={m.profiles}
                    pending
                    roomId={room.id}
                    canRemove={true}
                  />
                ))}
              </ul>
            </div>
          )}

          <DeleteRoomButton roomId={room.id} />
        </>
      )}

      {/* Student: classmates */}
      {!isOwner && accepted.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand" />
            <h2 className="font-semibold">Classmates</h2>
            <Badge>{accepted.length}</Badge>
          </div>
          <ul className="space-y-2">
            {accepted.map((m: any) => (
              <StudentRow key={m.id} student={m.profiles} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StudentRow({
  student,
  pending,
  roomId,
  canRemove,
}: {
  student: any;
  pending?: boolean;
  roomId?: string;
  canRemove?: boolean;
}) {
  if (!student) return null;

  const initials = student.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border shadow-sm">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          pending
            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
            : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
        }`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.full_name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {student.email}
        </p>
      </div>
      {canRemove && roomId && (
        <RemoveStudentModal
          roomId={roomId}
          studentId={student.id}
          studentName={student.full_name}
          studentEmail={student.email}
        />
      )}
    </li>
  );
}
