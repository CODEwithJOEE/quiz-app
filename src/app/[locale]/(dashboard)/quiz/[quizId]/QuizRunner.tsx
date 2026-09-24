"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";
import { useAntiCheat } from "@/lib/quiz/useAntiCheat";
import {
  saveAnswer,
  saveEssayAnswer as saveEssayAnswerAction,
  logIntegrityEvent,
  submitAttempt,
  terminateAttempt,
} from "./attempt-actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";

type Option = { id: string; option_text: string; order_index: number };
type Question = {
  id: string;
  question_text: string;
  points: number;
  order_index: number;
  question_type: "multiple_choice" | "essay";
  word_limit_min: number | null;
  word_limit_max: number | null;
  rubric: string | null;
  options: Option[];
};

const MAX_STRIKES = 3;

function getWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function QuizRunner({
  attemptId,
  quiz,
  questions,
}: {
  attemptId: string;
  quiz: { id: string; title: string; time_limit_minutes: number | null };
  questions: Question[];
}) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState<{
    type: string;
    count: number;
  } | null>(null);

  const t = useTranslations("QuizRunner");
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null,
  );
  const terminatedRef = useRef(false);

  const current = questions[currentIdx];

  // Answered count = MCQs + non-empty essays
  const answeredCount =
    Object.keys(selected).length +
    Object.values(essayAnswers).filter((a) => a.trim().length > 0).length;

  // ---------- Anti-cheat ----------
  const handleViolation = useCallback(
    async (type: string, count: number) => {
      await logIntegrityEvent(attemptId, type, { count });
      setWarning({ type, count });
    },
    [attemptId],
  );

  const handleMaxStrikes = useCallback(
    async (type: string, count: number) => {
      if (terminatedRef.current) return;
      terminatedRef.current = true;

      await logIntegrityEvent(attemptId, "MAX_STRIKES_REACHED", {
        type,
        count,
      });
      await terminateAttempt(attemptId, `max_strikes:${type}`);

      router.replace(`/quiz/${quiz.id}/result`);
    },
    [attemptId, quiz.id, router],
  );

  useAntiCheat({
    enabled: !submitting && !terminatedRef.current,
    maxStrikes: MAX_STRIKES,
    onViolation: handleViolation,
    onMaxStrikes: handleMaxStrikes,
  });

  // ---------- Timer ----------
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const t = setTimeout(
      () => setTimeLeft((s) => (s === null ? null : s - 1)),
      1000,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  async function pickOption(optionId: string) {
    if (!current) return;
    setSelected((prev) => ({ ...prev, [current.id]: optionId }));
    await saveAnswer(attemptId, current.id, optionId);
  }

  async function handleAutoSubmit() {
    if (submitting || terminatedRef.current) return;
    setSubmitting(true);
    await submitAttempt(attemptId, "submitted");
    router.replace(`/quiz/${quiz.id}/result`);
  }

  async function handleManualSubmit() {
    const unanswered = questions.length - answeredCount;
    const msg =
      unanswered > 0
        ? t("submitConfirmUnanswered", { count: unanswered })
        : t("submitConfirmAnswered");
    if (!confirm(msg)) return;
    await handleAutoSubmit();
  }

  if (!current) {
    return <p className="text-sm text-muted-foreground">{t("noQuestions")}</p>;
  }

  const isLast = currentIdx === questions.length - 1;
  const isFirst = currentIdx === 0;
  const progressPercent = (answeredCount / questions.length) * 100;

  const timerUrgent = timeLeft !== null && timeLeft < 60;
  const mm =
    timeLeft !== null
      ? String(Math.floor(timeLeft / 60)).padStart(2, "0")
      : null;
  const ss = timeLeft !== null ? String(timeLeft % 60).padStart(2, "0") : null;

  return (
    <div className="space-y-4 select-none">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 bg-background/95 backdrop-blur">
        <Card className="p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="info">
                {t("questionOf", {
                  current: currentIdx + 1,
                  total: questions.length,
                })}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t("answered", { count: answeredCount })}
              </span>
            </div>
            {timeLeft !== null && (
              <div
                className={`flex items-center gap-1.5 font-mono font-bold px-3 py-1 rounded-lg text-sm ${
                  timerUrgent
                    ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 animate-pulse"
                    : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {mm}:{ss}
              </div>
            )}
          </div>

          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Warning banner */}
      {warning && (
        <Card className="p-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 animate-warning-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm text-red-800 dark:text-red-300">
                {t("violation", { count: warning.count, max: MAX_STRIKES })}
              </p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                {t("violationWarning")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Question card */}
      <Card className="p-5 space-y-4">
        {/* Question header */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-base leading-relaxed flex-1">
            {current.question_text}
          </p>
          <Badge>{current.points} pt(s)</Badge>
        </div>

        {/* Answer area — essay or MCQ */}
        {current.question_type === "essay" ? (
          <div className="space-y-3">
            {/* Word limit info */}
            {(current.word_limit_min || current.word_limit_max) && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                {t("wordLimitLabel")}{" "}
                {current.word_limit_min
                  ? `${current.word_limit_min} ${t("min")}`
                  : ""}
                {current.word_limit_min && current.word_limit_max ? " • " : ""}
                {current.word_limit_max
                  ? `${current.word_limit_max} ${t("max")}`
                  : ""}
              </div>
            )}

            {/* Rubric */}
            {current.rubric && (
              <div className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 p-2 rounded-lg">
                <b>{t("rubricPrefix")}</b> {current.rubric}
              </div>
            )}

            {/* Textarea */}
            <Textarea
              placeholder={t("essayPlaceholder")}
              rows={8}
              value={essayAnswers[current.id] ?? ""}
              onChange={(e) => {
                const text = e.target.value;
                setEssayAnswers((prev) => ({ ...prev, [current.id]: text }));
              }}
              onBlur={() =>
                saveEssayAnswerAction(
                  attemptId,
                  current.id,
                  essayAnswers[current.id] ?? "",
                )
              }
            />

            {/* Word counter */}
            <div className="flex items-center justify-between text-xs">
              <span>
                {getWordCount(essayAnswers[current.id] ?? "")} {t("words")}
                {current.word_limit_min &&
                  ` / ${t("min")} ${current.word_limit_min}`}
                {current.word_limit_max &&
                  ` / ${t("max")} ${current.word_limit_max}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {current.options.map((o, i) => {
              const isSelected = selected[current.id] === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => pickOption(o.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 active:scale-[0.99] ${
                    isSelected
                      ? "border-brand bg-blue-50 dark:bg-blue-950 text-brand"
                      : "border-border bg-card hover:border-muted-foreground/40"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {o.option_text}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Prev / Next */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("prev")}
        </Button>
        {!isLast ? (
          <Button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="flex-1"
          >
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleManualSubmit}
            disabled={submitting}
            loading={submitting}
            className="flex-1"
          >
            {!submitting && <Send className="w-4 h-4" />}
            {submitting ? t("submitting") : t("submitQuiz")}
          </Button>
        )}
      </div>

      {/* Quick jump grid */}
      <Card className="p-3">
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          {t("jumpTo")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isCurrent = i === currentIdx;
            const isAnswered =
              q.question_type === "essay"
                ? (essayAnswers[q.id] ?? "").trim().length > 0
                : !!selected[q.id];
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-brand text-brand-foreground ring-2 ring-brand/30 scale-110"
                    : isAnswered
                      ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                      : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </Card>

      <p className="text-xs text-center text-muted-foreground pb-2">
        {t("antiCheatWarning")}
      </p>
    </div>
  );
}
