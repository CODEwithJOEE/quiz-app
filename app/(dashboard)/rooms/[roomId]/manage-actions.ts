"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

// =====================================================
// UPDATE ROOM — edit name, subject, description
// =====================================================
export async function updateRoom(
  roomId: string,
  updates: {
    name: string;
    subject?: string | null;
    description?: string | null;
  },
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const name = updates.name.trim();
  if (name.length < 2) {
    return { error: "Room name must be at least 2 characters" };
  }
  if (name.length > 80) {
    return { error: "Room name is too long (max 80)" };
  }

  const supabase = await createClient();

  // Verify room ownership
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("teacher_id", me.id)
    .single();

  if (!room) return { error: "Room not found or hindi mo ito" };

  const { error } = await supabase
    .from("rooms")
    .update({
      name,
      subject: updates.subject?.trim() || null,
      description: updates.description?.trim() || null,
    })
    .eq("id", roomId);

  if (error) return { error: error.message };

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);
  return { ok: true };
}

// =====================================================
// REMOVE STUDENT from room
// =====================================================
export async function removeStudentFromRoom(roomId: string, studentId: string) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") return { error: "Forbidden" };

  const supabase = await createClient();

  // Verify room ownership
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("teacher_id", me.id)
    .single();

  if (!room) return { error: "Room not found or hindi mo ito" };

  // Get student info for the response
  const { data: student } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", studentId)
    .single();

  // Delete room membership
  const { error } = await supabase
    .from("room_members")
    .delete()
    .eq("room_id", roomId)
    .eq("student_id", studentId);

  if (error) return { error: error.message };

  revalidatePath(`/rooms/${roomId}`);
  return {
    ok: true,
    studentName: student?.full_name,
    studentEmail: student?.email,
  };
}
