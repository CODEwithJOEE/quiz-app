export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import {
  PartyPopper,
  BookOpen,
  ShieldX,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import BackButton from "./BackButton";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, room_id, rooms(name)")
    .eq("id", quizId)
    .single();

  if (!quiz) notFound();

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
          <p className="text-sm text-muted-foreground">
            Wala kang attempt para sa quiz na ito.
          </p>
        </Card>
        {/* Back button — smart destination */}
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
      {/* Quiz title */}
      <div className="text-center">
        <h1 className="text-lg font-bold">{quiz.title}</h1>
        <p className="text-xs text-muted-foreground">
          {(quiz as any).rooms?.name}
        </p>
      </div>

      {attempt.grading_status === "pending" ? (
        // Pending grading
        <Card className="p-6 text-center border-2 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8" />
          </div>
          <p className="font-bold text-amber-800 dark:text-amber-300 text-lg">
            Pending Grading
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            May essay questions na kailangan i-grade ng teacher mo.
          </p>
          <div className="mt-5 pt-5 border-t border-amber-200 dark:border-amber-900">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Current Score
            </p>
            <p className="text-2xl font-bold mt-1">
              {attempt.score} / {attempt.total_points}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (Essay points pending)
            </p>
          </div>
        </Card>
      ) : isTerminated ? (
        <Card className="p-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
            <ShieldX className="w-8 h-8" />
          </div>
          <p className="font-bold text-red-800 dark:text-red-300 text-lg">
            Exam Terminated
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            Reason: {attempt.termination_reason ?? "integrity violation"}
          </p>
          <div className="mt-5 pt-5 border-t border-red-200 dark:border-red-900">
            <p className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wide">
              Final Score
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
            {passed ? "Congratulations!" : "Keep Practicing"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {passed ? "You passed the quiz" : "Better luck next time"}
          </p>

          {/* Score */}
          <div className="mt-5 pt-5 border-t border-current/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Your Score
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

      {/* Info footer */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={isTerminated ? "danger" : "success"}>
            <Target className="w-3 h-3" />
            {isTerminated ? "Terminated" : "Submitted"}
          </Badge>
        </div>
        {attempt.submitted_at && (
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border">
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium">
              {new Date(attempt.submitted_at).toLocaleString()}
            </span>
          </div>
        )}
      </Card>

      {/* Back button */}
      {/* Back button — smart destination */}
      <BackButton roomId={quiz.room_id} />
    </div>
  );
}
