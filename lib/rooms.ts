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

  if (error) throw error;

  // Filter out rows where nested rooms is null (RLS blocked or deleted room)
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

  if (error) throw error;

  return (data ?? []).filter((row: any) => row.rooms !== null);
}
