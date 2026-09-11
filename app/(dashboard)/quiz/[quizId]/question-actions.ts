"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function addQuestion(
  quizId: string,
  questionText: string,
  options: { text: string; isCorrect: boolean }[],
  points = 1,
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  if (!questionText.trim()) return { error: "Question text required" };
  if (options.length < 2) return { error: "At least 2 options required" };
  if (!options.some((o) => o.isCorrect))
    return { error: "Mark one option as correct" };

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

  const { data: question, error } = await supabase
    .from("questions")
    .insert({
      quiz_id: quizId,
      question_text: questionText,
      question_type: "multiple_choice",
      points,
      order_index: nextOrder,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const optionRows = options.map((o, i) => ({
    question_id: question.id,
    option_text: o.text,
    is_correct: o.isCorrect,
    order_index: i,
  }));

  const { error: optErr } = await supabase.from("options").insert(optionRows);
  if (optErr) return { error: optErr.message };

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
  parsed: {
    question_text: string;
    points: number;
    options: {
      option_text: string;
      is_correct: boolean;
      order_index: number;
    }[];
  }[],
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
    const { data: question, error } = await supabase
      .from("questions")
      .insert({
        quiz_id: quizId,
        question_text: q.question_text,
        question_type: "multiple_choice",
        points: q.points,
        order_index: nextOrder++,
      })
      .select("id")
      .single();

    if (error) continue;

    const optionRows = q.options.map((o) => ({
      question_id: question.id,
      option_text: o.option_text,
      is_correct: o.is_correct,
      order_index: o.order_index,
    }));

    const { error: optErr } = await supabase.from("options").insert(optionRows);
    if (!optErr) inserted++;
  }

  revalidatePath(`/quiz/${quizId}`);
  return { ok: true, inserted };
}
