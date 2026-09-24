export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import GradeForm from "./GradeForm";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function GradeAttemptPage({
  params,
}: {
  params: Promise<{ locale: string; quizId: string; attemptId: string }>;
}) {
  const { locale, quizId, attemptId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GradePage");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/home", locale });
    return null;
  }
  if (me.role !== "teacher") redirect({ href: "/home", locale });

  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from("attempts")
    .select(
      `id, status, score, total_points, grading_status,
       submitted_at, teacher_feedback,
       profiles:student_id ( id, full_name, email ),
       quizzes ( id, title, rooms ( teacher_id ) )`,
    )
    .eq("id", attemptId)
    .single();

  if (!attempt) notFound();
  if ((attempt as any).quizzes?.rooms?.teacher_id !== me.id) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">{t("notOwner")}</p>
      </Card>
    );
  }

  const { data: answers } = await supabase
    .from("answers")
    .select(
      `id, question_id, selected_option_id, answer_text,
       points_awarded, feedback,
       questions (
         id, question_text, question_type, points, order_index,
         word_limit_min, word_limit_max, rubric,
         options ( id, option_text, is_correct, order_index )
       ),
       selected_option:selected_option_id ( id, option_text, is_correct )`,
    )
    .eq("attempt_id", attemptId)
    .order("questions(order_index)", { ascending: true });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link
          href={`/quiz/${quizId}/attempts`}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label={t("backToAttempts")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold">{t("gradeAttempt")}</h1>
          <p className="text-xs text-muted-foreground truncate">
            {(attempt as any).profiles?.full_name}
          </p>
        </div>
        <Badge
          variant={
            attempt.grading_status === "graded"
              ? "success"
              : attempt.grading_status === "pending"
                ? "warning"
                : "default"
          }
        >
          {attempt.grading_status === "graded"
            ? t("graded")
            : attempt.grading_status === "pending"
              ? t("pending")
              : t("auto")}
        </Badge>
      </div>

      <GradeForm
        attemptId={attemptId}
        quizId={quizId}
        attempt={attempt}
        answers={answers ?? []}
      />
    </div>
  );
}
