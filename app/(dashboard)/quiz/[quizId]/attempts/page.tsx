export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Target,
  Hourglass,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { getQuizAttempts, getQuizSummary } from "@/lib/quiz/attempts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import AttemptsList from "./AttemptsList";

export default async function QuizAttemptsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect("/home");

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select(
      `
      id, title,
      rooms ( id, name, teacher_id )
    `,
    )
    .eq("id", quizId)
    .single();

  if (!quiz) notFound();
  if ((quiz as any).rooms?.teacher_id !== me.id) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Hindi ka owner ng quiz na ito.
          </p>
        </Card>
      </div>
    );
  }

  const [attempts, summary] = await Promise.all([
    getQuizAttempts(quizId),
    getQuizSummary(quizId),
  ]);

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-2">
        <Link
          href={`/quiz/${quizId}`}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{quiz.title}</h1>
          <p className="text-xs text-muted-foreground truncate">
            {(quiz as any).rooms?.name}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand" />
          <h2 className="font-semibold text-sm">Summary</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Total Attempts"
            value={summary.total}
            tone="gray"
          />
          <StatCard
            icon={<Hourglass className="w-4 h-4" />}
            label="In Progress"
            value={summary.inProgress}
            tone="amber"
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Submitted"
            value={summary.submitted}
            tone="green"
          />
          <StatCard
            icon={<XCircle className="w-4 h-4" />}
            label="Terminated"
            value={summary.terminated}
            tone="red"
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Avg Score"
            value={`${summary.avgScore}/${summary.totalPoints}`}
            tone="blue"
          />
          <StatCard
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Violations"
            value={summary.withViolations}
            tone={summary.withViolations > 0 ? "amber" : "gray"}
          />
        </div>
      </div>

      {/* Attempts list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">All Attempts</h2>
          <Badge>{attempts.length}</Badge>
        </div>

        <AttemptsList attempts={attempts} />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "gray" | "green" | "amber" | "red" | "blue";
}) {
  const tones = {
    gray: "bg-muted text-foreground",
    green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    amber: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    red: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  };

  return (
    <div className={`p-3 rounded-2xl ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 opacity-80">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
