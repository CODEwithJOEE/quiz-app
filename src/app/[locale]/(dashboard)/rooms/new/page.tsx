export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import CreateRoomForm from "./CreateRoomForm";
import { getLocale, setRequestLocale, getTranslations } from "next-intl/server";

export default async function NewRoomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect({ href: "/rooms", locale });

  const t = await getTranslations("Rooms");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link
          href="/rooms"
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label={t("backToRooms")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{t("createRoomTitle")}</h1>
          <p className="text-xs text-muted-foreground">
            {t("createRoomSubtitle")}
          </p>
        </div>
      </div>

      <CreateRoomForm />
    </div>
  );
}
