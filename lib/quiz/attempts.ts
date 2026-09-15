import { createClient } from "@/lib/supabase/server";

export async function getQuizAttempts(quizId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select(
      `
      id, quiz_id, status, score, total_points, started_at, submitted_at,
      termination_reason, grading_status,
      profiles:student_id ( id, full_name, email ),
      integrity_events ( id, event_type, occurred_at, metadata )
    `,
    )
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data ?? []).map((a: any) => ({
    ...a,
    integrity_count: a.integrity_events?.length ?? 0,
  }));
}

export async function getQuizSummary(quizId: string) {
  const attempts = await getQuizAttempts(quizId);

  const submitted = attempts.filter((a) => a.status === "submitted");
  const terminated = attempts.filter((a) => a.status === "terminated");
  const inProgress = attempts.filter((a) => a.status === "in_progress");

  const scores = submitted.map((a) => a.score);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length)
      : 0;

  const totalPoints = attempts[0]?.total_points ?? 0;
  const passThreshold = totalPoints * 0.6;
  const passed = submitted.filter((a) => a.score >= passThreshold).length;

  const withViolations = attempts.filter((a) => a.integrity_count > 0).length;

  return {
    total: attempts.length,
    submitted: submitted.length,
    terminated: terminated.length,
    inProgress: inProgress.length,
    passed,
    failed: submitted.length - passed,
    avgScore,
    totalPoints,
    withViolations,
  };
}
