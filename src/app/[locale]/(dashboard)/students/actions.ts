"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth";

// =====================================================
// TEACHER: Reset password ng sariling student
// =====================================================
export async function resetStudentPassword(
  studentId: string,
  newPassword: string,
) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  // Only teacher and super_admin can reset
  if (me.role !== "teacher" && me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  // Validate password
  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }
  if (trimmed.length > 72) {
    return { error: "Password is too long (max 72)" };
  }

  const supabase = await createClient();

  // Verify student exists AND is owned by current user (kung teacher)
  const { data: student } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_by")
    .eq("id", studentId)
    .single();

  if (!student) return { error: "Student not found" };
  if (student.role !== "student") {
    return { error: "Pwedeng i-reset ang students lang" };
  }

  // Teacher can only reset own students
  if (me.role === "teacher" && student.created_by !== me.id) {
    return { error: "Hindi mo student ito" };
  }

  // Use admin client to update password
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.updateUserById(studentId, {
    password: trimmed,
  });

  if (error) {
    console.error("[reset-password] error:", error);
    return { error: error.message };
  }

  // Revalidate para lumabas agad sa UI
  revalidatePath("/students");
  revalidatePath("/admin/users");

  return {
    ok: true,
    email: student.email,
    name: student.full_name,
  };
}
