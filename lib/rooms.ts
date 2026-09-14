import { createClient } from "@/lib/supabase/server";

export async function getTeacherRooms(teacherId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id, name, subject, description, created_at,
      room_members ( id, status )
    `,
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r: any) => ({
    ...r,
    student_count: r.room_members.filter((m: any) => m.status === "accepted")
      .length,
    pending_count: r.room_members.filter((m: any) => m.status === "pending")
      .length,
  }));
}

export async function getStudentInvitations(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("room_members")
    .select(
      `
      id, status, invited_at,
      rooms ( id, name, subject, description, teacher_id )
    `,
    )
    .eq("student_id", studentId)
    .eq("status", "pending")
    .order("invited_at", { ascending: false });

  if (error) {
    console.error("[getStudentInvitations] query error:", error);
    throw error;
  }

  // Debug logging (only sa development)
  if (process.env.NODE_ENV === "development") {
    const withNull = (data ?? []).filter((r: any) => r.rooms === null);
    if (withNull.length > 0) {
      console.warn(
        `[getStudentInvitations] ${withNull.length} invitation(s) have null rooms data — check RLS policy on 'rooms' table`,
      );
    }
  }

  // Keep filter as safety net
  return (data ?? []).filter((row: any) => row.rooms !== null);
}

export async function getStudentRooms(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("room_members")
    .select(
      `
      id, status, invited_at, joined_at,
      rooms ( id, name, subject, description, teacher_id )
    `,
    )
    .eq("student_id", studentId)
    .eq("status", "accepted")
    .order("joined_at", { ascending: false });

  if (error) {
    console.error("[getStudentRooms] query error:", error);
    throw error;
  }

  if (process.env.NODE_ENV === "development") {
    const withNull = (data ?? []).filter((r: any) => r.rooms === null);
    if (withNull.length > 0) {
      console.warn(
        `[getStudentRooms] ${withNull.length} room(s) have null rooms data — check RLS policy on 'rooms' table`,
      );
    }
  }

  return (data ?? []).filter((row: any) => row.rooms !== null);
}
