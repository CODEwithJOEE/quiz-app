"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  KeyRound,
  X,
  AlertCircle,
  Check,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { resetStudentPassword } from "@/src/app/[locale]/(dashboard)/students/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export default function ResetPasswordModal({
  studentId,
  studentName,
  studentEmail,
}: {
  studentId: string;
  studentName: string;
  studentEmail: string;
}) {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  function reset() {
    setPassword("");
    setError(null);
    setSuccess(false);
    setShowPw(false);
    setCopied(false);
  }

  function handleGenerate() {
    setPassword(generatePassword());
    setShowPw(true);
    setError(null);
    setCopied(false);
  }

  function handleSubmit() {
    setError(null);
    setCopied(false);

    if (password.trim().length < 6) {
      setError(t("minLength"));
      return;
    }

    startTransition(async () => {
      const res = await resetStudentPassword(studentId, password);

      if (res?.error) {
        setError(res.error);
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="inline-flex items-center justify-center w-8 h-8 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-lg transition-colors"
        title={t("reset")}
        aria-label={t("reset")}
      >
        <KeyRound className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{t("reset")}</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {studentName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={pending}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            aria-label={t("cancel")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{t("successTitle")}</p>
                <p className="text-xs mt-0.5">{t("successHint")}</p>
              </div>
            </div>

            {/* Show password */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">
                {t("newPassword")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted font-mono text-sm flex items-center select-all">
                  {password}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center shrink-0 transition-colors"
                  aria-label={t("copyPassword")}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("giveTo")}
                <b>{studentEmail}</b>
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              {t("done")}
            </Button>
          </div>
        ) : (
          <>
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 p-3 rounded-xl text-xs">
              {t("warning")}
            </div>

            {/* Auto-generate button */}
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={pending}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4" />
              {t("autoGenerate")}
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Custom input */}
            <div className="relative">
              <Input
                label={t("customPassword")}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("customPlaceholder")}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground mt-[10px]"
                aria-label={t("togglePassword")}
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Actions */}
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
                onClick={handleSubmit}
                loading={pending}
                disabled={pending || password.length < 6}
                className="flex-1"
              >
                {pending ? t("resetting") : t("reset")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
