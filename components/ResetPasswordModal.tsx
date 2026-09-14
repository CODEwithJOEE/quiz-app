"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { resetStudentPassword } from "@/app/(dashboard)/students/actions";
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
      setError("Password must be at least 6 characters");
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
        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <KeyRound className="w-3.5 h-3.5" />
        Reset Password
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
              <h2 className="font-semibold text-sm">Reset Password</h2>
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

        {/* Success state */}
        {success ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Password reset successful!</p>
                <p className="text-xs mt-0.5">
                  Ibigay ito sa student — huwag kalimutan!
                </p>
              </div>
            </div>

            {/* Show password */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">
                New Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted font-mono text-sm flex items-center select-all">
                  {password}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Copy password"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ibigay sa: <b>{studentEmail}</b>
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
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
              ⚠️ Ang lumang password ay hindi na gagana pagkatapos i-reset.
            </div>

            {/* Auto-generate button */}
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={pending}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4" />
              Auto-generate Password
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Custom input */}
            <div className="relative">
              <Input
                label="Custom Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground mt-[10px]"
                aria-label="Toggle password visibility"
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
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={pending}
                disabled={pending || password.length < 6}
                className="flex-1"
              >
                {pending ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
