"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Save, AlertCircle, Check } from "lucide-react";
import { gradeAttempt } from "../grade-actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function GradeForm({
  attemptId,
  quizId,
  attempt,
  answers,
}: {
  attemptId: string;
  quizId: string;
  attempt: any;
  answers: any[];
}) {
  const t = useTranslations("GradeForm");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(attempt.teacher_feedback ?? "");

  // Local state for points per answer
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const a of answers) {
      initial[a.id] = a.points_awarded ?? 0;
    }
    return initial;
  });

  const [answerFeedback, setAnswerFeedback] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      for (const a of answers) {
        initial[a.id] = a.feedback ?? "";
      }
      return initial;
    },
  );

  // Compute total
  const mcqScore = answers
    .filter((a) => a.questions?.question_type !== "essay")
    .reduce(
      (s, a) =>
        s + (a.selected_option?.is_correct ? (a.questions?.points ?? 0) : 0),
      0,
    );

  const essayScore = answers
    .filter((a) => a.questions?.question_type === "essay")
    .reduce((s, a) => s + (scores[a.id] ?? 0), 0);

  const totalScore = mcqScore + essayScore;

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await gradeAttempt(attemptId, quizId, {
        scores,
        answerFeedback,
        teacherFeedback: feedback,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push(`/quiz/${quizId}/attempts`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("currentScore")}</p>
            <p className="text-2xl font-bold">
              {totalScore} / {attempt.total_points}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>
              {t("mcq")} {mcqScore}
            </p>
            <p>
              {t("essay")} {essayScore}
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {answers.map((a, i) => {
        const q = a.questions;
        const isEssay = q?.question_type === "essay";
        const maxPoints = q?.points ?? 0;

        return (
          <Card key={a.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand text-brand-foreground text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{q?.question_text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isEssay ? "info" : "default"}>
                    {isEssay ? t("essayLabel") : t("mcqLabel")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t("maxPoints", { points: maxPoints })}
                  </span>
                </div>
              </div>
            </div>

            {!isEssay && (
              <div className="space-y-1.5">
                {q.options?.map((o: any) => {
                  const wasSelected = a.selected_option_id === o.id;
                  const isCorrect = o.is_correct;
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                          : wasSelected
                            ? "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCorrect && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {!isCorrect && wasSelected && (
                        <span className="w-3.5 h-3.5 shrink-0">✗</span>
                      )}
                      <span className="flex-1">{o.option_text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {isEssay && (
              <div className="space-y-3">
                {q.rubric && (
                  <div className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 p-2 rounded-lg">
                    <b>{t("rubricPrefix")}</b> {q.rubric}
                  </div>
                )}

                <div className="bg-muted p-3 rounded-xl text-sm whitespace-pre-wrap">
                  {a.answer_text || (
                    <span className="italic text-muted-foreground">
                      {t("noAnswer")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium">
                      {t("pointsAwarded")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={maxPoints}
                      value={scores[a.id] ?? 0}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [a.id]: Math.min(
                            maxPoints,
                            Math.max(0, Number(e.target.value) || 0),
                          ),
                        }))
                      }
                      className="w-full h-10 mt-1 px-3 rounded-xl border border-border bg-background text-sm font-bold"
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {t("max", { points: maxPoints })}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium">
                    {t("feedbackOptional")}
                  </label>
                  <textarea
                    rows={2}
                    value={answerFeedback[a.id] ?? ""}
                    onChange={(e) =>
                      setAnswerFeedback((prev) => ({
                        ...prev,
                        [a.id]: e.target.value,
                      }))
                    }
                    placeholder={t("feedbackPlaceholder")}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </Card>
        );
      })}

      <Card className="p-4">
        <label className="text-sm font-medium">{t("overallFeedback")}</label>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t("overallFeedbackPlaceholder")}
          className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
        />
      </Card>

      <Button
        onClick={handleSave}
        loading={pending}
        size="lg"
        className="w-full"
      >
        {!pending && <Save className="w-4 h-4" />}
        {pending ? t("saving") : t("saveGrade")}
      </Button>
    </div>
  );
}
