"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Lock, X, Check, AlertCircle } from "lucide-react";
import { changePassword } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ChangePasswordModal() {
  const t = useTranslations("ChangePassword");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function reset() {
    setCurrent("");
    setNewPw("");
    setConfirm("");
    setError(null);
    setSuccess(false);
    setShowPw(false);
  }

  function handleSubmit() {
    setError(null);
    if (newPw !== confirm) {
      setError("New passwords do not match");
      return;
    }
    startTransition(async () => {
      const res = await changePassword(current, newPw);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1500);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("title")}</p>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t("title")}</h2>
          <button
            onClick={() => setOpen(false)}
            disabled={pending}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t("success")}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label={t("currentPassword")}
          type={showPw ? "text" : "password"}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={t("currentPlaceholder")}
          autoFocus
        />
        <Input
          label={t("newPassword")}
          type={showPw ? "text" : "password"}
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder={t("newPlaceholder")}
        />
        <Input
          label={t("confirmPassword")}
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={t("confirmPlaceholder")}
        />

        <button
          type="button"
          onClick={() => setShowPw((s) => !s)}
          className="text-xs text-brand hover:underline"
        >
          {showPw ? t("hidePasswords") : t("showPasswords")}
        </button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={pending}
            disabled={pending || !current || !newPw || !confirm || success}
            className="flex-1"
          >
            {pending ? t("updating") : t("update")}
          </Button>
        </div>
      </div>
    </div>
  );
}
