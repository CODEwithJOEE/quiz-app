export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { Clock, Lock, AlertTriangle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import QuizEditor from "./QuizEditor";
import QuizStudentView from "./QuizStudentView";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string; quizId: string }>;
}) {
  const { locale, quizId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("QuizPage");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select(
      `id, title, description, status, time_limit_minutes, room_id,
       rooms ( id, name, teacher_id )`,
    )
    .eq("id", quizId)
    .single();

  if (!quiz) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-semibold">{t("loadError")}</p>
          <p className="text-sm text-muted-foreground">{t("loadErrorDesc")}</p>
          <Link href="/rooms">
            <Button variant="secondary" size="sm" className="mt-2">
              <ArrowLeft className="w-4 h-4" />
              {t("backToRooms")}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isOwner = (quiz as any).rooms?.teacher_id === me.id;

  const { data: questions } = await supabase
    .from("questions")
    .select(
      `id, question_text, question_type, points, order_index,
       word_limit_min, word_limit_max, rubric,
       options ( id, option_text, is_correct, order_index )`,
    )
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  const sorted = (questions ?? []).map((q: any) => ({
    ...q,
    options: (q.options ?? []).sort(
      (a: any, b: any) => a.order_index - b.order_index,
    ),
  }));

  if (isOwner) {
    return <QuizEditor quiz={{ ...quiz, questions: sorted }} isOwner={true} />;
  }

  if (quiz.status === "draft") {
    return (
      <Card className="p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <div>
          <p className="font-semibold">{t("notAvailable")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("notAvailableDesc")}
          </p>
        </div>
      </Card>
    );
  }

  if (quiz.status === "closed") {
    return (
      <Card className="p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <p className="font-semibold text-red-800 dark:text-red-300">
            {t("closed")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("closedDesc")}
          </p>
        </div>
        <Link href={`/rooms/${quiz.room_id}`}>
          <Button variant="secondary" size="sm" className="mt-2">
            <ArrowLeft className="w-4 h-4" />
            {t("backToRoom")}
          </Button>
        </Link>
      </Card>
    );
  }

  const { data: existingAttempt } = await supabase
    .from("attempts")
    .select("id, status, score, total_points")
    .eq("quiz_id", quizId)
    .eq("student_id", me.id)
    .maybeSingle();

  if (
    existingAttempt &&
    (existingAttempt.status === "submitted" ||
      existingAttempt.status === "terminated")
  ) {
    redirect({ href: `/quiz/${quizId}/result`, locale });
  }

  let finalQuestions = sorted;

  if (existingAttempt?.status === "in_progress") {
    const { data: attempt } = await supabase
      .from("attempts")
      .select("question_order, option_order")
      .eq("id", existingAttempt.id)
      .single();

    if (attempt?.question_order && Array.isArray(attempt.question_order)) {
      const orderMap = new Map<string, number>();
      (attempt.question_order as string[]).forEach((qid, idx) => {
        orderMap.set(qid, idx);
      });

      finalQuestions = [...sorted].sort(
        (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0),
      );
    }

    if (attempt?.option_order) {
      const optionOrderMap = attempt.option_order as Record<string, string[]>;
      finalQuestions = finalQuestions.map((q: any) => {
        const order = optionOrderMap[q.id];
        if (!order) return q;
        const optMap = new Map<string, number>();
        order.forEach((oid, idx) => optMap.set(oid, idx));
        return {
          ...q,
          options: [...q.options].sort(
            (a: any, b: any) =>
              (optMap.get(a.id) ?? 0) - (optMap.get(b.id) ?? 0),
          ),
        };
      });
    }
  }

  return (
    <QuizStudentView
      quiz={{
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        time_limit_minutes: quiz.time_limit_minutes,
        questions: finalQuestions.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          points: q.points,
          order_index: q.order_index,
          question_type: q.question_type,
          word_limit_min: q.word_limit_min,
          word_limit_max: q.word_limit_max,
          rubric: q.rubric,
          options: q.options.map((o: any) => ({
            id: o.id,
            option_text: o.option_text,
            order_index: o.order_index,
          })),
        })),
      }}
    />
  );
}
