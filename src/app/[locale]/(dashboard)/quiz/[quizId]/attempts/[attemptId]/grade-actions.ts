"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function gradeAttempt(
  attemptId: string,
  quizId: string,
  data: {
    scores: Record<string, number>;
    answerFeedback: Record<string, string>;
    teacherFeedback: string;
  },
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();

  console.log("[gradeAttempt] START", { attemptId, quizId });
  console.log("[gradeAttempt] scores data:", data.scores);
  console.log("[gradeAttempt] feedback data:", data.answerFeedback);

  // Verify attempt belongs to teacher's quiz
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select(
      `
      id, quiz_id, total_points, status,
      quizzes ( room_id, rooms ( teacher_id ) )
    `,
    )
    .eq("id", attemptId)
    .single();

  console.log("[gradeAttempt] attempt fetch:", {
    attempt,
    error: attemptError,
  });

  if (!attempt) return { error: "Attempt not found" };
  if ((attempt as any).quizzes?.rooms?.teacher_id !== me.id) {
    return { error: "Forbidden" };
  }

  // Get all answers with question info
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select(
      `
      id, question_id,
      questions ( points, question_type )
    `,
    )
    .eq("attempt_id", attemptId);

  console.log("[gradeAttempt] answers fetch:", {
    count: answers?.length,
    answers,
    error: answersError,
  });

  if (!answers) return { error: "Walang answers" };

  // Update each essay answer
  for (const a of answers) {
    const qType = (a as any).questions?.question_type;
    console.log(`[gradeAttempt] answer ${a.id} type:`, qType);

    if (qType === "essay") {
      const points = data.scores[a.id] ?? 0;
      const fb = data.answerFeedback[a.id] ?? null;

      console.log(`[gradeAttempt] updating essay answer ${a.id}:`, {
        points,
        fb,
      });

      const { data: updated, error: updateErr } = await supabase
        .from("answers")
        .update({
          points_awarded: points,
          feedback: fb,
        })
        .eq("id", a.id)
        .select("id, points_awarded, feedback");

      console.log(`[gradeAttempt] answer ${a.id} update result:`, {
        updated,
        error: updateErr,
      });
    }
  }

  // Compute total score
  const { data: allAnswers } = await supabase
    .from("answers")
    .select(
      `
      id,
      points_awarded,
      questions ( points, question_type ),
      options:selected_option_id ( is_correct )
    `,
    )
    .eq("attempt_id", attemptId);

  let totalScore = 0;
  for (const a of allAnswers ?? []) {
    const qType = (a as any).questions?.question_type ?? "multiple_choice";
    const points = (a as any).questions?.points ?? 0;

    if (qType === "essay") {
      totalScore += a.points_awarded ?? 0;
    } else {
      if ((a as any).options?.is_correct) totalScore += points;
    }
  }

  console.log("[gradeAttempt] computed totalScore:", totalScore);

  // Update attempt
  const { data: updatedAttempt, error: attemptUpdateErr } = await supabase
    .from("attempts")
    .update({
      score: totalScore,
      grading_status: "graded",
      graded_at: new Date().toISOString(),
      graded_by: me.id,
      teacher_feedback: data.teacherFeedback || null,
    })
    .eq("id", attemptId)
    .select("id, score, grading_status");

  console.log("[gradeAttempt] attempt update result:", {
    updatedAttempt,
    error: attemptUpdateErr,
  });

  if (attemptUpdateErr) return { error: attemptUpdateErr.message };
  if (!updatedAttempt || updatedAttempt.length === 0) {
    return { error: "Hindi na-update ang attempt (RLS issue?)." };
  }

  revalidatePath(`/quiz/${quizId}/attempts`);
  revalidatePath(`/quiz/${quizId}/attempts/${attemptId}/grade`);
  return { ok: true, score: totalScore };
}
