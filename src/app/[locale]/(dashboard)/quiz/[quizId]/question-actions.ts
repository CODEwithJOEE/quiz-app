"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import type { ParsedQuestion } from "@/lib/quiz/parseExcel";

export async function addQuestion(
  quizId: string,
  questionText: string,
  options: { text: string; isCorrect: boolean }[],
  points = 1,
  questionType: "multiple_choice" | "essay" = "multiple_choice",
  extras?: {
    wordLimitMin?: number | null;
    wordLimitMax?: number | null;
    rubric?: string | null;
  },
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  if (!questionText.trim()) return { error: "Question text required" };

  // Validate based sa type
  if (questionType === "multiple_choice") {
    if (options.length < 2) return { error: "At least 2 options required" };
    if (!options.some((o) => o.isCorrect))
      return { error: "Mark one option as correct" };
  }

  const supabase = await createClient();

  // Get current max order_index
  const { data: existing } = await supabase
    .from("questions")
    .select("order_index")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder =
    existing?.[0]?.order_index != null ? existing[0].order_index + 1 : 0;

  // Insert question
  const { data: question, error } = await supabase
    .from("questions")
    .insert({
      quiz_id: quizId,
      question_text: questionText,
      question_type: questionType,
      points,
      order_index: nextOrder,
      word_limit_min: extras?.wordLimitMin ?? null,
      word_limit_max: extras?.wordLimitMax ?? null,
      rubric: extras?.rubric ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Insert options (MCQ lang)
  if (questionType === "multiple_choice") {
    const optionRows = options.map((o, i) => ({
      question_id: question.id,
      option_text: o.text,
      is_correct: o.isCorrect,
      order_index: i,
    }));

    const { error: optErr } = await supabase.from("options").insert(optionRows);

    if (optErr) return { error: optErr.message };
  }

  revalidatePath(`/quiz/${quizId}`);
  return { ok: true };
}

export async function deleteQuestion(questionId: string, quizId: string) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) return { error: error.message };

  revalidatePath(`/quiz/${quizId}`);
  return { ok: true };
}

export async function bulkInsertQuestions(
  quizId: string,
  parsed: ParsedQuestion[],
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();

  // Get starting order
  const { data: existing } = await supabase
    .from("questions")
    .select("order_index")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: false })
    .limit(1);

  let nextOrder =
    existing?.[0]?.order_index != null ? existing[0].order_index + 1 : 0;

  let inserted = 0;

  for (const q of parsed) {
    // Determine question type (default to multiple_choice for old format)
    const questionType = q.question_type ?? "multiple_choice";

    const { data: question, error } = await supabase
      .from("questions")
      .insert({
        quiz_id: quizId,
        question_text: q.question_text,
        question_type: questionType,
        points: q.points,
        order_index: nextOrder++,
        // Essay fields (null for MCQ)
        word_limit_min:
          questionType === "essay" ? (q.word_limit_min ?? null) : null,
        word_limit_max:
          questionType === "essay" ? (q.word_limit_max ?? null) : null,
        rubric: questionType === "essay" ? (q.rubric ?? null) : null,
      })
      .select("id")
      .single();

    if (error) continue;

    // Insert options (MCQ only)
    if (questionType === "multiple_choice" && q.options.length > 0) {
      const optionRows = q.options.map((o) => ({
        question_id: question.id,
        option_text: o.option_text,
        is_correct: o.is_correct,
        order_index: o.order_index,
      }));

      const { error: optErr } = await supabase
        .from("options")
        .insert(optionRows);

      if (!optErr) inserted++;
    } else {
      // Essay — no options, count as inserted
      inserted++;
    }
  }

  revalidatePath(`/quiz/${quizId}`);
  return { ok: true, inserted };
}
