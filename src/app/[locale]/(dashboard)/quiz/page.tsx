export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
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
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function QuizListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("QuizList");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }
  if (me.role === "super_admin") redirect({ href: "/admin/dashboard", locale });

  const supabase = await createClient();

  // TEACHER
  if (me.role === "teacher") {
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select(
        `id, title, description, status, created_at, rooms ( id, name, teacher_id )`,
      )
      .order("created_at", { ascending: false });

    const ownQuizzes = (quizzes ?? []).filter(
      (q: any) => q.rooms?.teacher_id === me.id,
    );

    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">
            {t("teacherSubtitle", { count: ownQuizzes.length })}
          </p>
        </div>

        {ownQuizzes.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={t("noQuizzes")}
            description={t("noQuizzesTeacherDesc")}
            action={
              <Link
                href="/rooms"
                locale={locale}
                className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded-xl text-sm font-medium"
              >
                <DoorOpen className="w-4 h-4" />
                {t("goToRooms")}
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {ownQuizzes.map((q: any) => (
              <li key={q.id}>
                <Link
                  href={`/quiz/${q.id}`}
                  locale={locale}
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

  // STUDENT
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(
      `id, title, description, status, created_at, rooms ( id, name, subject )`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const visibleQuizzes = (quizzes ?? []).filter((q: any) => q.rooms !== null);

  const { data: myAttempts } = await supabase
    .from("attempts")
    .select("quiz_id, status")
    .eq("student_id", me.id);

  const attemptMap = new Map<string, string>(
    (myAttempts ?? []).map((a: any) => [a.quiz_id, a.status]),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="text-xs text-muted-foreground">
          {t("studentSubtitle", { count: visibleQuizzes.length })}
        </p>
      </div>

      {visibleQuizzes.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={t("noQuizzes")}
          description={t("noQuizzesStudentDesc")}
          action={
            <Link
              href="/rooms"
              locale={locale}
              className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded-xl text-sm font-medium"
            >
              <DoorOpen className="w-4 h-4" />
              {t("goToRooms")}
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

                    {isDone ? (
                      <Badge
                        variant={
                          attemptStatus === "terminated" ? "danger" : "success"
                        }
                      >
                        {attemptStatus === "terminated" ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            {t("statusTerminated")}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            {t("statusDone")}
                          </>
                        )}
                      </Badge>
                    ) : isInProgress ? (
                      <Badge variant="warning">
                        <Hourglass className="w-3 h-3" />
                        {t("statusInProgress")}
                      </Badge>
                    ) : (
                      <Badge variant="info">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("statusAvailable")}
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
