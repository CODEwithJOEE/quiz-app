"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

// =====================================================
// START OR RESUME an attempt
// =====================================================
export async function startAttempt(quizId: string) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  // Check quiz is published
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, status, time_limit_minutes")
    .eq("id", quizId)
    .single();

  if (!quiz) return { error: "Quiz not found" };
  if (quiz.status !== "published")
    return { error: "Hindi pa available ang quiz na ito." };

  // Check if attempt already exists
  const { data: existing } = await supabase
    .from("attempts")
    .select("id, status")
    .eq("quiz_id", quizId)
    .eq("student_id", me.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "in_progress") {
      return { ok: true, attemptId: existing.id, resumed: true };
    }
    // submitted or terminated — cannot retake
    return { error: "Tapos na ang attempt mo para sa quiz na ito." };
  }

  // Count total points
  const { data: questions } = await supabase
    .from("questions")
    .select("points")
    .eq("quiz_id", quizId);

  const totalPoints = (questions ?? []).reduce(
    (s, q) => s + (q.points ?? 0),
    0,
  );

  const { data: attempt, error } = await supabase
    .from("attempts")
    .insert({
      quiz_id: quizId,
      student_id: me.id,
      status: "in_progress",
      total_points: totalPoints,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  return { ok: true, attemptId: attempt.id, resumed: false };
}

// =====================================================
// SAVE a single answer (autosave)
// =====================================================
export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string,
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  // Confirm attempt belongs to student and is in progress
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id, status")
    .eq("id", attemptId)
    .eq("student_id", me.id)
    .single();

  if (!attempt) return { error: "Attempt not found" };
  if (attempt.status !== "in_progress")
    return { error: "Attempt is no longer active" };

  const { error } = await supabase.from("answers").upsert(
    {
      attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
      answered_at: new Date().toISOString(),
    },
    { onConflict: "attempt_id,question_id" },
  );

  if (error) return { error: error.message };
  return { ok: true };
}

// =====================================================
// LOG an integrity event
// =====================================================
export async function logIntegrityEvent(
  attemptId: string,
  eventType: string,
  metadata?: Record<string, any>,
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  // Confirm ownership
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id, status")
    .eq("id", attemptId)
    .eq("student_id", me.id)
    .single();

  if (!attempt || attempt.status !== "in_progress") return { error: "Invalid" };

  const { error } = await supabase.from("integrity_events").insert({
    attempt_id: attemptId,
    event_type: eventType,
    metadata: metadata ?? null,
  });

  if (error) return { error: error.message };
  return { ok: true };
}

// =====================================================
// SUBMIT an attempt (server-side scoring)
// =====================================================
export async function submitAttempt(
  attemptId: string,
  reason: "submitted" | "terminated" = "submitted",
) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Forbidden" };

  const supabase = await createClient();

  // Fetch attempt + verify
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id, student_id, status, quiz_id, total_points")
    .eq("id", attemptId)
    .single();

  if (!attempt) return { error: "Attempt not found" };

  // Students can only submit own; teacher cannot force (yet)
  if (me.role === "student" && attempt.student_id !== me.id)
    return { error: "Forbidden" };

  if (attempt.status !== "in_progress") return { ok: true, alreadyDone: true };

  // Compute score
  const { data: answers } = await supabase
    .from("answers")
    .select(
      `
      id, question_id, selected_option_id,
      questions ( points ),
      options:selected_option_id ( is_correct )
    `,
    )
    .eq("attempt_id", attemptId);

  let score = 0;
  for (const a of answers ?? []) {
    const isCorrect = (a as any).options?.is_correct === true;
    const points = (a as any).questions?.points ?? 0;
    if (isCorrect) score += points;

    // update the answer row's is_correct
    await supabase
      .from("answers")
      .update({ is_correct: isCorrect })
      .eq("id", a.id);
  }

  // Update attempt
  const { error } = await supabase
    .from("attempts")
    .update({
      status: reason === "terminated" ? "terminated" : "submitted",
      score,
      submitted_at: new Date().toISOString(),
      termination_reason:
        reason === "terminated" ? "integrity_violation" : null,
    })
    .eq("id", attemptId);

  if (error) return { error: error.message };

  revalidatePath(`/quiz/${attempt.quiz_id}`);
  return { ok: true, score, total: attempt.total_points };
}

// =====================================================
// TERMINATE (called by client when 3rd violation hit)
// =====================================================
export async function terminateAttempt(attemptId: string, reason: string) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();

  // Verify ownership + in_progress
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id, student_id, status, quiz_id, total_points")
    .eq("id", attemptId)
    .eq("student_id", me.id)
    .single();

  if (!attempt) return { error: "Attempt not found" };
  if (attempt.status !== "in_progress") return { ok: true, alreadyDone: true };

  // Zero out the score
  const { error } = await supabase
    .from("attempts")
    .update({
      status: "terminated",
      score: 0,
      submitted_at: new Date().toISOString(),
      termination_reason: reason,
    })
    .eq("id", attemptId);

  if (error) return { error: error.message };

  revalidatePath(`/quiz/${attempt.quiz_id}`);
  return { ok: true, terminated: true };
}
export async function teacherTerminateAttempt(
  attemptId: string,
  reason: string,
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();

  // Verify attempt belongs to teacher's quiz
  const { data: attempt } = await supabase
    .from("attempts")
    .select(
      `
      id, status, quiz_id,
      quizzes ( room_id, rooms ( teacher_id ) )
    `,
    )
    .eq("id", attemptId)
    .single();

  if (!attempt) return { error: "Attempt not found" };

  const teacherId = (attempt as any).quizzes?.rooms?.teacher_id;
  if (teacherId !== me.id) return { error: "Forbidden" };

  if (attempt.status !== "in_progress") return { ok: true, alreadyDone: true };

  const { error } = await supabase
    .from("attempts")
    .update({
      status: "terminated",
      score: 0,
      submitted_at: new Date().toISOString(),
      termination_reason: `teacher:${reason}`,
    })
    .eq("id", attemptId);

  if (error) return { error: error.message };

  revalidatePath(`/quiz/${attempt.quiz_id}/attempts`);
  return { ok: true };
}

// =====================================================
// TEACHER: manually override a student's score
// =====================================================
export async function teacherOverrideScore(
  attemptId: string,
  newScore: number,
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from("attempts")
    .select(
      `
      id, total_points, quiz_id,
      quizzes ( room_id, rooms ( teacher_id ) )
    `,
    )
    .eq("id", attemptId)
    .single();

  if (!attempt) return { error: "Attempt not found" };

  const teacherId = (attempt as any).quizzes?.rooms?.teacher_id;
  if (teacherId !== me.id) return { error: "Forbidden" };

  if (newScore < 0 || newScore > attempt.total_points) {
    return { error: `Score must be between 0 and ${attempt.total_points}` };
  }

  const { error } = await supabase
    .from("attempts")
    .update({ score: newScore })
    .eq("id", attemptId);

  if (error) return { error: error.message };

  revalidatePath(`/quiz/${attempt.quiz_id}/attempts`);
  return { ok: true };
}
