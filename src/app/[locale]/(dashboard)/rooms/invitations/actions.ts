"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function respondToInvitation(
  memberId: string,
  response: "accepted" | "declined",
) {
  const me = await getCurrentProfile();
  if (!me || me.role !== "student") return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("room_members")
    .update({
      status: response,
      joined_at: response === "accepted" ? new Date().toISOString() : null,
    })
    .eq("id", memberId)
    .eq("student_id", me.id); // safety: only own invitation

  if (error) return { error: error.message };

  revalidatePath("/home");
  revalidatePath("/rooms");
  return { ok: true };
}
