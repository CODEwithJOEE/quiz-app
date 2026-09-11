"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function createQuiz(formData: FormData) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const roomId = String(formData.get("room_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const timeLimitRaw = formData.get("time_limit_minutes");
  const timeLimit = timeLimitRaw ? Number(timeLimitRaw) : null;

  if (!roomId || !title) return { error: "Title is required" };

  const supabase = await createClient();

  // Verify room ownership
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("teacher_id", me.id)
    .single();

  if (!room) return { error: "Room not found" };

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert({
      room_id: roomId,
      title,
      description: description || null,
      time_limit_minutes: timeLimit,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/rooms/${roomId}`);
  return { ok: true, quizId: quiz.id };
}

export async function updateQuizStatus(
  quizId: string,
  status: "draft" | "published" | "closed",
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("quizzes")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", quizId);

  if (error) return { error: error.message };

  revalidatePath("/rooms");
  return { ok: true };
}

export async function deleteQuiz(quizId: string) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);

  if (error) return { error: error.message };

  revalidatePath("/rooms");
  return { ok: true };
}
