"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, DoorOpen, History } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BackButton({ roomId }: { roomId: string }) {
  const t = useTranslations("Result");
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  if (from === "history") {
    return (
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => router.push("/history")}
      >
        <History className="w-4 h-4" />
        {t("backToHistory")}
      </Button>
    );
  }

  if (from === "room") {
    return (
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => router.push(`/rooms/${roomId}`)}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToRoom")}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push(`/rooms/${roomId}`);
          }
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground"
        onClick={() => router.push(`/rooms/${roomId}`)}
      >
        <DoorOpen className="w-3.5 h-3.5" />
        {t("goToRoom")}
      </Button>
    </div>
  );
}
