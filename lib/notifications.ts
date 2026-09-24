import { createClient } from "@/lib/supabase/server";

/**
 * Get count of pending room invitations for a student
 */
export async function getStudentPendingInvitationsCount(
  studentId: string,
): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("room_members")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("status", "pending");

  return count ?? 0;
}

/**
 * Get count of pending room memberships across a teacher's rooms
 * (students who were invited but haven't accepted)
 */
export async function getTeacherPendingCount(
  teacherId: string,
): Promise<number> {
  const supabase = await createClient();

  // Get all rooms owned by this teacher
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id")
    .eq("teacher_id", teacherId);

  if (!rooms || rooms.length === 0) return 0;

  const roomIds = rooms.map((r: any) => r.id);

  // Count pending invitations in those rooms
  const { count } = await supabase
    .from("room_members")
    .select("*", { count: "exact", head: true })
    .in("room_id", roomIds)
    .eq("status", "pending");

  return count ?? 0;
}
export async function getTeacherPendingPhotosCount(
  teacherId: string,
): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("avatar_pending", true)
    .not("avatar_url", "is", null)
    .eq("created_by", teacherId);

  return count ?? 0;
}
