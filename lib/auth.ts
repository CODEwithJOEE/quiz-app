import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "teacher" | "student";
  created_by: string | null;
  grade_level: string | null;
  section: string | null;
  avatar_url: string | null;
  avatar_pending: boolean;
  avatar_rejected_reason: string | null;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, created_by, grade_level, section, avatar_url, avatar_pending, avatar_rejected_reason",
    )
    .eq("id", user.id)
    .single();

  return profile;
}
