"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function getDashboardData() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();

  // =====================================================
  // STATS — parallel fetch
  // =====================================================
  const [
    { count: totalAdmins },
    { count: totalTeachers },
    { count: totalStudents },
    { count: totalRooms },
    { count: totalQuizzes },
    { count: totalAttempts },
    { count: pendingDeletions },
    { count: pendingPhotos },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "super_admin")
      .is("deletion_scheduled_for", null),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "teacher")
      .is("deletion_scheduled_for", null),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")
      .is("deletion_scheduled_for", null),
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase.from("attempts").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .not("deletion_scheduled_for", "is", null),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("avatar_pending", true),
  ]);

  // =====================================================
  // RECENT ACTIVITY
  // =====================================================

  // Latest 5 users created
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Latest 5 quizzes published
  const { data: recentQuizzes } = await supabase
    .from("quizzes")
    .select(
      `
      id, title, status, created_at,
      rooms ( id, name, teacher_id )
    `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  // =====================================================
  // FLAGS — problematic activity
  // =====================================================

  // Latest 5 integrity events
  const { data: recentIntegrityEvents } = await supabase
    .from("integrity_events")
    .select(
      `
      id, event_type, occurred_at,
      attempts (
        id, student_id,
        profiles:student_id ( full_name, email ),
        quizzes ( title )
      )
    `,
    )
    .order("occurred_at", { ascending: false })
    .limit(5);

  return {
    ok: true,
    stats: {
      admins: totalAdmins ?? 0,
      teachers: totalTeachers ?? 0,
      students: totalStudents ?? 0,
      rooms: totalRooms ?? 0,
      quizzes: totalQuizzes ?? 0,
      attempts: totalAttempts ?? 0,
      pendingDeletions: pendingDeletions ?? 0,
      pendingPhotos: pendingPhotos ?? 0,
    },
    recentUsers: recentUsers ?? [],
    recentQuizzes: recentQuizzes ?? [],
    recentIntegrityEvents: recentIntegrityEvents ?? [],
  };
}
