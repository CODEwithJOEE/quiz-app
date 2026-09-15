import { createClient } from "@/lib/supabase/server";

type ProfileWithAvatar = {
  id: string;
  avatar_url?: string | null;
  avatar_pending?: boolean | null;
};

export async function attachSignedAvatarUrls<T extends ProfileWithAvatar>(
  profiles: T[],
): Promise<(T & { signedAvatarUrl: string | null })[]> {
  if (!profiles || profiles.length === 0) return [];

  const supabase = await createClient();

  const withAvatars = profiles.filter((p) => p.avatar_url && !p.avatar_pending);

  if (withAvatars.length === 0) {
    return profiles.map((p) => ({ ...p, signedAvatarUrl: null }));
  }

  const paths = withAvatars.map((p) => p.avatar_url!);
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrls(paths, 3600);

  if (error || !data) {
    console.error("[attachSignedAvatarUrls] error:", error);
    return profiles.map((p) => ({ ...p, signedAvatarUrl: null }));
  }

  const urlMap = new Map<string, string>();
  data.forEach((d) => {
    if (d.signedUrl && d.path) {
      urlMap.set(d.path, d.signedUrl);
    }
  });

  return profiles.map((p) => ({
    ...p,
    signedAvatarUrl: p.avatar_url ? (urlMap.get(p.avatar_url) ?? null) : null,
  }));
}
