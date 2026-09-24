"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteRoom } from "../actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
  const t = useTranslations("DeleteRoom");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await deleteRoom(roomId);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
      return;
    }
    router.push("/rooms");
    router.refresh();
  }

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 className="w-4 h-4" />
        {t("button")}
      </Button>
    );
  }

  return (
    <Card className="p-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-red-800 dark:text-red-300">
            {t("title")}
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
            {t("warning")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => setConfirming(false)}
          disabled={loading}
        >
          {t("cancel")}
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="flex-1"
          onClick={handleDelete}
          loading={loading}
        >
          {loading ? t("deleting") : t("confirm")}
        </Button>
      </div>
    </Card>
  );
}
