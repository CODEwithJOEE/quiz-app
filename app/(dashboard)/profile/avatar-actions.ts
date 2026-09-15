"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// =====================================================
// STUDENT/TEACHER: Upload avatar (goes to pending)
// =====================================================
export async function uploadAvatar(formData: FormData) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "Walang file na ni-upload" };

  // Validate
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Sobra ang laki ng file. Max 2 MB lang." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Hindi supported ang file type. JPEG, PNG, o WebP lang." };
  }

  const supabase = await createClient();

  // Determine file extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${me.id}/avatar-${Date.now()}.${ext}`;

  // Delete old files in user's folder first
  const { data: oldFiles } = await supabase.storage.from("avatars").list(me.id);

  if (oldFiles && oldFiles.length > 0) {
    await supabase.storage
      .from("avatars")
      .remove(oldFiles.map((f) => `${me.id}/${f.name}`));
  }

  // Upload new file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) return { error: uploadError.message };

  // Determine if auto-approve (teachers and admins don't need approval)
  const needsApproval = me.role === "student";

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: fileName,
      avatar_pending: needsApproval, // ← Only students need approval
      avatar_rejected_reason: null,
      avatar_uploaded_at: new Date().toISOString(),
    })
    .eq("id", me.id);

  if (updateError) {
    // Clean up uploaded file
    await supabase.storage.from("avatars").remove([fileName]);
    return { error: updateError.message };
  }

  revalidatePath("/profile");
  return { ok: true, pending: true };
}

// =====================================================
// TEACHER: Approve avatar
// =====================================================
export async function approveAvatar(studentId: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };
  if (me.role !== "teacher" && me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();

  // Verify ownership (teacher can only approve own students)
  const { data: student } = await supabase
    .from("profiles")
    .select("id, created_by, role")
    .eq("id", studentId)
    .single();

  if (!student) return { error: "Student not found" };

  if (me.role === "teacher" && student.created_by !== me.id) {
    return { error: "Hindi mo student ito" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_pending: false,
      avatar_rejected_reason: null,
    })
    .eq("id", studentId);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/students");
  revalidatePath("/admin/pending-photos");
  return { ok: true };
}

// =====================================================
// TEACHER: Reject avatar
// =====================================================
export async function rejectAvatar(studentId: string, reason: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Not signed in" };
  if (me.role !== "teacher" && me.role !== "super_admin") {
    return { error: "Forbidden" };
  }

  const supabase = await createClient();

  // Verify ownership
  const { data: student } = await supabase
    .from("profiles")
    .select("id, created_by, avatar_url")
    .eq("id", studentId)
    .single();

  if (!student) return { error: "Student not found" };

  if (me.role === "teacher" && student.created_by !== me.id) {
    return { error: "Hindi mo student ito" };
  }

  // Delete the file from storage
  if (student.avatar_url) {
    await supabase.storage.from("avatars").remove([student.avatar_url]);
  }

  // Clear avatar fields
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: null,
      avatar_pending: false,
      avatar_rejected_reason: reason || "Hindi approved ang photo.",
    })
    .eq("id", studentId);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/students");
  revalidatePath("/admin/pending-photos");
  return { ok: true };
}

// =====================================================
// Get signed URL for avatar (for private bucket)
// =====================================================
export async function getAvatarSignedUrl(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(path, 3600); // 1 hour

  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
