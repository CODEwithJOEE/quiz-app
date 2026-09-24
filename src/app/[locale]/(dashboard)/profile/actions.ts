"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

// =====================================================
// UPDATE FULL NAME
// =====================================================
export async function updateFullName(newName: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  const trimmed = newName.trim();
  if (trimmed.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }
  if (trimmed.length > 60) {
    return { error: "Name is too long (max 60)" };
  }

  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("id", me.id);

  if (profileError) return { error: profileError.message };

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  });

  if (authError) {
    console.error("Auth metadata update failed:", authError);
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  return { ok: true };
}

// =====================================================
// CHANGE PASSWORD
// =====================================================
export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  if (currentPassword === newPassword) {
    return { error: "New password must be different from current" };
  }

  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: me.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect" };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) return { error: updateError.message };

  return { ok: true };
}

// =====================================================
// GET PROFILE STATS (role-aware)
// =====================================================
export async function getProfileStats() {
  const me = await getCurrentProfile();
  if (!me) return null;

  const supabase = await createClient();

  if (me.role === "teacher") {
    const { count: roomCount } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", me.id);

    const { count: studentCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")
      .eq("created_by", me.id);

    const { data: rooms } = await supabase
      .from("rooms")
      .select("id")
      .eq("teacher_id", me.id);

    let quizCount = 0;
    if (rooms && rooms.length > 0) {
      const roomIds = rooms.map((r: any) => r.id);
      const { count } = await supabase
        .from("quizzes")
        .select("*", { count: "exact", head: true })
        .in("room_id", roomIds);
      quizCount = count ?? 0;
    }

    return {
      rooms: roomCount ?? 0,
      students: studentCount ?? 0,
      quizzes: quizCount,
    };
  }

  if (me.role === "student") {
    const { count: roomCount } = await supabase
      .from("room_members")
      .select("*", { count: "exact", head: true })
      .eq("student_id", me.id)
      .eq("status", "accepted");

    const { count: quizCount } = await supabase
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .eq("student_id", me.id)
      .in("status", ["submitted", "terminated"]);

    const { data: attempts } = await supabase
      .from("attempts")
      .select("score, total_points")
      .eq("student_id", me.id)
      .eq("status", "submitted");

    let avgPct = 0;
    if (attempts && attempts.length > 0) {
      const total = attempts.reduce((sum, a) => {
        if (a.total_points > 0) {
          return sum + (a.score / a.total_points) * 100;
        }
        return sum;
      }, 0);
      avgPct = Math.round(total / attempts.length);
    }

    return {
      rooms: roomCount ?? 0,
      quizzes: quizCount ?? 0,
      avgScore: avgPct,
    };
  }

  // Super admin
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return {
    users: totalUsers ?? 0,
  };
}
