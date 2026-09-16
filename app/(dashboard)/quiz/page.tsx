export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  FileText,
  DoorOpen,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import QuizStatusBadge from "@/components/QuizStatusBadge";

export default async function QuizListPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  // Super admin has no quizzes
  if (me.role === "super_admin") redirect("/admin/dashboard");

  const supabase = await createClient();

  // =====================================================
  // TEACHER: all quizzes across own rooms
  // =====================================================
  if (me.role === "teacher") {
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select(
        `
        id, title, description, status, created_at,
        rooms ( id, name, teacher_id )
      `,
      )
      .order("created_at", { ascending: false });

    const ownQuizzes = (quizzes ?? []).filter(
      (q: any) => q.rooms?.teacher_id === me.id,
    );

    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Quizzes</h1>
          <p className="text-xs text-muted-foreground">
            {ownQuizzes.length} quiz{ownQuizzes.length !== 1 ? "zes" : ""}{" "}
            across all your rooms
          </p>
        </div>

        {ownQuizzes.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Wala pang quizzes"
            description="Create a room, tap it, then add a quiz."
            action={
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded-xl text-sm font-medium"
              >
                <DoorOpen className="w-4 h-4" />
                Go to Rooms
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {ownQuizzes.map((q: any) => (
              <li key={q.id}>
                <Link
                  href={`/quiz/${q.id}`}
                  className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {q.title}
                      </p>
                      {q.rooms?.name && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <DoorOpen className="w-3 h-3" />
                          {q.rooms.name}
                        </div>
                      )}
                      {q.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {q.description}
                        </p>
                      )}
                    </div>
                    <QuizStatusBadge status={q.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // =====================================================
  // STUDENT: published quizzes + attempt status
  // =====================================================
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(
      `
      id, title, description, status, created_at,
      rooms ( id, name, subject )
    `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const visibleQuizzes = (quizzes ?? []).filter((q: any) => q.rooms !== null);

  // ✅ Fetch student's attempts
  const { data: myAttempts } = await supabase
    .from("attempts")
    .select("quiz_id, status")
    .eq("student_id", me.id);

  // Build lookup map: quiz_id → status
  const attemptMap = new Map<string, string>(
    (myAttempts ?? []).map((a: any) => [a.quiz_id, a.status]),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Quizzes</h1>
        <p className="text-xs text-muted-foreground">
          {visibleQuizzes.length} available quiz
          {visibleQuizzes.length !== 1 ? "zes" : ""}
        </p>
      </div>

      {visibleQuizzes.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Wala pang available quizzes"
          description="Hintayin ang teacher mo mag-publish ng quiz sa rooms mo."
          action={
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded-xl text-sm font-medium"
            >
              <DoorOpen className="w-4 h-4" />
              Go to Rooms
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {visibleQuizzes.map((q: any) => {
            const attemptStatus = attemptMap.get(q.id);
            const isDone =
              attemptStatus === "submitted" || attemptStatus === "terminated";
            const isInProgress = attemptStatus === "in_progress";

            // ✅ Direct link to result kung tapos na
            const href = isDone ? `/quiz/${q.id}/result` : `/quiz/${q.id}`;

            return (
              <li key={q.id}>
                <Link
                  href={href}
                  className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {q.title}
                      </p>
                      {q.rooms?.name && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <DoorOpen className="w-3 h-3" />
                          {q.rooms.name}
                        </div>
                      )}
                      {q.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    {isDone ? (
                      <Badge
                        variant={
                          attemptStatus === "terminated" ? "danger" : "success"
                        }
                      >
                        {attemptStatus === "terminated" ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Terminated
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </>
                        )}
                      </Badge>
                    ) : isInProgress ? (
                      <Badge variant="warning">
                        <Hourglass className="w-3 h-3" />
                        In Progress
                      </Badge>
                    ) : (
                      <Badge variant="info">
                        <CheckCircle2 className="w-3 h-3" />
                        Available
                      </Badge>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
