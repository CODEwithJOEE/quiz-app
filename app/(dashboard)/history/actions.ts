"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

// =====================================================
// GET STUDENT ATTEMPT HISTORY
// =====================================================
export async function getStudentHistory() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select(
      `
      id,
      status,
      score,
      total_points,
      started_at,
      submitted_at,
      termination_reason,
      quiz_id,
      quizzes (
        id,
        title,
        description,
        room_id,
        rooms (
          id,
          name,
          subject
        )
      )
    `,
    )
    .eq("student_id", me.id)
    .in("status", ["submitted", "terminated"])
    .order("submitted_at", { ascending: false });

  if (error) return { error: error.message };

  // Filter out rows where quiz or room is null (RLS blocked)
  const clean = (data ?? []).filter((a: any) => a.quizzes && a.quizzes.rooms);

  return { ok: true, attempts: clean };
}

// =====================================================
// GET STUDENT STATS
// =====================================================
export async function getStudentStats() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("status, score, total_points")
    .eq("student_id", me.id)
    .in("status", ["submitted", "terminated"]);

  if (!attempts) {
    return {
      ok: true,
      stats: { taken: 0, avg: 0, best: 0, terminated: 0 },
    };
  }

  const submitted = attempts.filter((a) => a.status === "submitted");
  const terminated = attempts.filter((a) => a.status === "terminated");

  const percentages = submitted
    .filter((a) => a.total_points > 0)
    .map((a) => Math.round((a.score / a.total_points) * 100));

  const avg =
    percentages.length > 0
      ? Math.round(percentages.reduce((s, x) => s + x, 0) / percentages.length)
      : 0;

  const best = percentages.length > 0 ? Math.max(...percentages) : 0;

  return {
    ok: true,
    stats: {
      taken: attempts.length,
      avg,
      best,
      terminated: terminated.length,
    },
  };
}
