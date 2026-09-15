"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadAvatar } from "./avatar-actions";

export default function AvatarUpload({
  currentUrl,
  pending,
  rejectedReason,
  role,
}: {
  currentUrl?: string | null;
  pending: boolean;
  rejectedReason?: string | null;
  role: "super_admin" | "teacher" | "student";
}) {
  const router = useRouter();
  const [pendingUpload, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadAvatar(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      router.refresh();
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={pendingUpload}
        className="sr-only"
        id="avatar-upload"
      />

      <label
        htmlFor="avatar-upload"
        className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline font-medium cursor-pointer"
      >
        {pendingUpload ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="w-3 h-3" />
            {currentUrl ? "Change photo" : "Upload photo"}
          </>
        )}
      </label>

      {pending && role === "student" && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⏳ Pending approval ng teacher mo.
        </p>
      )}

      {rejectedReason && (
        <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>
            <b>Rejected:</b> {rejectedReason}
          </span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-1.5 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />
          <span>
            {role === "student"
              ? "Na-upload! Hintayin ang approval ng teacher."
              : "Photo updated!"}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
