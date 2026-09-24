export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import CreateQuizForm from "./CreateQuizForm";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function NewQuizPage({
  params,
}: {
  params: Promise<{ locale: string; roomId: string }>;
}) {
  const { locale, roomId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("QuizCreate");

  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") {
    redirect({ href: "/rooms", locale });
  }

  return (
    <div className="space-y-5">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Link
          href={`/rooms/${roomId}`}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label={t("backToRoom")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <CreateQuizForm roomId={roomId} />
    </div>
  );
}
