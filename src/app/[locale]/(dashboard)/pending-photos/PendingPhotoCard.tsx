"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Check, X, AlertCircle, Mail } from "lucide-react";
import { approveAvatar, rejectAvatar } from "../profile/avatar-actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PendingPhotoCard({ student }: { student: any }) {
  const t = useTranslations("PendingPhotoCard");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const res = await approveAvatar(student.id);
      if (res?.error) {
        setError(res.error);
        return;
      }

      // ✅ Dispatch event para mag-refresh yung badge sa nav
      window.dispatchEvent(new CustomEvent("badge-refresh"));

      router.refresh();
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      const res = await rejectAvatar(student.id, reason);
      if (res?.error) {
        setError(res.error);
        return;
      }

      // ✅ Dispatch event para mag-refresh yung badge sa nav
      window.dispatchEvent(new CustomEvent("badge-refresh"));

      router.refresh();
    });
  }

  return (
    <li>
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={student.signedUrl}
            alt="Pending"
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {student.full_name}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{student.email}</span>
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
              ⏳ {t("uploaded")}{" "}
              {student.avatar_uploaded_at
                ? new Date(student.avatar_uploaded_at).toLocaleString()
                : t("recently")}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!rejecting ? (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setRejecting(true)}
              disabled={pending}
              className="flex-1"
            >
              <X className="w-4 h-4" />
              {t("reject")}
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              loading={pending}
              className="flex-1"
            >
              {!pending && <Check className="w-4 h-4" />}
              {pending ? t("approving") : t("approve")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium">{t("reasonOptional")}</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("reasonPlaceholder")}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setRejecting(false);
                  setReason("");
                }}
                disabled={pending}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={pending}
                className="flex-1"
              >
                {!pending && <X className="w-4 h-4" />}
                {pending ? t("rejecting") : t("confirmReject")}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </li>
  );
}
