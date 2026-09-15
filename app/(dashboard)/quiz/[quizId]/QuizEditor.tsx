"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  Lock,
  Unlock,
  Trash2,
  BarChart3,
  Plus,
  FileText,
  Upload,
  Check,
  X,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { addQuestion, deleteQuestion } from "./question-actions";
import {
  updateQuizStatus,
  deleteQuiz,
} from "@/app/(dashboard)/rooms/[roomId]/quiz-actions";
import ExcelImport from "./ExcelImport";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import QuizStatusBadge from "@/components/QuizStatusBadge";

type Option = { id: string; option_text: string; is_correct: boolean };
type Question = {
  id: string;
  question_text: string;
  points: number;
  options: Option[];
};

type Tab = "questions" | "import";

export default function QuizEditor({ quiz }: { quiz: any; isOwner: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("questions");

  // Form state
  const [qText, setQText] = useState("");
  const [opts, setOpts] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [points, setPoints] = useState(1);

  const totalPoints = quiz.questions.reduce(
    (s: number, q: Question) => s + q.points,
    0,
  );
  // Sa taas ng form state, idagdag:
  const [questionType, setQuestionType] = useState<"multiple_choice" | "essay">(
    "multiple_choice",
  );
  const [wordLimitMin, setWordLimitMin] = useState<string>("");
  const [wordLimitMax, setWordLimitMax] = useState<string>("");
  const [rubric, setRubric] = useState<string>("");

  // Sa handleAddQuestion, i-update:
  function handleAddQuestion() {
    setError(null);

    if (questionType === "multiple_choice") {
      const cleaned = opts.filter((o) => o.text.trim() !== "");
      if (cleaned.length < 2) {
        setError("Kailangan at least 2 options.");
        return;
      }
      startTransition(async () => {
        const res = await addQuestion(
          quiz.id,
          qText,
          cleaned,
          points,
          "multiple_choice",
        );
        if (res?.error) {
          setError(res.error);
          return;
        }
        resetForm();
        router.refresh();
      });
    } else {
      // Essay
      startTransition(async () => {
        const res = await addQuestion(quiz.id, qText, [], points, "essay", {
          wordLimitMin: wordLimitMin ? Number(wordLimitMin) : null,
          wordLimitMax: wordLimitMax ? Number(wordLimitMax) : null,
          rubric: rubric || null,
        });
        if (res?.error) {
          setError(res.error);
          return;
        }
        resetForm();
        router.refresh();
      });
    }
  }

  // Reset form update:
  function resetForm() {
    setQText("");
    setOpts([
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setPoints(1);
    setQuestionType("multiple_choice");
    setWordLimitMin("");
    setWordLimitMax("");
    setRubric("");
  }

  function toggleCorrect(idx: number) {
    setOpts((prev) => prev.map((o, i) => ({ ...o, isCorrect: i === idx })));
  }

  function handleStatus(status: "draft" | "published" | "closed") {
    startTransition(async () => {
      const res = await updateQuizStatus(quiz.id, status);
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Delete this quiz? Hindi na ito maibabalik.")) return;
    startTransition(async () => {
      await deleteQuiz(quiz.id);
      router.push(`/rooms/${quiz.room_id}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {quiz.description}
              </p>
            )}
          </div>
          <QuizStatusBadge status={quiz.status} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ListChecks className="w-3 h-3" />
              Questions
            </div>
            <p className="text-lg font-bold mt-1">{quiz.questions.length}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              Total Points
            </div>
            <p className="text-lg font-bold mt-1">{totalPoints}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Link href={`/quiz/${quiz.id}/attempts`}>
            <Button variant="secondary" size="sm">
              <BarChart3 className="w-3.5 h-3.5" />
              Attempts
            </Button>
          </Link>

          {quiz.status !== "published" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatus("published")}
              disabled={pending || quiz.questions.length === 0}
              loading={pending}
            >
              {!pending && <Rocket className="w-3.5 h-3.5" />}
              Publish
            </Button>
          )}

          {quiz.status === "published" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleStatus("closed")}
              disabled={pending}
            >
              <Lock className="w-3.5 h-3.5" />
              Close
            </Button>
          )}

          {quiz.status === "closed" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatus("published")}
              disabled={pending}
            >
              <Unlock className="w-3.5 h-3.5" />
              Re-open
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={pending}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-2xl">
        <button
          onClick={() => setTab("questions")}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium transition-all ${
            tab === "questions"
              ? "bg-card shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListChecks className="w-4 h-4" />
          Questions
        </button>
        <button
          onClick={() => setTab("import")}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium transition-all ${
            tab === "import"
              ? "bg-card shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tab: Questions */}
      {tab === "questions" && (
        <div className="space-y-4">
          {/* Add question form */}

          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand text-brand-foreground flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-sm">Add Question</h2>
            </div>

            {/* Question Type Selector */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => setQuestionType("multiple_choice")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  questionType === "multiple_choice"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => setQuestionType("essay")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  questionType === "essay"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Essay
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <Textarea
              placeholder={
                questionType === "essay"
                  ? "Essay prompt or question..."
                  : "Type your question here..."
              }
              rows={3}
              value={qText}
              onChange={(e) => setQText(e.target.value)}
            />

            {/* MCQ options */}
            {questionType === "multiple_choice" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  Options (click radio to mark correct answer)
                </p>
                {opts.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCorrect(i)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        o.isCorrect
                          ? "bg-green-600 text-white"
                          : "bg-muted text-muted-foreground hover:bg-border"
                      }`}
                    >
                      {o.isCorrect ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                      )}
                    </button>
                    <input
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={o.text}
                      onChange={(e) =>
                        setOpts((prev) =>
                          prev.map((p, idx) =>
                            idx === i ? { ...p, text: e.target.value } : p,
                          ),
                        )
                      }
                      className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Essay fields */}
            {questionType === "essay" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Min Words
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={wordLimitMin}
                      onChange={(e) => setWordLimitMin(e.target.value)}
                      placeholder="Optional"
                      className="w-full h-10 mt-1 px-3 rounded-xl border border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Max Words
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={wordLimitMax}
                      onChange={(e) => setWordLimitMax(e.target.value)}
                      placeholder="Optional"
                      className="w-full h-10 mt-1 px-3 rounded-xl border border-border bg-background text-sm"
                    />
                  </div>
                </div>

                <Textarea
                  label="Rubric / Guidelines (optional)"
                  placeholder="e.g. Content: 10pts, Grammar: 5pts, Structure: 5pts"
                  rows={2}
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                />
              </div>
            )}

            {/* Points */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium shrink-0">Points:</label>
              <input
                type="number"
                min={1}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value) || 1)}
                className="w-20 h-10 px-3 rounded-xl border border-border bg-background text-sm"
              />
            </div>

            <Button
              onClick={handleAddQuestion}
              disabled={pending}
              loading={pending}
              className="w-full"
            >
              {!pending && <Plus className="w-4 h-4" />}
              {pending ? "Adding..." : "Add Question"}
            </Button>
          </Card>
          {/* Questions list */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-brand" />
              <h2 className="font-semibold">Questions</h2>
              <Badge>{quiz.questions.length}</Badge>
            </div>

            {quiz.questions.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Wala pang questions"
                description="Add your first question above, o mag-import from Excel."
              />
            ) : (
              <ul className="space-y-3">
                {quiz.questions.map((q: Question, qi: number) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={qi}
                    onDelete={() => {
                      if (!confirm("Delete this question?")) return;
                      startTransition(async () => {
                        await deleteQuestion(q.id, quiz.id);
                        router.refresh();
                      });
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab: Import */}
      {tab === "import" && <ExcelImport quizId={quiz.id} />}
    </div>
  );
}

// =====================================================
// Question Card
// =====================================================
function QuestionCard({
  question,
  index,
  onDelete,
}: {
  question: any;
  index: number;
  onDelete: () => void;
}) {
  const isEssay = question.question_type === "essay";

  return (
    <li className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-brand text-brand-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{question.question_text}</p>
            {isEssay && (
              <Badge variant="info" className="mt-1">
                <FileText className="w-3 h-3" />
                Essay
              </Badge>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 shrink-0 transition-colors"
          aria-label="Delete question"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MCQ options */}
      {!isEssay && (
        <ul className="space-y-1.5">
          {question.options.map((o: any, oi: number) => (
            <li
              key={o.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                o.is_correct
                  ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300 font-medium"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="text-xs font-bold w-4">
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="flex-1 truncate">{o.option_text}</span>
              {o.is_correct && <Check className="w-3.5 h-3.5 shrink-0" />}
            </li>
          ))}
        </ul>
      )}

      {/* Essay info */}
      {isEssay && (
        <div className="text-xs text-muted-foreground space-y-1">
          {(question.word_limit_min || question.word_limit_max) && (
            <p>
              Word limit:{" "}
              {question.word_limit_min ? `${question.word_limit_min} - ` : ""}
              {question.word_limit_max ? `${question.word_limit_max}` : ""}{" "}
              words
            </p>
          )}
          {question.rubric && (
            <p className="italic">
              <b>Rubric:</b> {question.rubric}
            </p>
          )}
          <p className="text-amber-600 dark:text-amber-400">
            ⚠️ Manual grading required
          </p>
        </div>
      )}

      <Badge variant="info">{question.points} pt(s)</Badge>
    </li>
  );
}
