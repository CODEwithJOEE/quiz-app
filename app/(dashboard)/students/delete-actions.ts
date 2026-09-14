"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth";

const RETENTION_DAYS = 7;

// =====================================================
// SCHEDULE DELETE — mark account for deletion in 7 days
// =====================================================
export async function scheduleDelete(studentId: string, reason?: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  if (me.role !== "teacher" && me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_by, deletion_scheduled_for")
    .eq("id", studentId)
    .single();

  if (!student) return { error: "Student not found" };
  if (student.role !== "student") {
    return { error: "Students lang ang pwedeng i-delete" };
  }
  if (student.deletion_scheduled_for) {
    return { error: "Naka-schedule na ang deletion nito" };
  }

  // Teacher can only delete own students
  if (me.role === "teacher" && student.created_by !== me.id) {
    return { error: "Hindi mo student ito" };
  }

  // Compute deletion date
  const now = new Date();
  const deleteAt = new Date(
    now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );

  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({
      deleted_at: now.toISOString(),
      deletion_scheduled_for: deleteAt.toISOString(),
      deleted_by: me.id,
      deletion_reason: reason?.trim() || null,
    })
    .eq("id", studentId)
    .select("id");

  if (updateError) return { error: updateError.message };
  if (!updated || updated.length === 0) {
    return { error: "Hindi na-update. Possible RLS issue." };
  }

  // Ban user sa auth
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(studentId, {
    ban_duration: "876000h",
  });

  revalidatePath("/students");
  revalidatePath("/admin/users");

  return {
    ok: true,
    email: student.email,
    name: student.full_name,
    scheduledFor: deleteAt.toISOString(),
  };
}

// =====================================================
// RESTORE — cancel scheduled deletion
// =====================================================
export async function restoreStudent(studentId: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  if (me.role !== "teacher" && me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_by, deletion_scheduled_for")
    .eq("id", studentId)
    .single();

  if (!student) return { error: "Student not found" };
  if (!student.deletion_scheduled_for) {
    return { error: "Hindi naka-schedule for deletion" };
  }

  if (me.role === "teacher" && student.created_by !== me.id) {
    return { error: "Hindi mo student ito" };
  }

  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({
      deleted_at: null,
      deletion_scheduled_for: null,
      deleted_by: null,
      deletion_reason: null,
    })
    .eq("id", studentId)
    .select("id");

  if (updateError) return { error: updateError.message };
  if (!updated || updated.length === 0) {
    return { error: "Hindi na-update. Possible RLS issue." };
  }

  // Unban
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(studentId, {
    ban_duration: "none",
  });

  revalidatePath("/students");
  revalidatePath("/admin/users");

  return {
    ok: true,
    email: student.email,
    name: student.full_name,
  };
}

// =====================================================
// LAZY CLEANUP — purge expired deletions
// Called on /students page load or manually by admin
// =====================================================
export async function purgeExpiredDeletions() {
  const me = await getCurrentProfile();
  if (!me || me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // Find expired deletions
  const { data: expired } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .not("deletion_scheduled_for", "is", null)
    .lt("deletion_scheduled_for", new Date().toISOString());

  if (!expired || expired.length === 0) {
    return { ok: true, purged: 0 };
  }

  // Delete from auth (cascades to profiles, attempts, etc.)
  let purgedCount = 0;
  const errors: string[] = [];

  for (const user of expired) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      errors.push(`${user.email}: ${error.message}`);
    } else {
      purgedCount++;
    }
  }

  revalidatePath("/students");
  revalidatePath("/admin/users");

  return {
    ok: true,
    purged: purgedCount,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}
