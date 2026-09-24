"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Play,
  Clock,
  ListChecks,
  AlertTriangle,
  ShieldAlert,
  EyeOff,
  Ban,
} from "lucide-react";
import { startAttempt } from "./attempt-actions";
import QuizRunner from "./QuizRunner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function QuizStudentView({ quiz }: { quiz: any }) {
  const t = useTranslations("QuizStudentView");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [reorderedQuestions, setReorderedQuestions] = useState(quiz.questions);

  async function handleStart() {
    setLoading(true);
    setError(null);

    const res = await startAttempt(quiz.id);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    let questions = quiz.questions;

    if (res?.questionOrder) {
      const orderMap = new Map<string, number>();
      (res.questionOrder as string[]).forEach((qid, idx) => {
        orderMap.set(qid, idx);
      });
      questions = [...questions].sort(
        (a: any, b: any) =>
          (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0),
      );
    }

    if (res?.optionOrder) {
      const optionOrderMap = res.optionOrder as Record<string, string[]>;
      questions = questions.map((q: any) => {
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

    setReorderedQuestions(questions);
    setAttemptId(res.attemptId!);
  }

  if (attemptId) {
    return (
      <QuizRunner
        attemptId={attemptId}
        quiz={{
          id: quiz.id,
          title: quiz.title,
          time_limit_minutes: quiz.time_limit_minutes,
        }}
        questions={reorderedQuestions}
      />
    );
  }

  const totalPoints = quiz.questions.reduce(
    (s: number, q: any) => s + q.points,
    0,
  );

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {quiz.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ListChecks className="w-3 h-3" />
              {t("questions")}
            </div>
            <p className="text-lg font-bold mt-1">{quiz.questions.length}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {quiz.time_limit_minutes ? t("timeLimit") : t("totalPoints")}
            </div>
            <p className="text-lg font-bold mt-1">
              {quiz.time_limit_minutes
                ? `${quiz.time_limit_minutes} min`
                : totalPoints}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
              {t("readBeforeStart")}
            </p>
            <ul className="text-xs text-amber-800 dark:text-amber-300 mt-2 space-y-1.5">
              <li className="flex items-start gap-2">
                <Ban className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("warning1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <EyeOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("warning2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("warning3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("warning4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleStart}
        loading={loading}
      >
        {!loading && <Play className="w-5 h-5" />}
        {loading ? t("starting") : t("startQuiz")}
      </Button>
    </div>
  );
}
