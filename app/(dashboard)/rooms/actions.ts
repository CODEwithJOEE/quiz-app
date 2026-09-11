"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function createRoom(formData: FormData) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") {
    return { error: "Only teachers can create rooms" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { error: "Room name is required" };

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert({
    teacher_id: me.id,
    name,
    subject: subject || null,
    description: description || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/rooms");
  return { ok: true };
}

export async function deleteRoom(roomId: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId)
    .eq("teacher_id", me.id); // safety: only own rooms

  if (error) return { error: error.message };

  revalidatePath("/rooms");
  return { ok: true };
}

export async function inviteStudents(roomId: string, studentIds: string[]) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };
  if (studentIds.length === 0) return { error: "No students selected" };

  const supabase = await createClient();

  // Verify room belongs to this teacher
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("teacher_id", me.id)
    .single();

  if (!room) return { error: "Room not found" };

  // Upsert: if already invited, keep existing status
  const rows = studentIds.map((sid) => ({
    room_id: roomId,
    student_id: sid,
    status: "pending" as const,
  }));

  const { error } = await supabase
    .from("room_members")
    .upsert(rows, { onConflict: "room_id,student_id", ignoreDuplicates: true });

  if (error) return { error: error.message };

  revalidatePath(`/rooms/${roomId}`);
  return { ok: true };
}
