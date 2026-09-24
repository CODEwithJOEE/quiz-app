"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { scheduleDelete } from "./delete-actions";
import { Button } from "@/components/ui/Button";

const RETENTION_DAYS = 7;

export default function DeleteStudentModal({
  studentId,
  studentName,
  studentEmail,
}: {
  studentId: string;
  studentName: string;
  studentEmail: string;
}) {
  const t = useTranslations("DeleteStudent");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteDate = new Date(
    Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
  const deleteDateStr = deleteDate.toLocaleDateString();

  function handleOpen() {
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setError(null);
      setSuccess(false);
    }, 200);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await scheduleDelete(studentId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      router.refresh();
      setTimeout(handleClose, 1500);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
        title={t("buttonLabel")}
        aria-label={t("buttonLabel")}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{t("title")}</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {studentName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={pending}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{t("successTitle")}</p>
              <p className="text-xs mt-0.5">
                {t("successDesc", { days: RETENTION_DAYS })}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!success && (
          <>
            <div className="bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 p-3 rounded-xl text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-semibold text-sm">
                  {t("question", { name: studentName })}
                </p>
              </div>

              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>
                  <b>{t("bullet1")}</b>
                </li>
                <li>{t("bullet2")}</li>
                <li>
                  <b>{t("bullet3", { days: RETENTION_DAYS })}</b>
                </li>
                <li>{t("bullet4", { days: RETENTION_DAYS })}</li>
              </ul>

              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-red-200 dark:border-red-900">
                <Calendar className="w-3.5 h-3.5" />
                <p className="text-[11px]">
                  {t("scheduledFor")} <b>{deleteDateStr}</b>
                </p>
              </div>

              <p className="text-[10px] text-red-700 dark:text-red-400">
                {t("email")} {studentEmail}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={pending}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleDelete}
                loading={pending}
                variant="danger"
                className="flex-1"
              >
                {!pending && <Trash2 className="w-4 h-4" />}
                {pending ? t("deleting") : t("delete")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
