export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  PartyPopper,
  BookOpen,
  ShieldX,
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import BackButton from "./BackButton";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ quizId: string; locale: string }>;
}) {
  const { quizId, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Result");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, room_id, status, rooms(id, name, teacher_id)")
    .eq("id", quizId)
    .single();

  if (!quiz) {
    const { data: attemptFallback } = await supabase
      .from("attempts")
      .select("id, quiz_id")
      .eq("quiz_id", quizId)
      .eq("student_id", me.id)
      .maybeSingle();

    if (attemptFallback) {
      return (
        <Card className="p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-semibold">{t("quizDeleted")}</p>
          <p className="text-sm text-muted-foreground">
            {t("quizDeletedDesc")}
          </p>
          <Link href="/rooms">
            <Button variant="secondary" size="sm">
              {t("backToRooms")}
            </Button>
          </Link>
        </Card>
      );
    }

    notFound();
  }

  const { data: attempt } = await supabase
    .from("attempts")
    .select(
      "id, status, score, total_points, submitted_at, termination_reason, grading_status, teacher_feedback",
    )
    .eq("quiz_id", quizId)
    .eq("student_id", me.id)
    .maybeSingle();

  if (!attempt) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("noAttempt")}</p>
        </Card>
        <BackButton roomId={quiz.room_id} />
      </div>
    );
  }

  const percentage =
    attempt.total_points > 0
      ? Math.round((attempt.score / attempt.total_points) * 100)
      : 0;

  const isTerminated = attempt.status === "terminated";
  const passed = !isTerminated && percentage >= 60;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-lg font-bold">{quiz.title}</h1>
        <p className="text-xs text-muted-foreground">
          {(quiz as any).rooms?.name}
        </p>
      </div>

      {attempt.grading_status === "pending" ? (
        <Card className="p-6 text-center border-2 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8" />
          </div>
          <p className="font-bold text-amber-800 dark:text-amber-300 text-lg">
            {t("pendingGrading")}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            {t("pendingGradingDesc")}
          </p>
          <div className="mt-5 pt-5 border-t border-amber-200 dark:border-amber-900">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t("currentScore")}
            </p>
            <p className="text-2xl font-bold mt-1">
              {attempt.score} / {attempt.total_points}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("essayPointsPending")}
            </p>
          </div>
        </Card>
      ) : isTerminated ? (
        <Card className="p-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
            <ShieldX className="w-8 h-8" />
          </div>
          <p className="font-bold text-red-800 dark:text-red-300 text-lg">
            {t("examTerminated")}
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            {t("reason")}{" "}
            {attempt.termination_reason ?? t("integrityViolation")}
          </p>
          <div className="mt-5 pt-5 border-t border-red-200 dark:border-red-900">
            <p className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wide">
              {t("finalScore")}
            </p>
            <p className="text-4xl font-bold text-red-700 dark:text-red-300 mt-1">
              0 / {attempt.total_points}
            </p>
          </div>
        </Card>
      ) : (
        <Card
          className={`p-6 text-center border-2 ${
            passed
              ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40"
              : "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 ${
              passed
                ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
            }`}
          >
            {passed ? (
              <PartyPopper className="w-8 h-8" />
            ) : (
              <BookOpen className="w-8 h-8" />
            )}
          </div>
          <p
            className={`font-bold text-lg ${
              passed
                ? "text-green-800 dark:text-green-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {passed ? t("congratulations") : t("keepPracticing")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {passed ? t("youPassed") : t("betterLuck")}
          </p>

          <div className="mt-5 pt-5 border-t border-current/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t("yourScore")}
            </p>
            <p
              className={`text-4xl font-bold mt-1 ${
                passed
                  ? "text-green-700 dark:text-green-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {attempt.score} / {attempt.total_points}
            </p>
            <Badge variant={passed ? "success" : "warning"} className="mt-2">
              <TrendingUp className="w-3 h-3" />
              {percentage}%
            </Badge>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("status")}</span>
          <Badge variant={isTerminated ? "danger" : "success"}>
            <Target className="w-3 h-3" />
            {isTerminated ? t("terminated") : t("submitted")}
          </Badge>
        </div>
        {attempt.submitted_at && (
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border">
            <span className="text-muted-foreground">{t("submittedAt")}</span>
            <span className="font-medium">
              {new Date(attempt.submitted_at).toLocaleString()}
            </span>
          </div>
        )}
      </Card>

      <BackButton roomId={quiz.room_id} />
    </div>
  );
}
