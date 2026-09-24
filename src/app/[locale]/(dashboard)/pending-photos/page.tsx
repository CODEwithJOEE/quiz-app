export const dynamic = "force-dynamic";

import { redirect } from "@/i18n/navigation";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { EmptyState } from "@/components/ui/EmptyState";
import BackButton from "@/components/BackButton"; // ✅ ADD
import PendingPhotoCard from "./PendingPhotoCard";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function PendingPhotosPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PendingPhotos");

  // ✅ Get the `from` param
  const { from } = await searchParams;
  const backHref = from ? decodeURIComponent(from) : "/home";

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }
  if (me.role !== "teacher" && me.role !== "super_admin") {
    redirect({ href: "/home", locale });
  }

  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, avatar_uploaded_at, created_by")
    .eq("avatar_pending", true)
    .not("avatar_url", "is", null)
    .order("avatar_uploaded_at", { ascending: false });

  if (me.role === "teacher") {
    query = query.eq("created_by", me.id);
  }

  const { data: pendingStudents } = await query;

  const studentsWithUrls = await Promise.all(
    (pendingStudents ?? []).map(async (s) => {
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(s.avatar_url!, 3600);
      return {
        ...s,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  return (
    <div className="space-y-5">
      {/* ✅ Header WITH BackButton */}
      <div className="flex items-center gap-2">
        <BackButton href={backHref} ariaLabel={t("title")} />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {studentsWithUrls.length === 0 ? (
        <EmptyState
          icon={Camera}
          title={t("noPhotos")}
          description={t("noPhotosDesc")}
        />
      ) : (
        <ul className="space-y-3">
          {studentsWithUrls.map((s) => (
            <PendingPhotoCard key={s.id} student={s} />
          ))}
        </ul>
      )}
    </div>
  );
}
